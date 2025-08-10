import React, { useState, useEffect } from "react";
import VerificationModal from "./VerificationModal";
import { supabase } from "../../Lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export default function VerificationButtonWithModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Called from modal after successful verification submission
  const handleVerificationSubmitted = () => {
    console.log("Verification submitted, setting status to pending");
    setVerificationStatus("pending");
    setIsOpen(false);
    // Optionally refetch the status from the database to ensure consistency
    refetchVerificationStatus();
  };

  // Fetch verification status on component mount and when user changes
  useEffect(() => {
    // Fetch verification status from the API
    const fetchVerificationStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching verification status for user:", user.id);
        const { data, error } = await supabase
          .from("verification")
          .select("status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        console.log("Verification fetch result:", { data, error });

        if (error) {
          console.error("Error fetching verification status:", error);
          setVerificationStatus(null);
        } else if (data && data.length > 0) {
          const status = data[0].status;
          console.log("Setting verification status to:", status);
          setVerificationStatus(status);
        } else {
          console.log("No verification records found, setting status to null");
          setVerificationStatus(null);
        }
      } catch (err) {
        console.error("Error fetching verification status:", err);
        setVerificationStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [user]);

  // Function to refetch verification status
  const refetchVerificationStatus = async () => {
    if (!user) return;

    try {
      console.log("Refetching verification status for user:", user.id);
      const { data, error } = await supabase
        .from("verification")
        .select("status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      console.log("Refetch result:", { data, error });

      if (error) {
        console.error("Error refetching verification status:", error);
      } else if (data && data.length > 0) {
        const status = data[0].status;
        console.log("Updating verification status to:", status);
        setVerificationStatus(status);
      } else {
        console.log(
          "No verification records found during refetch, setting status to null"
        );
        setVerificationStatus(null);
      }
    } catch (err) {
      console.error("Error refetching verification status:", err);
    }
  };

  // Get button styling and text based on status
  const getButtonConfig = () => {
    if (loading) {
      return {
        text: "Loading...",
        className: "bg-gray-400 text-white cursor-not-allowed",
        disabled: true,
      };
    }

    switch (verificationStatus) {
      case "verified":
      case "VERIFIED":
      case "approved":
      case "APPROVED":
        return {
          text: "Verified",
          className: "bg-green-600 text-white cursor-default",
          disabled: true,
        };
      case "pending":
      case "PENDING":
        return {
          text: "Pending",
          className: "bg-yellow-600 text-white cursor-default",
          disabled: true,
        };
      case "rejected":
      case "REJECTED":
        return {
          text: "Rejected - Resubmit",
          className: "bg-red-600 text-white hover:bg-red-700",
          disabled: false,
        };
      default: // null or any other status
        return {
          text: "Required",
          className: "bg-blue-600 text-white hover:bg-blue-700",
          disabled: false,
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <button
        onClick={openModal}
        disabled={buttonConfig.disabled}
        className={`px-5 py-2 rounded font-semibold transition ${buttonConfig.className}`}
      >
        {buttonConfig.text}
      </button>

      <VerificationModal
        isOpen={isOpen}
        onClose={closeModal}
        onVerified={handleVerificationSubmitted}
        currentStatus={verificationStatus}
      />
    </>
  );
}
