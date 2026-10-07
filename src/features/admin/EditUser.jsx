import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { updateUserById, useGetUserById } from "../../api/users/userApi";
import { resetUserStatus } from "../../redux/userSlice";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Skeleton";

export default function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);
  const { data: user, isLoading, isError } = useGetUserById(userId);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [user]);

  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Customer updated");
      dispatch(resetUserStatus());
    }
    if (status === "failed") toast.error(error || "Update failed");
  }, [status, error, dispatch]);

  const change = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setDirty(true);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!dirty) return;
    dispatch(updateUserById({ userId, userData: form }));
  };

  if (isLoading) return <Spinner label="Loading customer" />;
  if (isError) return <p className="text-red-700">This customer could not be loaded.</p>;

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <button type="button" className="text-sm text-secondary" onClick={() => navigate("/admin/customers")}>
        Back to customers
      </button>
      <h1 className="text-4xl">Edit customer</h1>
      <Input label="Name" name="name" value={form.name} onChange={change} />
      <Input label="Email" name="email" value={form.email} onChange={change} />
      <Input label="Phone" name="phone" value={form.phone} onChange={change} />
      <Input label="Address" name="address" value={form.address} onChange={change} />
      <Button type="submit" disabled={!dirty || status === "loading"}>
        {status === "loading" ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
