import React, { useState } from "react";
import axios from "axios";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Valid email is required";
      isValid = false;
    }

    if (!formData.feedback.trim()) {
      tempErrors.feedback = "Feedback is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setSubmitError("");
      
      try {
        // Send data to backend API
        const response = await axios.post("http://localhost:3000/feedback", formData);
        
        if (response.data.status === "success") {
          setSubmitted(true);
          setFormData({ name: "", email: "", feedback: "" });
          setErrors({});
        } else {
          setSubmitError("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        setSubmitError(
          error.response?.data?.error || 
          "Failed to submit feedback. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="feedback-container">
      <h2>Give Your Valuable Feedback</h2>
      {submitted && (
        <p className="success-message">
          Thank you for your feedback! It has been submitted successfully.
        </p>
      )}
      {submitError && <p className="error">{submitError}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="5"
            placeholder="Please share your thoughts, suggestions, or experiences..."
          ></textarea>
          {errors.feedback && <p className="error">{errors.feedback}</p>}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default Feedback;