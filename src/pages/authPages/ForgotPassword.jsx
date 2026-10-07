import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../api/auth/authApi";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { forgotPasswordSuccess, error, loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const submit = (event) => {
    event.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-3xl">Reset your password</h1>
      <p className="text-sm text-text">We will email a link if the account exists.</p>
      {forgotPasswordSuccess ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Check your inbox for the reset link.
        </p>
      ) : (
        <>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </>
      )}
      <Link to="/signIn" className="block text-sm text-secondary">Back to sign in</Link>
    </form>
  );
}
