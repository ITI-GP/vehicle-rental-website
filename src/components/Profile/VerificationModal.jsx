import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { supabase } from "../../Lib/supabaseClient";

export default function VerificationModal({
  isOpen,
  onClose,
  onVerified,
  currentStatus,
}) {
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
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;
      const user_id = userData.user.id;

      const nationalIdPath = `${user_id}-national_id_${Date.now()}.${nationalIdFile.name
        .split(".")
        .pop()}`;
      const licensePath = `${user_id}-license_${Date.now()}.${licenseFile.name
        .split(".")
        .pop()}`;

      const nationalIdUrl = await uploadFile(nationalIdFile, nationalIdPath);
      const licenseUrl = await uploadFile(licenseFile, licensePath);

      // Check if user already has a verification record
      console.log(
        "Checking for existing verification record for user:",
        user_id
      );
      const { data: existingRecords } = await supabase
        .from("verification")
        .select("id")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false })
        .limit(1);

      console.log("Existing record check result:", existingRecords);

      let result;
      if (existingRecords && existingRecords.length > 0) {
        // Update the most recent existing record
        console.log("Updating most recent verification record");
        result = await supabase
          .from("verification")
          .update({
            national_id_image_url: nationalIdUrl,
            license_image_url: licenseUrl,
            status: "pending",
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingRecords[0].id)
          .select();
        console.log("Update result:", result);
      } else {
        // Insert new record
        console.log("Inserting new verification record");
        result = await supabase
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
        console.log("Insert result:", result);
      }

      if (result.error) throw result.error;

      console.log(
        "Verification submission successful, final status should be: pending"
      );

      const successMessage =
        currentStatus === "rejected"
          ? "Verification resubmitted successfully!"
          : "Verification request submitted successfully!";

      toast.success(successMessage);
      setVerified(true);

      // Add a small delay to ensure database operation is complete
      setTimeout(() => {
        onVerified?.();
        onClose();
      }, 500);
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
          <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-black/60 to-primary/20 backdrop-blur-sm" />
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
            <Dialog.Panel className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-primary/20 backdrop-blur-sm">
              <Dialog.Title
                className={`text-2xl font-bold mb-2 ${
                  verified ? "text-green-600" : "text-primary"
                }`}
              >
                {verified
                  ? "✅ Applied Successfully"
                  : currentStatus === "rejected"
                  ? "🔄 Resubmit Verification"
                  : "🔐 Verify Your Account"}
              </Dialog.Title>

              {!verified ? (
                <>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed bg-primary/5 p-4 rounded-lg border border-primary/10">
                    {currentStatus === "rejected"
                      ? "⚠️ Your previous verification was rejected. Please upload new clear images of your National ID and Driver's License for review."
                      : "📸 Please upload clear images of your National ID and Driver's License. Our team will review and verify your documents within 24 hours."}
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                      <label
                        htmlFor="nationalId"
                        className="flex items-center text-sm font-semibold text-gray-800 mb-2"
                      >
                        <span className="mr-2">🆔</span>
                        National ID Image
                      </label>
                      <input
                        id="nationalId"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNationalIdFile(e.target.files[0])}
                        required
                        className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-sm shadow-sm transition-all duration-200
                          focus:border-primary focus:ring-4 focus:ring-primary/20 focus:bg-white hover:border-primary/50
                          file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-medium hover:file:bg-primary/90 file:transition-all
                        "
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="license"
                        className="flex items-center text-sm font-semibold text-gray-800 mb-2"
                      >
                        <span className="mr-2">🚗</span>
                        Driver's License Image
                      </label>
                      <input
                        id="license"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLicenseFile(e.target.files[0])}
                        required
                        className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-sm shadow-sm transition-all duration-200
                          focus:border-primary focus:ring-4 focus:ring-primary/20 focus:bg-white hover:border-primary/50
                          file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-medium hover:file:bg-primary/90 file:transition-all
                        "
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border-2 border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200
                          hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200
                          hover:bg-primary/90 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/30
                          disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : currentStatus === "rejected" ? (
                          "🔄 Resubmit Documents"
                        ) : (
                          "🚀 Submit for Verification"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="mt-8 p-6 text-center bg-green-50 rounded-xl border border-green-200">
                  <div className="text-6xl mb-4">🎉</div>
                  <div className="text-lg font-semibold text-green-800 mb-2">
           You Applied Successfully!
                  </div>
                  <div className="text-sm text-green-600">
                    You can now access all features of our platform.
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
