import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getMyOrders } from "../../api/order/orderApi";
import Badge, { statusTone } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { formatPrice } from "../../lib/product";

export default function Orders() {
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
  });

  if (isLoading) return <Spinner label="Loading orders" />;
  if (isError) {
    return <p className="text-red-700">{error?.message || "Could not load orders."}</p>;
  }
  if (!orders?.length) {
    return <EmptyState title="No orders yet" description="When you check out, they will show up here." />;
  }

  return (
    <div>
      <h1 className="text-3xl">Orders</h1>
      <ul className="mt-6 space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="rounded-2xl border border-borderColor p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">Order {order._id.slice(-6)}</p>
                <p className="text-sm text-text">
                  {order.createdAt ? format(new Date(order.createdAt), "MMMM d, yyyy") : ""}
                </p>
              </div>
              <Badge tone={statusTone(order.orderStatus)}>{order.orderStatus}</Badge>
            </div>
            <p className="mt-3 text-sm">{formatPrice(order.totalPrice)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
