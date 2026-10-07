import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { signIn } from "../../api/auth/authApi";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (new Cookies().get("token")) navigate("/");
  }, [navigate]);

  const onChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      await dispatch(signIn(form)).unwrap();
      navigate("/");
    } catch (error) {
      setErrors({ general: error?.message || "Sign in failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-3xl">Welcome back</h1>
      <p className="text-sm text-text">Sign in to your Cedar Olive account.</p>
      {(errors.general || authError) && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.general || authError}
        </p>
      )}
      <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
      <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} />
      <label className="flex items-center gap-2 text-sm text-text">
        <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={onChange} />
        Remember me
      </label>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex justify-between text-sm">
        <Link to="/forgot-password" className="text-secondary">Forgot password</Link>
        <Link to="/signUp" className="text-secondary">Create account</Link>
      </div>
    </form>
  );
}
