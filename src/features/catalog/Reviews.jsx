import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { createReview, deleteReview, updateReview } from "../../api/review/reviewApi";
import Button from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Input";

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          aria-label={`${star} stars`}
        >
          <Star
            size={18}
            className={star <= value ? "fill-amber-400 text-amber-400" : "text-[#d9cfc6]"}
          />
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ productId, reviews = [] }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [items, setItems] = useState(reviews);
  const [sortBy, setSortBy] = useState("newest");
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ rating: 5, review: "" });

  const sorted = [...items].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
  const visible = expanded ? sorted : sorted.slice(0, 3);
  const average = items.length
    ? items.reduce((sum, item) => sum + item.rating, 0) / items.length
    : 0;

  const reset = () => {
    setEditingId(null);
    setForm({ rating: 5, review: "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.review.trim()) {
      toast.error("Write a short review first");
      return;
    }
    if (editingId) {
      const result = await dispatch(
        updateReview({ reviewId: editingId, rating: Number(form.rating), review: form.review })
      );
      if (!result.error) {
        setItems((current) =>
          current.map((item) =>
            (item._id || item.id) === editingId
              ? { ...item, rating: Number(form.rating), review: form.review }
              : item
          )
        );
        toast.success("Review updated");
        reset();
      }
      return;
    }
    const result = await dispatch(
      createReview({ productId, rating: Number(form.rating), review: form.review })
    );
    if (!result.error) {
      setItems((current) => [
        {
          ...(result.payload || {}),
          rating: Number(form.rating),
          review: form.review,
          user: user ? { name: user.name, _id: user._id || user.id } : undefined,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      toast.success("Review published");
      reset();
    } else {
      toast.error(result.payload || "Could not publish the review");
    }
  };

  const remove = async (reviewId) => {
    const result = await dispatch(deleteReview(reviewId));
    if (!result.error) {
      setItems((current) => current.filter((item) => (item._id || item.id) !== reviewId));
      toast.success("Review removed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-3xl">{average ? average.toFixed(1) : "—"}</p>
          <p className="text-sm text-text">{items.length} reviews</p>
        </div>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-full border border-borderColor bg-white px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
      </div>

      {user ? (
        <form onSubmit={submit} className="mb-8 rounded-2xl bg-primary/60 p-4">
          <Stars value={form.rating} onChange={(rating) => setForm((prev) => ({ ...prev, rating }))} />
          <Textarea
            className="mt-3"
            value={form.review}
            onChange={(event) => setForm((prev) => ({ ...prev, review: event.target.value }))}
            placeholder="How does it live in the room?"
          />
          <div className="mt-3 flex gap-2">
            <Button type="submit">{editingId ? "Update review" : "Publish review"}</Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={reset}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        <p className="mb-6 text-sm text-text">
          <Link to="/signIn" className="text-secondary">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      )}

      <ul className="space-y-4">
        {visible.map((item) => {
          const id = item._id || item.id;
          const mine = user && String(item.user?._id || item.user) === String(user._id || user.id);
          return (
            <li key={id} className="rounded-2xl border border-borderColor p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{item.user?.name || "Customer"}</p>
                  <Stars value={item.rating} />
                </div>
                {mine && (
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      className="text-secondary"
                      onClick={() => {
                        setEditingId(id);
                        setForm({ rating: item.rating, review: item.review });
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="text-red-700" onClick={() => remove(id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm leading-6 text-text">{item.review}</p>
            </li>
          );
        })}
      </ul>
      {sorted.length > 3 && (
        <button type="button" className="mt-4 text-sm text-secondary" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show less" : `Show all ${sorted.length} reviews`}
        </button>
      )}
    </div>
  );
}
