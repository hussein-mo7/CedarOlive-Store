import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  deleteContactMessage,
  updateContactMessage,
  useGetContacts,
} from "../../api/contact/contactApi";
import Badge, { statusTone } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";

export default function ContactMessages() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetContacts();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const messages = useMemo(() => {
    return (data || []).filter((message) => {
      const term = search.toLowerCase();
      const matchesTerm = [message.name, message.email, message.message].some((value) =>
        String(value || "").toLowerCase().includes(term)
      );
      return matchesTerm && (status === "All" || message.status === status);
    });
  }, [data, search, status]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["contacts"] });

  const toggleStatus = async (message) => {
    const next = message.status === "Pending" ? "Resolved" : "Pending";
    const result = await dispatch(updateContactMessage({ id: message._id, contactData: { status: next } }));
    if (updateContactMessage.fulfilled.match(result)) {
      if (selected?._id === message._id) setSelected({ ...message, status: next });
      refresh();
    } else {
      toast.error(result.payload || "Could not update the message");
    }
  };

  const remove = async () => {
    const result = await dispatch(deleteContactMessage(toDelete._id));
    if (deleteContactMessage.fulfilled.match(result)) {
      toast.success("Message deleted");
      setToDelete(null);
      setSelected(null);
      refresh();
    }
  };

  return (
    <div>
      <h1 className="text-4xl">Messages</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="min-w-[240px] flex-1">
          <Input placeholder="Search messages" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {["All", "Pending", "Resolved"].map((item) => (
          <Button key={item} size="sm" variant={status === item ? "primary" : "outline"} onClick={() => setStatus(item)}>
            {item}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <p className="mt-6 text-text">Loading messages…</p>
      ) : (
        <ul className="mt-4 divide-y divide-borderColor overflow-hidden rounded-2xl border border-borderColor bg-white">
          {messages.map((message) => (
            <li key={message._id} className="flex flex-wrap items-center gap-3 p-4">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setSelected(message)}>
                <p className="font-medium">{message.name}</p>
                <p className="truncate text-sm text-text">{message.message}</p>
              </button>
              <Badge tone={statusTone(message.status)}>{message.status}</Badge>
              <span className="text-xs text-text">
                {message.createdAt ? format(new Date(message.createdAt), "MMM d") : ""}
              </span>
              <button type="button" className="text-sm text-secondary" onClick={() => toggleStatus(message)}>
                {message.status === "Pending" ? "Resolve" : "Reopen"}
              </button>
              <button type="button" className="text-sm text-red-700" onClick={() => setToDelete(message)}>
                Delete
              </button>
            </li>
          ))}
          {messages.length === 0 && <li className="p-6 text-sm text-text">No messages in this view.</li>}
        </ul>
      )}
      <Modal open={Boolean(selected)} title={selected?.name || "Message"} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3 text-sm">
            <p className="text-text">{selected.email}</p>
            <p className="leading-6">{selected.message}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => toggleStatus(selected)}>
                {selected.status === "Pending" ? "Mark resolved" : "Mark pending"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={Boolean(toDelete)} title="Delete this message?" onClose={() => setToDelete(null)}>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
