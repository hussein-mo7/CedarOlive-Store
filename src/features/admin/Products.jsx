import { useState } from "react";
import AllProducts from "./AllProducts";
import AddProductForm from "./AddProductForm";
import { cn } from "../../lib/cn";

export default function Products() {
  const [tab, setTab] = useState("list");

  return (
    <div>
      <h1 className="text-4xl">Products</h1>
      <div className="mt-6 flex gap-2">
        {[
          ["list", "All products"],
          ["add", "Add product"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm",
              tab === key ? "bg-secondary text-white" : "bg-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tab === "list" ? <AllProducts /> : <AddProductForm />}</div>
    </div>
  );
}
