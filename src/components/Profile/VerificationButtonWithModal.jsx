import React, { useState } from "react";
import VerificationModal from "./VerificationModal";

export default function VerificationButtonWithModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [verified, setVerified] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Called from modal after successful verification
  const handleVerified = () => {
    setVerified(true);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        disabled={verified}
        className={`px-5 py-2 rounded font-semibold transition ${
          verified
            ? "bg-green-600 text-white cursor-default"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {verified ? "Verified" : "Verify Your Account"}
      </button>

      <VerificationModal
        isOpen={isOpen}
        onClose={closeModal}
        onVerified={handleVerified}
      />
    </>
  );
}
