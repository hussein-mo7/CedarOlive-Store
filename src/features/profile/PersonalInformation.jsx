import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMe } from "../../api/users/userApi";
import { setCurrentUser } from "../../redux/userSlice";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function PersonalInformation() {
  const { user } = useOutletContext();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.photo || "");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    if (user.photo) setPreview(user.photo);
  }, [user]);

  const onPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be under 5MB");
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (photo) body.append("photo", photo);
    const result = await dispatch(updateMe(body));
    setSaving(false);
    if (updateMe.fulfilled.match(result)) {
      const nextUser = result.payload?.data || { ...user, ...form, photo: preview };
      dispatch(setCurrentUser(nextUser));
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated");
      setEditing(false);
      setPhoto(null);
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Personal details</h1>
        <Button type="button" variant="outline" size="sm" onClick={() => setEditing((value) => !value)}>
          {editing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <img src={preview} alt="" className="h-20 w-20 rounded-full object-cover" />
        {editing && (
          <>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
            <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
              Change photo
            </Button>
          </>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Name" value={form.name} disabled={!editing} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" value={form.email} disabled={!editing} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" value={form.phone} disabled={!editing} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Address" value={form.address} disabled={!editing} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      {editing && (
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      )}
    </form>
  );
}
