
import React, { useEffect, useState } from "react";
import { supabase } from "../../../Lib/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function ReviewsSection({ vehicleId }) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0); // يبدأ صفر
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rate,
          comment,
          reviewer_id,
          users!reviews_reviewer_id_fkey(name, avatar_url)
        `)
        .eq("vehicle_id", vehicleId)
        .order("id", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      toast.error("Failed to load reviews");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vehicleId]);

  const handleSubmit = async () => {
    if (!vehicleId) {
      toast.error("Vehicle ID is missing. Cannot add review.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to add a review");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (newRating < 1 || newRating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert([
        {
          rate: newRating.toString(),
          comment: newComment,
          reviewer_id: user.id,
          vehicle_id: vehicleId,
        },
      ]);
      if (error) throw error;

      toast.success("Review added");
      setNewComment("");
      setNewRating(0); // يرجع تاني صفر بعد الإرسال
      setShowAddReviewForm(false);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to add review");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading reviews...</p>;

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-4 p-5 shadow rounded bg-white">
      <h3 className="text-xl font-bold">Reviews</h3>

      {reviews.length === 0 && (
        <p className="mb-4 text-gray-600">No reviews yet. Be the first to add one!</p>
      )}

      {visibleReviews.map((rev) => (
        <div key={rev.id} className="flex items-start gap-4 border-b border-gray-100 pb-3">
          {rev.users?.avatar_url ? (
            <img
              src={rev.users.avatar_url}
              alt={rev.users.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <i className="fa-solid fa-user text-xl"></i>
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-semibold">{rev.users?.name || "Anonymous"}</h4>
            <div className="flex text-yellow-400 mb-1">
              {Array.from({ length: Number(rev.rate) }, (_, i) => (
                <i key={i} className="fa-solid fa-star mr-1"></i>
              ))}
            </div>
            <p className="text-gray-700 text-sm">{rev.comment}</p>
          </div>
        </div>
      ))}

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="text-primary mt-2 underline"
        >
          {showAllReviews ? "Show Less" : "Show More"}
        </button>
      )}

      {/* زر إظهار / إخفاء نموذج إضافة مراجعة */}
      <button
        onClick={() => setShowAddReviewForm(!showAddReviewForm)}
        className="mt-6 bg-primary text-white rounded px-4 py-2 hover:bg-primary-dark"
      >
        {showAddReviewForm ? "Cancel" : "Add Review"}
      </button>

      {/* نموذج إضافة مراجعة جديدة */}
      {showAddReviewForm && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Add a Review</h4>

          {/* النجوم */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={28}
                className={`cursor-pointer transition-colors ${
                  star <= newRating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setNewRating(star)}
              />
            ))}
          </div>

          {/* التعليق */}
          <label className="block mb-1">Comment</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-4"
            rows={3}
          />

          {/* زر الإرسال */}
          <button
            onClick={handleSubmit}
            disabled={submitting || newRating === 0}
            className="bg-primary text-white rounded px-4 py-2 hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}

