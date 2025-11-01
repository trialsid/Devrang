"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Customer } from "../../../types";

const CustomerFormModal: React.FC<{
  customer: Customer | null;
  onClose: () => void;
  onSave: (customer: Customer | Omit<Customer, "id">) => void;
}> = ({ customer, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Customer, "id">>(
    customer || {
      name: "",
      phone: "",
      email: "",
      shippingAddress: "",
      dob: "",
      gotra: "",
      rating: 0,
      comments: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      onSave({ ...customer, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-text-main mb-6">
          {customer ? "Edit Customer" : "Add New Customer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name (Required)"
              required
              className="p-2 border rounded"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (Required)"
              required
              className="p-2 border rounded"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 border rounded"
            />
            <input
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="Shipping Address"
              className="p-2 border rounded"
            />
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Date of Birth"
              className="p-2 border rounded"
            />
            <input
              name="gotra"
              value={formData.gotra}
              onChange={handleChange}
              placeholder="Gotra"
              className="p-2 border rounded"
            />
          </div>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Comments"
            className="w-full p-2 border rounded"
            rows={3}
          ></textarea>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomersPage: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } =
    useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const handleSaveCustomer = (
    customerData: Customer | Omit<Customer, "id">
  ) => {
    if ("id" in customerData) {
      updateCustomer(customerData as Customer);
    } else {
      addCustomer(customerData as Omit<Customer, "id">);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      {isModalOpen && (
        <CustomerFormModal
          customer={editingCustomer}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCustomer}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-main">Manage Customers</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus"
        >
          Add New Customer
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-secondary">
            <tr className="text-left text-primary">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.email || "N/A"}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      window.confirm("Are you sure?") &&
                      deleteCustomer(customer.id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <p className="text-center p-6 text-gray-500">No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
