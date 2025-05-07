import faqs from "../assets/faqs.json";
import React from "react";

const FAQ = () => {
  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      <ul className="faq-box">
        {faqs.faqs.map((faq, index) => (
          <li key={index}>
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQ;