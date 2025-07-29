import { useState } from "react";

export default function ReviewsSection({ reviews }) {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-4 shadow-2xs p-5">
      <h3 className="text-xl font-bold">Reviews</h3>

      {visibleReviews.map((rev, idx) => (
        <div key={idx} className="flex items-start gap-4 border-b border-gray-50 pb-3">
          {/* صورة المستخدم أو أيقونة افتراضية */}
          {rev.avatar ? (
            <img
              src={rev.avatar}
              alt={rev.user}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <i className="fa-solid fa-user  text-xl"></i>
            </div>
          )}

          {/* بيانات المراجعة */}
          <div>
            <h4 className="font-semibold">{rev.user}</h4>
            <div className="flex text-yellow-500 mb-1">
              {Array.from({ length: rev.rating }, (_, i) => (
                <i key={i} className="fa-solid fa-star mr-1"></i>
              ))}
            </div>
            <p className="text-gray-600 text-sm">{rev.reviewText}</p>
          </div>
        </div>
      ))}
  {/* زر عرض المزيد أو إخفاء */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="text-primary mt-2 underline"
        >
          {showAllReviews ? "Less Reviews" : "More Reviews"}
        </button>
      )}
    
    </div>
    
  );
}
