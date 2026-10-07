import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/auth/authApi";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ResetPassword() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, resetPasswordSuccess, error } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!resetPasswordSuccess) return undefined;
    const timer = setTimeout(() => navigate("/signIn"), 2500);
    return () => clearTimeout(timer);
  }, [resetPasswordSuccess, navigate]);

  const submit = (event) => {
    event.preventDefault();
    if (password.length < 8) {
      setLocalError("Use at least 8 characters");
      return;
    }
    if (password !== passwordConfirm) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalError("");
    dispatch(resetPassword({ token, password, passwordConfirm }));
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-3xl">Choose a new password</h1>
      {resetPasswordSuccess ? (
        <p className="text-sm text-emerald-800">Password updated. Taking you to sign in.</p>
      ) : (
        <>
          {(localError || error) && <p className="text-sm text-red-700">{localError || error}</p>}
          <Input label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="Confirm password" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Update password"}
          </Button>
        </>
      )}
    </form>
  );
}
