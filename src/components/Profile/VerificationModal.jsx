// import React, { useState, Fragment } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { toast } from "react-toastify";
// import { supabase } from "../../Lib/supabaseClient"; // Make sure this is your correct path

// export default function VerificationModal({ isOpen, onClose }) {
//   const [nationalIdFile, setNationalIdFile] = useState(null);
//   const [licenseFile, setLicenseFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Upload file to Supabase Storage
//   const uploadFile = async (file, path) => {
//     if (!file) throw new Error("No file provided");

//     // Upload the file to Supabase Storage
//     const { error } = await supabase.storage
//       .from("user-verification") // Specify your bucket name here
//       .upload(path, file, {
//         upsert: true, // Allows overwriting existing file
//         cacheControl: "3600", // Optional: cache control for uploaded file
//         contentType: file.type || "application/octet-stream", // Set the content type of the file
//       });

//     if (error) {
//       throw error; // Handle error if the upload fails
//     }

//     // Get the public URL for the uploaded file
//     const { data } = await supabase.storage
//       .from("user-verification")
//       .getPublicUrl(path);

//     return data.publicUrl; // Return the public URL
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!nationalIdFile || !licenseFile) {
//     toast.error("Please upload both images.");
//     return;
//   }

//   setLoading(true);
//   try {
//     // Get logged-in user
//     const { data: userData, error: userError } = await supabase.auth.getUser();
//     if (userError) throw userError;
//     const user_id = userData.user.id;

//     // Log user id for debugging
//     console.log("User ID:", user_id);

//     // Define paths for images in the storage bucket
//     const nationalIdPath = `${user_id}/national_id_${Date.now()}`;
//     const licensePath = `${user_id}/license_${Date.now()}`;

//     // Log the paths to make sure they're unique
//     console.log("National ID Path:", nationalIdPath);
//     console.log("License Path:", licensePath);

//     // Upload the National ID and License images to the bucket
//     const nationalIdUrl = await uploadFile(nationalIdFile, nationalIdPath);
//     const licenseUrl = await uploadFile(licenseFile, licensePath);

//     // Log the URLs to ensure they're correct
//     console.log("National ID URL:", nationalIdUrl);
//     console.log("License URL:", licenseUrl);

//     toast.success("Images uploaded successfully!");
//     onClose();
//   } catch (err) {
//     toast.error("Upload failed: " + err.message);
//     console.error("Error:", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         {/* Backdrop */}
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
//         </Transition.Child>

//         {/* Modal Panel */}
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0 scale-95"
//             enterTo="opacity-100 scale-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100 scale-100"
//             leaveTo="opacity-0 scale-95"
//           >
//             <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
//               <Dialog.Title className="text-xl font-semibold text-gray-900">
//                 Verify Your Account
//               </Dialog.Title>
//               <p className="mt-1 text-sm text-gray-500">
//                 Please upload your National ID and Driver’s License for verification.
//               </p>

//               <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//                 {/* National ID */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     National ID Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setNationalIdFile(e.target.files[0])}
//                     required
//                     className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
//                   />
//                 </div>

//                 {/* License */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Driver’s License Image
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setLicenseFile(e.target.files[0])}
//                     required
//                     className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
//                   />
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={onClose}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                     disabled={loading}
//                   >
//                     {loading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { supabase } from "../../Lib/supabaseClient";

export default function VerificationModal({ isOpen, onClose, onVerified }) {
  const [nationalIdFile, setNationalIdFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  // Upload file to Supabase Storage
  const uploadFile = async (file, path) => {
    if (!file) throw new Error("No file provided");
    const { error } = await supabase.storage
      .from("verification")
      .upload(path, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type || "application/octet-stream",
      });
    if (error) throw error;
    const { data } = await supabase.storage
      .from("verification")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nationalIdFile || !licenseFile) {
      toast.error("Please upload both images.");
      return;
    }
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const user_id = userData.user.id;

      const nationalIdPath = `${user_id}-national_id_${Date.now()}.${nationalIdFile.name.split(".").pop()}`;
      const licensePath = `${user_id}-license_${Date.now()}.${licenseFile.name.split(".").pop()}`;

      const nationalIdUrl = await uploadFile(nationalIdFile, nationalIdPath);
      const licenseUrl = await uploadFile(licenseFile, licensePath);

      const { error } = await supabase
        .from("verification")
        .insert([
          {
            user_id,
            national_id_image_url: nationalIdUrl,
            license_image_url: licenseUrl,
            status: "pending",
          },
        ])
        .select();

      if (error) throw error;

      toast.success("Verification request submitted successfully!");
      setVerified(true);
      onVerified?.();
      onClose();
    } catch (err) {
      toast.error("Upload failed: " + err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
              <Dialog.Title
                className={`text-2xl font-bold ${
                  verified ? "text-green-600" : "text-gray-900"
                }`}
              >
                {verified ? "Verified" : "Verify Your Account"}
              </Dialog.Title>

              {!verified ? (
                <>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    Please upload clear images of your National ID and Driver’s License for verification.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                      <label
                        htmlFor="nationalId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        National ID Image
                      </label>
                      <input
                        id="nationalId"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNationalIdFile(e.target.files[0])}
                        required
                        className="block w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm shadow-sm
                          focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50
                          file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700
                        "
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="license"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Driver’s License Image
                      </label>
                      <input
                        id="license"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLicenseFile(e.target.files[0])}
                        required
                        className="block w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-sm shadow-sm
                          focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50
                          file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700
                        "
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700
                          hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white
                          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="mt-12 text-center text-green-700 font-semibold text-lg">
                  Your account has been successfully verified.
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
