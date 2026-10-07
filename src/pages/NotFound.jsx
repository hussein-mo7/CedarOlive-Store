import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="page-wrap py-24 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-text">404</p>
      <h1 className="mt-3 text-5xl">This page has left the room.</h1>
      <p className="mx-auto mt-4 max-w-md text-text">
        The link may be old. The shop is still here.
      </p>
      <Link to="/" className="mt-8 inline-block">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
