import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { signUp } from "../../api/auth/authApi";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const empty = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  phone: "",
  address: "",
};

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (new Cookies().get("token")) navigate("/");
  }, [navigate]);

  useEffect(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    setStrength(form.password ? score : 0);
  }, [form.password]);

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    if (form.password !== form.passwordConfirm) next.passwordConfirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      await dispatch(signUp(form)).unwrap();
      navigate("/resend-verification", { state: { email: form.email } });
    } catch (error) {
      setErrors({ general: error?.message || "Could not create the account" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-3xl">Create an account</h1>
      {errors.general && <p className="text-sm text-red-700">{errors.general}</p>}
      <Input label="Name" name="name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <Input label="Password" type="password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <div className="h-1 overflow-hidden rounded-full bg-primary">
        <div className="h-full bg-secondary" style={{ width: `${(strength / 4) * 100}%` }} />
      </div>
      <Input label="Confirm password" type="password" value={form.passwordConfirm} error={errors.passwordConfirm} onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })} />
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Creating…" : "Create account"}
      </Button>
      <p className="text-sm text-text">
        Already registered? <Link to="/signIn" className="text-secondary">Sign in</Link>
      </p>
    </form>
  );
}
