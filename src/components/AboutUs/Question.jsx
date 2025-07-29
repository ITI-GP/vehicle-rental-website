import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const faqs = [
  {
    question: "faq.q1",
    answer: "faq.a1",
  },
  {
    question: "faq.q2",
    answer: "faq.a2",
  },
  {
    question: "faq.q3",
    answer: "faq.a3",
  },
  {
    question: "faq.q4",
    answer: "faq.a4",
  },
  {
    question: "faq.q5",
    answer: "faq.a5",
  },
];

const Question = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full mx-auto px-4 py-8 mt-12">
      <h2 className="text-3xl font-bold text-center mb-6">
        {t("faq.header", "Top Car Rental Questions")}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 shadow-sm transition duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-semibold">{t(faq.question)}</span>
              <span className="ml-4">{activeIndex === index ? "▴" : "▾"}</span>
            </button>
            {activeIndex === index && (
              <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                {t(faq.answer)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
