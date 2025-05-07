import React, { useState } from 'react';

const BloodDonationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    recentDonation: 'no',
    medicalConditions: 'no',
  });

  const [errors, setErrors] = useState({});
  const [eligibility, setEligibility] = useState(null);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      formErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.age || isNaN(formData.age) || formData.age < 18 || formData.age > 65) {
      formErrors.age = 'Age must be between 18 and 65';
      isValid = false;
    }

    if (!formData.weight || isNaN(formData.weight) || formData.weight < 50) {
      formErrors.weight = 'Weight must be at least 50 kg';
      isValid = false;
    }

    if (formData.recentDonation === 'yes') {
      formErrors.recentDonation = 'You must wait at least 3 months after your last donation';
      isValid = false;
    }

    if (formData.medicalConditions === 'yes') {
      formErrors.medicalConditions = 'You may not be eligible due to medical conditions';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      setEligibility('You are eligible to donate blood!');
    } else {
      setEligibility('Sorry, you are not eligible to donate blood.');
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
    <div className="form-container">
      <h2>Blood Donation Eligibility Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} />
          {errors.age && <p className="error">{errors.age}</p>}
        </div>

        <div className="form-group">
          <label>Weight (kg):</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
          {errors.weight && <p className="error">{errors.weight}</p>}
        </div>

        <div className="form-group">
          <label>Have you donated blood in the last 3 months?</label>
          <select name="recentDonation" value={formData.recentDonation} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {errors.recentDonation && <p className="error">{errors.recentDonation}</p>}
        </div>

        <div className="form-group">
          <label>Do you have any serious medical conditions?</label>
          <select name="medicalConditions" value={formData.medicalConditions} onChange={handleChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {errors.medicalConditions && <p className="error">{errors.medicalConditions}</p>}
        </div>

        <button type="submit" className="submit-button">Check Eligibility</button>
      </form>

      {eligibility && <h3 className="eligibility-result">{eligibility}</h3>}
    </div>
  );
};

export default BloodDonationForm;