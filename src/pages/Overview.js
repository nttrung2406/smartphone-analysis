import React, { useEffect, useState } from 'react';
import { extractPhoneData } from '../support/phoneSummary';
import '../assets/global.css';

const Overview = () => {
  const [phones, setPhones] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch unique phone data
        const data = await extractPhoneData();
        setPhones(data);
      } catch (error) {
        console.error("Error loading phone data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    const selectedModel = event.target.value;
    const phone = phones.find(p => p.Product_Name === selectedModel);
    setSelectedPhone(phone);
  };

  return (
    <div className="page-container">
      <h2>Phone Information</h2>
      
      {/* Dropdown to select a phone model */}
      <label htmlFor="phoneDropdown">Select a phone:</label>
      <select id="phoneDropdown" onChange={handleSelectChange}>
        <option value="">--Choose a Product--</option>
        {phones.map(phone => (
          <option key={phone.Product_Name} value={phone.Product_Name}>
            {phone.Product_Name}
          </option>
        ))}
      </select>

      {/* Display phone details if a product is selected */}
      {selectedPhone && (
        <div className="phone-info-container">
          {/* Image Section */}
          <div className="image-section">
            <img 
              src={`${selectedPhone.Img_path}`} 
              alt={selectedPhone.Product_Name} 
              style={{ width: '200px', height: 'auto' }} 
            />
          </div>

          {/* Information Section */}
          <div className="info-section">
            <h3>{selectedPhone.Product_Name}</h3>
            <p><strong>Actual Price:</strong> {selectedPhone.Actual_price}</p>
            <p><strong>Discount Price:</strong> {selectedPhone.Discount_price}</p>
            <p><strong>Stars:</strong> {selectedPhone.Stars}</p>
            <p><strong>Rating:</strong> {selectedPhone.Rating}</p>
            <p><strong>Reviews:</strong> {selectedPhone.Reviews}</p>
            <p><strong>RAM:</strong> {selectedPhone.RAM_GB} GB</p>
            <p><strong>Storage:</strong> {selectedPhone.Storage_GB} GB</p>
            <p><strong>Display Size:</strong> {selectedPhone.Display_Size} inches</p>
            <p><strong>Camera:</strong> {selectedPhone.Camera}</p>
            <p><strong>Description:</strong> {selectedPhone.Description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
