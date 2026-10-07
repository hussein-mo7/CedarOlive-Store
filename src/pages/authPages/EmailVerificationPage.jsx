import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../../api/auth/authApi";
import Button from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Skeleton";

export default function EmailVerificationPage() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, emailVerified, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (emailVerified) navigate("/signIn");
  }, [emailVerified, navigate]);

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl">Confirm your email</h1>
      {loading ? (
        <Spinner label="Verifying" />
      ) : (
        <p className="text-sm text-text">
          {error || "Use the button below to confirm this address."}
        </p>
      )}
      <Button className="w-full" onClick={() => token && dispatch(verifyEmail(token))} disabled={loading}>
        Verify email
      </Button>
      <Link to="/resend-verification" className="block text-sm text-secondary">
        Resend the link
      </Link>
    </div>
  );
}
