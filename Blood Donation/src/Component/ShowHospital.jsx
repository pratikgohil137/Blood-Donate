import React, { useEffect, useState } from "react";
import HospitalData from "../assets/HospitalData.json";

const ShowHospital = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    // Directly set the imported JSON data
    setHospitals(HospitalData.hospitals);
  }, []);

  return (
    <div>
      <h2 className="container">Blood Donation Hospitals</h2>
      <table className="hospital-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>District</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital, index) => (
            <tr key={index}>
              <td>{hospital.name}</td>
              <td>{hospital.phone}</td>
              <td>{hospital.address}</td>
              <td>{hospital.district}</td>
              <td>{hospital.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowHospital;