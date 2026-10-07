import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, MapPin, Phone } from "lucide-react";
import { sendContactMessage } from "../api/contact/contactApi";
import { resetContactForm } from "../redux/contactSlice";
import { Input, Textarea } from "../components/ui/Input";
import Button from "../components/ui/Button";

const initial = { name: "", email: "", message: "" };

export default function Contact() {
  const dispatch = useDispatch();
  const { isSubmitting, isSuccess, error } = useSelector((state) => state.contact);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isSuccess) return undefined;
    setForm(initial);
    const timer = setTimeout(() => dispatch(resetContactForm()), 3000);
    return () => clearTimeout(timer);
  }, [isSuccess, dispatch]);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    dispatch(sendContactMessage(form));
  };

  return (
    <div className="page-wrap grid gap-12 py-14 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-text">Contact</p>
        <h1 className="mt-2 text-5xl">Write to the studio</h1>
        <p className="mt-4 text-text">
          Questions about an order, a piece, or a visit — send a note and we will reply.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3"><Mail size={16} /> hello@cedarolive.com</li>
          <li className="flex items-center gap-3"><Phone size={16} /> (+22) 223 631 022</li>
          <li className="flex items-center gap-3"><MapPin size={16} /> 35 Casberg-Scotts Valley Road</li>
        </ul>
      </div>
      <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-card md:p-8">
        {isSuccess && (
          <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Message sent. We will be in touch.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {typeof error === "string" ? error : "The message could not be sent."}
          </p>
        )}
        <div className="grid gap-4">
          <Input label="Name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input label="Email" type="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Textarea label="Message" value={form.message} error={errors.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
