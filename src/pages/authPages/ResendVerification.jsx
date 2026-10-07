import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resendVerification } from "../../api/auth/authApi";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ResendVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, resendSuccess, resendError } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(location.state?.email || "");

  useEffect(() => {
    const fromQuery = new URLSearchParams(location.search).get("email");
    if (fromQuery) setEmail(fromQuery);
  }, [location.search]);

  const submit = (event) => {
    event.preventDefault();
    if (email) dispatch(resendVerification(email));
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-3xl">Resend verification</h1>
      {resendSuccess ? (
        <p className="text-sm text-emerald-800">A new link is on its way.</p>
      ) : (
        <>
          {resendError && <p className="text-sm text-red-700">{resendError}</p>}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send link"}
          </Button>
        </>
      )}
      <button type="button" className="text-sm text-secondary" onClick={() => navigate("/signIn")}>
        Back to sign in
      </button>
    </form>
  );
}
