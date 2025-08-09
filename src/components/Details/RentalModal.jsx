import React, { useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../Lib/supabaseClient";

export default function RentalModal({
  formData,
  formErrors,
  setFormErrors,
  handleChange,
  setShowModal,
  vehicleId,
  user,
  isSubmitting,
  setIsSubmitting,
}) {
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.deliveryDate)
      errors.deliveryDate = "Delivery date is required";
    if (
      !formData.rentalDays ||
      isNaN(formData.rentalDays) ||
      Number(formData.rentalDays) < 1
    )
      errors.rentalDays = "Please enter a valid number of days";
    if (!formData.payment) errors.payment = "Payment method is required";

    if (formData.payment !== "Cash on delivery") {
      if (!formData.cardName.trim()) errors.cardName = "Card name is required";
      if (!formData.cardNumber.trim())
        errors.cardNumber = "Please enter a valid credit card number (13-19 digits)";
      else if (!/^\d{13,19}$/.test(formData.cardNumber))
        errors.cardNumber = "Please enter a valid credit card number (13-19 digits)";
      if (!formData.expiration) errors.expiration = "Expiration is required";
      if (!formData.cvv) errors.cvv = "Please enter a valid CVV (3-4 digits)";
      else if (!/^\d{3,4}$/.test(formData.cvv))
        errors.cvv = "Please enter a valid CVV (3 or 4 digits)";
    }
    if (formData.notes && formData.notes.length > 500)
      errors.notes = "Notes cannot exceed 500 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (user?.id && !uuidRegex.test(user.id)) {
          toast.error("User ID is not a valid UUID.", {
            position: "top-right",
          });
          setIsSubmitting(false);
          return;
        }

        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateFormat.test(formData.deliveryDate)) {
          toast.error("Date format must be YYYY-MM-DD.", {
            position: "top-right",
          });
          setIsSubmitting(false);
          return;
        }

        const startDateObj = new Date(formData.deliveryDate);
        const rentalDaysInt = parseInt(formData.rentalDays, 10);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(startDateObj.getDate() + rentalDaysInt);

        const startDate = startDateObj.toISOString();
        const endDate = endDateObj.toISOString();

        const { data, error } = await supabase
          .from("rental_requests")
          .insert([
            {
              user_id: user?.id,
              vehicle_id: Number(vehicleId),
              status: "pending",
              is_delivered: false,
              start_date: startDate,
              end_date: endDate,
              location: formData.location,
              address: formData.address,
              payment: formData.payment,
              card_name: formData.cardName,
              card_number: formData.cardNumber,
              expiration: formData.expiration,
              cvv: formData.cvv,
              notes: formData.notes,
            },
          ])
          .select();

        if (error) throw error;

        toast.success("Rental request submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
        });

        setShowModal(false);
      } catch (err) {
        toast.error("Failed to submit the rental request", {
          position: "top-right",
          autoClose: 5000,
        });
        console.error("Error submitting rental request:", err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill all fields!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white p-10 rounded-2xl w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Rent Vehicle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your full name"
              required
            />
            {formErrors.fullName && (
              <div className="text-red-500 text-xs mt-1">{formErrors.fullName}</div>
            )}
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
            {formErrors.email && (
              <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>
            )}
          </div>
          {/* Location */}
          <div>
            <label className="block text-sm font-semibold mb-1">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a location</option>
              <option value="Cairo">Cairo</option>
              <option value="Giza">Giza</option>
              <option value="Alexandria">Alexandria</option>
            </select>
            {formErrors.location && (
              <div className="text-red-500 text-xs mt-1">{formErrors.location}</div>
            )}
          </div>
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter address"
              required
            />
            {formErrors.address && (
              <div className="text-red-500 text-xs mt-1">{formErrors.address}</div>
            )}
          </div>
          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-semibold mb-1">Delivery Date</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {formErrors.deliveryDate && (
              <div className="text-red-500 text-xs mt-1">{formErrors.deliveryDate}</div>
            )}
          </div>
          {/* Rental Days */}
          <div>
            <label className="block text-sm font-semibold mb-1">Rental Days</label>
            <input
              type="number"
              name="rentalDays"
              value={formData.rentalDays}
              onChange={handleChange}
              min={1}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter rental days"
              required
            />
            {formErrors.rentalDays && (
              <div className="text-red-500 text-xs mt-1">{formErrors.rentalDays}</div>
            )}
          </div>
          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-1">Notes (optional)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter notes"
            />
            {formErrors.notes && (
              <div className="text-red-500 text-xs mt-1">{formErrors.notes}</div>
            )}
          </div>
        </div>

        <hr className="my-4" />
        <h3 className="text-xl font-bold">Payment</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Credit card"
                checked={formData.payment === "Credit card"}
                onChange={handleChange}
              />{" "}
              Credit card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Debit card"
                checked={formData.payment === "Debit card"}
                onChange={handleChange}
              />{" "}
              Debit card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Cash on delivery"
                checked={formData.payment === "Cash on delivery"}
                onChange={handleChange}
              />{" "}
              Cash on delivery
            </label>
          </div>
          {formErrors.payment && (
            <div className="text-red-500 text-xs mt-1">{formErrors.payment}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Name on card"
              required={formData.payment !== "Cash on delivery"}
              disabled={formData.payment === "Cash on delivery"}
            />
            {formErrors.cardName && (
              <div className="text-red-500 text-xs mt-1">{formErrors.cardName}</div>
            )}
            <input
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Card number"
              required={formData.payment !== "Cash on delivery"}
              disabled={formData.payment === "Cash on delivery"}
            />
            {formErrors.cardNumber && (
              <div className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</div>
            )}
            <input
              name="expiration"
              value={formData.expiration}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Expiration"
              type="month"
              required={formData.payment !== "Cash on delivery"}
              disabled={formData.payment === "Cash on delivery"}
            />
            {formErrors.expiration && (
              <div className="text-red-500 text-xs mt-1">{formErrors.expiration}</div>
            )}
            <input
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="CVV"
              type="password"
              required={formData.payment !== "Cash on delivery"}
              disabled={formData.payment === "Cash on delivery"}
            />
            {formErrors.cvv && (
              <div className="text-red-500 text-xs mt-1">{formErrors.cvv}</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setShowModal(false)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-6 py-2 rounded-lg transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                Pending...
              </span>
            ) : (
              "Confirm Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
