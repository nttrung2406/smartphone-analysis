import React, { useEffect, useState, useRef } from 'react';
import { extractTwoFeatureData } from '../support/multiFeatureExtractor';
import * as d3 from 'd3';
import '../assets/global.css';
import { createCorrelationHeatmap } from '../support/multiFeatureRelationship';

const Multiple = () => {
  const [feature1, setFeature1] = useState('');  // First feature selected by user
  const [feature2, setFeature2] = useState('');  // Second feature selected by user
  const [recommendedFeatures, setRecommendedFeatures] = useState([]); // State to store CSV feature names
  const [featureData, setFeatureData] = useState([]); // State to store data for selected features
  const [loading, setLoading] = useState(false); // Loading state

  const chartsContainerRef = useRef(null); // Ref for the chart container

  // useEffect(() => {
  //   const fetchFeatures = async () => {
  //     try {
  //       const data = await extractTwoFeatureData();
  //       const featureNames = Object.keys(data[0]);
  //       setRecommendedFeatures(featureNames);
  //     } catch (error) {
  //       console.error("Error fetching feature names:", error);
  //     }
  //   };
  //   fetchFeatures();
  // }, []);

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
      setFeatureData(data);
  
      d3.select(chartsContainerRef.current).selectAll("*").remove();
      console.log('chartsContainerRef.current:', chartsContainerRef.current);
  
      if (chartsContainerRef.current) {
        // Visualize with imported functions, passing feature names
        createCorrelationHeatmap(data, chartsContainerRef.current, feature1, feature2);
        // createJointDistributionPlot(data, chartsContainerRef.current);
        // createInteractionPlot(data, chartsContainerRef.current);
        // createKDEPlot(data, chartsContainerRef.current);
        // createFacetGrid(data, chartsContainerRef.current);
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
