import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { deleteOrder, getAllOrders, updateOrder } from "../../api/order/orderApi";
import Badge, { statusTone } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import { formatPrice } from "../../lib/product";
import { Spinner } from "../../components/ui/Skeleton";

const STATUSES = ["placed", "packed", "shipped", "delivered", "canceled"];

export default function OrdersManagement() {
  const dispatch = useDispatch();
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["getAllOrders"],
    queryFn: getAllOrders,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ orderStatus: "placed", isDelivered: false });
  const [toDelete, setToDelete] = useState(null);
  const perPage = 8;

  const filtered = (orders || []).filter((order) => {
    const term = search.toLowerCase();
    return [order.user?.name, order.user?.email, order._id, order.orderStatus]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  const openEdit = (order) => {
    setSelected(order);
    setForm({
      orderStatus: order.orderStatus || "placed",
      isDelivered: Boolean(order.isDelivered),
    });
  };

  const save = async () => {
    await dispatch(
      updateOrder({
        orderId: selected._id,
        updateData: {
          orderStatus: form.orderStatus,
          isDelivered: form.isDelivered,
          deliveredAt: form.isDelivered ? new Date() : null,
        },
      })
    ).unwrap();
    setSelected(null);
    refetch();
  };

  const remove = async () => {
    await dispatch(deleteOrder(toDelete._id)).unwrap();
    setToDelete(null);
    refetch();
  };

  if (isLoading) return <Spinner label="Loading orders" />;

  return (
    <div>
      <h1 className="text-4xl">Orders</h1>
      <div className="mt-6 max-w-md">
        <Input placeholder="Search name, email, id, or status" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-borderColor bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-text">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order._id} className="border-t border-borderColor">
                <td className="p-3">
                  <p>{order.user?.name || "Guest"}</p>
                  <p className="text-text">{order.user?.email}</p>
                </td>
                <td className="p-3">{order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : ""}</td>
                <td className="p-3">{formatPrice(order.totalPrice)}</td>
                <td className="p-3"><Badge tone={statusTone(order.orderStatus)}>{order.orderStatus}</Badge></td>
                <td className="p-3 text-right">
                  <button type="button" className="mr-3 text-secondary" onClick={() => openEdit(order)}>Edit</button>
                  <button type="button" className="text-red-700" onClick={() => setToDelete(order)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: pages }).map((_, index) => (
          <Button key={index} size="sm" variant={page === index + 1 ? "primary" : "outline"} onClick={() => setPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </div>
      <Modal open={Boolean(selected)} title="Update order" onClose={() => setSelected(null)}>
        <div className="space-y-4">
          <Select label="Status" value={form.orderStatus} onChange={(e) => setForm({ ...form, orderStatus: e.target.value })}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDelivered} onChange={(e) => setForm({ ...form, isDelivered: e.target.checked })} />
            Mark as delivered
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      </Modal>
      <Modal open={Boolean(toDelete)} title="Delete this order?" onClose={() => setToDelete(null)}>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
