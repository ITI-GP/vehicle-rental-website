import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import image1 from "./review1.jpeg";
import image2 from "./review2.jpeg";
import image3 from "./review3.jpeg";

// Static initial reviews with translation keys
const initialReviews = [
  {
    company: "reviewForm.staticcompany1",
    name: "Aya Ramadan",
    review: "reviewForm.staticReview1",
    img: image1,
  },
  {
    company: "reviewForm.staticcompany2",
    name: "Omnia Eid",
    review: "reviewForm.staticReview2",
    img: image2,
  },
  {
    company: "reviewForm.staticcompany3",
    name: "Dina",
    review: "reviewForm.staticReview3",
    img: image3,
  },
];

export default function ReviewForm() {
  const { t } = useTranslation();

  const [reviews, setReviews] = useState(initialReviews);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !company || !review || !image) {
      alert(t("reviewForm.fillAllFields"));
      return;
    }

    const newReview = {
      name,
      company,
      review,
      img: URL.createObjectURL(image),
    };

    setReviews([...reviews, newReview]);
    setName("");
    setCompany("");
    setReview("");
    setImage(null);
    setShowModal(false);
  };

  const deleteReview = (index) => {
    const newReviews = reviews.filter((_, i) => i !== index);
    setReviews(newReviews);
  };

  return (
    <div className="container mt-12 px-6 py-12 bg-gray-50">
      <h2 className="text-4xl font-bold text-center">{t("reviewForm.header")}</h2>

      {/* Display Reviews */}
      <div className="mt-12 grid md:grid-cols-3 gap-12">
        {reviews.map((reviewObj, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-lg relative">
            <div className="flex items-center space-x-4">
              <img
                src={reviewObj.img}
                alt={reviewObj.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{reviewObj.name}</h3>
                <p className="text-sm text-gray-500">
                  {reviewObj.company?.startsWith("reviewForm.") ? t(reviewObj.company) : reviewObj.company}
                </p>
              </div>
            </div>
            <p className="mt-4 text-lg text-gray-700">
              "{t(reviewObj.review)}"
            </p>
            <button
              onClick={() => deleteReview(index)}
              className="absolute top-2 right-2 text-red-500"
              aria-label={t("reviewForm.deleteButton")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 bg-red-500 rounded" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add Review Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowModal(true)}
          className="py-2 px-6 text-white rounded-lg"
          style={{ backgroundColor: "#ff9e0c" }}
        >
          {t("reviewForm.addReviewButton")}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 "
            onClick={() => setShowModal(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white px-8 rounded-lg shadow-lg w-96">
              <h3 className="text-2xl font-semibold text-center m-3">
                {t("reviewForm.addNewReview")}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-lg font-semibold">{t("reviewForm.name")}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                    placeholder={t("reviewForm.namePlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold">{t("reviewForm.company")}</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                    placeholder={t("reviewForm.companyPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold">{t("reviewForm.review")}</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                    rows="2"
                    placeholder={t("reviewForm.reviewPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold">{t("reviewForm.image")}</label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                    accept="image/*"
                  />
                </div>

                <button
                  type="submit"
                  className=" px-6  py-1 text-white rounded-lg w-full"
                  style={{ backgroundColor: "#ff9e0c" }}
                >
                  {t("reviewForm.submitButton")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-1 bg-gray-500 text-white rounded-lg mb-2"
                >
                  {t("reviewForm.closeButton")}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
