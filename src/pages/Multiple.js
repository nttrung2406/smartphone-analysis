import React, { useState, useRef } from 'react';
import { extractTwoFeatureData } from '../support/multiFeatureExtractor';
import * as d3 from 'd3';
import '../assets/global.css';
import { createCorrelationHeatmap,  createJointDistributionPlot, createKDEPlot,
          createScatterPlot
} from '../support/multiFeatureRelationship';

const Multiple = () => {
  const [feature1, setFeature1] = useState('');  // First feature selected by user
  const [feature2, setFeature2] = useState('');  // Second feature selected by user
  const [loading, setLoading] = useState(false); // Loading state

  const chartsContainerRef = useRef(null); // Ref for the chart container

  const startLoadingSpinner = () => {
    setLoading(true);
  };

  const stopLoadingSpinner = () => {
    setLoading(false);
  };

  const fetchDataAndVisualize = async () => {
    if (!feature1 || !feature2) {
      alert("Please enter both features.");
      return;  
    }
  
    startLoadingSpinner();
  
    try {
      const data = await extractTwoFeatureData(feature1, feature2);
      console.log("Extracted data:", data);  
      d3.select(chartsContainerRef.current).selectAll("*").remove();
  
      if (chartsContainerRef.current) {
        createCorrelationHeatmap(data, d3.select(chartsContainerRef.current), feature1, feature2);
        createJointDistributionPlot(data, d3.select(chartsContainerRef.current), feature1, feature2);
        createKDEPlot(data, d3.select(chartsContainerRef.current), feature1, feature2);
        createScatterPlot(data, d3.select(chartsContainerRef.current), feature1, feature2);
      } else {
        console.error("Charts container is not available.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  return (
    <div className="page-container">
      <h2>Multiple Feature Analysis</h2>

      {/* Feature Selection Input */}
      <label>
        Feature 1:
        <input 
          type="text" 
          value={feature1} 
          onChange={(e) => setFeature1(e.target.value)} 
          placeholder="Enter feature 1" 
        />
      </label>

      <label>
        Feature 2:
        <input 
            type="text" 
            value={feature2} 
            onChange={(e) => setFeature2(e.target.value)} 
            placeholder="Enter feature 2" 
        />
      </label>

      {/* Start Analysis Button */}
      <button onClick={fetchDataAndVisualize}>Analyze Features</button>

      {/* Loading Spinner */}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Charts Container */}
      <div ref={chartsContainerRef} className="charts-container"></div>
    </div>
  );
};

export default Multiple;
