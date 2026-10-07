import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUserById, useGetAllUsers } from "../../api/users/userApi";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

export default function Customers() {
  const { data, isLoading } = useGetAllUsers();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return (data || []).filter((user) =>
      [user.name, user.email, user.role].some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [data, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  const remove = async () => {
    const id = target.id || target._id;
    try {
      await dispatch(deleteUserById(id)).unwrap();
      toast.success("Customer removed");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      setTarget(null);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Could not delete the customer");
    }
  };

  return (
    <div>
      <h1 className="text-4xl">Customers</h1>
      <div className="mt-6 max-w-md">
        <Input placeholder="Search customers" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      {isLoading ? (
        <p className="mt-6 text-text">Loading customers…</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-borderColor bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-text">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => {
                const id = user.id || user._id;
                return (
                  <tr key={id} className="border-t border-borderColor">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3"><Badge>{user.role || "user"}</Badge></td>
                    <td className="p-3 text-right">
                      <button type="button" className="mr-3 text-secondary" onClick={() => navigate(`/admin/users/edit/${id}`)}>Edit</button>
                      <button type="button" className="text-red-700" onClick={() => setTarget(user)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        {Array.from({ length: pages }).map((_, index) => (
          <Button key={index} size="sm" variant={page === index + 1 ? "primary" : "outline"} onClick={() => setPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </div>
      <Modal open={Boolean(target)} title="Remove this customer?" onClose={() => setTarget(null)}>
        <p className="text-sm text-text">{target?.name} will lose access to their account.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
