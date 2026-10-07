import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetAllUsers } from "../../api/users/userApi";
import { getAllOrders } from "../../api/order/orderApi";
import { formatPrice } from "../../lib/product";
import Badge, { statusTone } from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Skeleton";

export default function Dashboard() {
  const { data: users, isLoading: usersLoading, isError: usersError } = useGetAllUsers();
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["getAllOrders"],
    queryFn: getAllOrders,
  });

  const revenue = useMemo(
    () => (orders || []).reduce((sum, order) => sum + (order.totalPrice || 0), 0),
    [orders]
  );

  const salesData = useMemo(() => {
    const buckets = {};
    (orders || []).forEach((order) => {
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const key = date.toLocaleString("en-US", { month: "short" });
      buckets[key] = (buckets[key] || 0) + (order.totalPrice || 0);
    });
    return Object.entries(buckets).map(([month, total]) => ({ month, total }));
  }, [orders]);

  if (isLoading || usersLoading) return <Spinner label="Loading dashboard" />;
  if (isError || usersError) {
    return <p className="text-red-700">Dashboard data could not be loaded.</p>;
  }

  const cards = [
    { label: "Revenue", value: formatPrice(revenue) },
    { label: "Orders", value: orders?.length || 0 },
    { label: "Customers", value: users?.length || 0 },
  ];

  return (
    <div>
      <h1 className="text-4xl">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="text-sm text-text">{card.label}</p>
            <p className="mt-2 text-3xl">{card.value}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 p-5">
        <h2 className="text-2xl">Sales</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid stroke="#e6dcd2" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#a0522d" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="mt-6 overflow-hidden">
        <h2 className="px-5 pt-5 text-2xl">Recent orders</h2>
        <ul className="mt-3 divide-y divide-borderColor">
          {(orders || []).slice(0, 6).map((order) => (
            <li key={order._id} className="flex items-center justify-between px-5 py-3 text-sm">
              <span>{order.user?.name || "Customer"}</span>
              <Badge tone={statusTone(order.orderStatus)}>{order.orderStatus}</Badge>
              <span>{formatPrice(order.totalPrice)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
