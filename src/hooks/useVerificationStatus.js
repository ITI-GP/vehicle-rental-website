import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export const useVerificationStatus = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("verification")
          .select("status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching verification status:", error);
          setVerificationStatus(null);
        } else if (data && data.length > 0) {
          const status = data[0].status;
          setVerificationStatus(status);
        } else {
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

  // Helper function to check if user is verified
  const isVerified = () => {
    return verificationStatus === 'verified' || 
           verificationStatus === 'VERIFIED' || 
           verificationStatus === 'approved' || 
           verificationStatus === 'APPROVED';
  };

  // Helper function to check if verification is pending
  const isPending = () => {
    return verificationStatus === 'pending' || verificationStatus === 'PENDING';
  };

  // Helper function to check if verification was rejected
  const isRejected = () => {
    return verificationStatus === 'rejected' || verificationStatus === 'REJECTED';
  };

  return {
    verificationStatus,
    loading,
    isVerified: isVerified(),
    isPending: isPending(),
    isRejected: isRejected(),
    needsVerification: !isVerified()
  };
};
