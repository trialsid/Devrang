"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Customer {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  shippingAddress?: string;
  dob?: string;
  gotra?: string;
  rating?: number;
  comments?: string;
}

interface Props {
  customer: Customer | null;
  onClose: () => void;
  onSave: (customer: Customer | Omit<Customer, "_id">) => Promise<void> | void;
}

const CustomerFormModal: React.FC<Props> = ({ customer, onClose, onSave }) => {
  const [form, setForm] = useState<Omit<Customer, "_id">>({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    shippingAddress: customer?.shippingAddress || "",
    dob: customer?.dob || "",
    gotra: customer?.gotra || "",
    rating: customer?.rating || 0,
    comments: customer?.comments || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onSave(customer ? { ...customer, ...form } : form);
    } catch (err) {
      console.error("❌ Save customer error:", err);
      setError("Failed to save customer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          key="modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg relative"
        >
          <h2 className="text-2xl font-serif text-stone-800 mb-4">
            {customer ? "Edit Customer" : "Add New Customer"}
          </h2>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-stone-700 font-medium mb-1">
                  Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-700 font-medium mb-1">
                  Phone *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-700 font-medium mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                  placeholder="example@mail.com"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-700 font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-stone-700 font-medium mb-1">
                Shipping Address
              </label>
              <input
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                placeholder="e.g. 123 Galaxy St, Mumbai"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-stone-700 font-medium mb-1">
                  Gotra
                </label>
                <input
                  name="gotra"
                  value={form.gotra}
                  onChange={handleChange}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-700 font-medium mb-1">
                  Rating
                </label>
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={handleChange}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-stone-700 font-medium mb-1">
                Comments
              </label>
              <textarea
                name="comments"
                rows={3}
                value={form.comments}
                onChange={handleChange}
                className="w-full border border-stone-300 rounded-md px-3 py-2 text-stone-800 focus:ring-2 focus:ring-violet-400"
                placeholder="Add any notes or comments..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-violet-700 text-white rounded-md hover:bg-violet-800 disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomerFormModal;
