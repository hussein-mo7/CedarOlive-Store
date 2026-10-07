import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { toast } from "sonner";
import { deleteMe, updatePassword } from "../../api/users/userApi";
import { logout } from "../../redux/authSlice";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

export default function AccountSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", password: "", passwordConfirm: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    if (form.password !== form.passwordConfirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      await dispatch(updatePassword(form)).unwrap();
      toast.success("Password updated");
      setForm({ currentPassword: "", password: "", passwordConfirm: "" });
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  const removeAccount = async () => {
    try {
      await dispatch(deleteMe()).unwrap();
      dispatch(logout());
      new Cookies().remove("token", { path: "/" });
      navigate("/");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Could not delete the account");
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={save} className="space-y-4">
        <h1 className="text-3xl">Password</h1>
        <Input label="Current password" type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        <Input label="New password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Input label="Confirm new password" type="password" value={form.passwordConfirm} onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })} />
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Update password"}</Button>
      </form>
      <div className="border-t border-borderColor pt-8">
        <h2 className="text-2xl">Delete account</h2>
        <p className="mt-2 text-sm text-text">This removes your profile. Orders already placed stay on record.</p>
        <Button variant="danger" className="mt-4" onClick={() => setConfirmDelete(true)}>
          Delete account
        </Button>
      </div>
      <Modal open={confirmDelete} title="Delete this account?" onClose={() => setConfirmDelete(false)}>
        <p className="text-sm text-text">You will be signed out immediately.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={removeAccount}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
