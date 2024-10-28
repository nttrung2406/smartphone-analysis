import React, { useEffect, useState, useRef } from 'react';
import { extractFeatureData } from '../support/singularFeatureExtractor';
import * as d3 from 'd3';
import '../assets/global.css';
import { createMissingValuesChart, createUniqueValuesChart, createDistributionChart } from '../support/chartCreator'; 

const Singular = () => {
  const [featureName, setFeatureName] = useState(''); // State to store selected feature
  const [recommendedFeatures, setRecommendedFeatures] = useState([]); // State to store CSV feature names
  const [featureData, setFeatureData] = useState([]); // State to store data for the selected feature
  const [loading, setLoading] = useState(false); // Loading state

  const chartsContainerRef = useRef(null); // Ref for the chart container

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const data = await extractFeatureData(); 
        const featureNames = Object.keys(data[0]);
        setRecommendedFeatures(featureNames);
      } catch (error) {
        console.error("Error fetching feature names:", error);
      }
    };
    fetchFeatures();
  }, []);

  // Loading animation
  const startLoadingSpinner = () => {
    setLoading(true);
  };

  const stopLoadingSpinner = () => {
    setLoading(false);
  };

  // Fetch and visualize data for the selected feature
  const fetchDataAndVisualize = async () => {
    if (!featureName) return;
    startLoadingSpinner(); 
    
    try {
      const data = await extractFeatureData(featureName);
      setFeatureData(data);
      visualizeFeatureData(data);
    } catch (error) {
      console.error(`Error fetching data for feature ${featureName}:`, error);
    } finally {
      stopLoadingSpinner(); 
    }
  };

  const visualizeFeatureData = (data) => {
    if (!data.length) return;

    const chartsContainer = d3.select(chartsContainerRef.current);
    chartsContainer.selectAll('*').remove(); 

    // Use imported functions to create charts
    createMissingValuesChart(data, chartsContainer, featureName);
    createUniqueValuesChart(data, chartsContainer, featureName);
    createDistributionChart(data, chartsContainer, featureName);

    window.addEventListener('resize', () => {
      chartsContainer.selectAll('*').remove(); 
      createMissingValuesChart(data, chartsContainer, featureName);
      createUniqueValuesChart(data, chartsContainer, featureName);
      createDistributionChart(data, chartsContainer, featureName);
    });
  };

  return (
    <div className="page-container">
      <h2>Singular Feature Analysis</h2>

      {/* Feature Selection Input */}
      <input
        type="text"
        list="featureNames"
        value={featureName}
        onChange={(e) => setFeatureName(e.target.value)}
        placeholder="Enter feature name..."
      />
      <datalist id="featureNames">
        {recommendedFeatures.map((feature, idx) => (
          <option key={idx} value={feature} />
        ))}
      </datalist>

      {/* Start Analysis Button */}
      <button onClick={fetchDataAndVisualize}>Analyze Feature</button>

      {/* Loading Spinner */}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Charts Container */}
      <div ref={chartsContainerRef} className="charts-container"></div>
    </div>
  );
};

export default Singular;
