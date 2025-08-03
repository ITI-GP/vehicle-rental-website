
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { PencilIcon } from "lucide-react";
import defaultImage from "../../assets/EmailIcon.png"; // صورة افتراضية
import vehicleData from "../../data/vehicles.json";
import VehiclesCard from "../../components/VehiclesCard/VehiclesCard";

export default function CustomerProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    phone: "+1 123 456 7890",
    image: defaultImage,
  });

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    image: user.image,
  });

  const userVehicles = vehicleData.filter((v) => v.userId === 1); // userId مؤقت

  const handleSave = () => {
    setUser({ ...formData });
    setIsOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image: defaultImage }));
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-10">
        <img
          src={user.image}
          alt="User"
          className="w-24 h-24 rounded-full object-cover border shadow"
        />
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.phone}</p>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* User Vehicles */}
      <h3 className="text-xl font-semibold mb-6">Your Vehicles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {userVehicles.length > 0 ? (
          userVehicles.map((vehicle) => (
            <VehiclesCard key={vehicle.id} vehicle={vehicle} />
          ))
        ) : (
          <p className="text-gray-500 italic">You haven’t added any vehicles yet.</p>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-md rounded-xl shadow-lg p-10">
            <Dialog.Title className="text-xl font-semibold mb-4">Edit Profile</Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              {/* Image Preview + Upload */}
              <div className="flex items-center  ">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className=" px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
