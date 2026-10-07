import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-6 py-6">
        <Link to="/" className="font-serif text-2xl">
          Cedar Olive
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-borderColor bg-white p-6 shadow-card sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
