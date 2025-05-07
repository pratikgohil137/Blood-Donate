import React from "react";
import "../AwarenessSection.css";

const AwarenessSection = () => {
  return (
    <section className="awareness-section">
      <h2>🩸 Blood Donation Awareness 🩸</h2>

      <h3>🌍 The Need is Real</h3>
      <p>
        Every day, thousands of lives in India depend on donated blood. Blood
        can't be manufactured — it can only come from donors like you. Whether
        it's a child with thalassemia, a mother in childbirth, or a road
        accident victim — they all rely on blood donors.
      </p>

      <h3>🧬 Facts About Blood Donation</h3>
      <ul>
        <li>1 donation can save up to 3 lives</li>
        <li>Your blood volume is replaced within 24 hours</li>
        <li>You can donate every 3 months</li>
        <li>Donation is safe, simple, and fast</li>
      </ul>

      <h3>🚫 Breaking the Myths</h3>
      <div className="myth-boxes">
        <div className="myth-box">
          <p><strong>Myth:</strong> Donating makes you weak</p>
          <p><strong>Reality:</strong> Your body recovers quickly and you feel normal within hours</p>
        </div>
        <div className="myth-box">
          <p><strong>Myth:</strong> You can catch infections</p>
          <p><strong>Reality:</strong> All equipment is sterile and single-use</p>
        </div>
        <div className="myth-box">
          <p><strong>Myth:</strong> Women can't donate</p>
          <p><strong>Reality:</strong> Healthy women can safely donate blood</p>
        </div>
        <div className="myth-box">
          <p><strong>Myth:</strong> Only donate in emergencies</p>
          <p><strong>Reality:</strong> Regular donations help maintain safe blood supply</p>
        </div>
      </div>

      <h3>💪 Why You Should Donate</h3>
      <ul>
        <li>It's a life-saving act with no cost to you</li>
        <li>You get a free health checkup</li>
        <li>It may reduce the risk of heart disease</li>
        <li>It's a meaningful way to give back to society</li>
      </ul>

      <div className="quote-box">
        "Blood donation is not just about giving blood — it's about giving hope, strength, and life."<br />
        Join us. Register. Donate. Share. Repeat.
      </div>
    </section>
  );
};

export default AwarenessSection; 
