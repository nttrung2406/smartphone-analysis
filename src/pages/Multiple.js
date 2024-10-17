import React, { useEffect, useState, useRef } from 'react';
import { extractFeatureData } from '../support/multiFeatureExtractor';
import * as d3 from 'd3';
import '../assets/css/global.css';

const Multiple = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]); // State to store selected features
  const [recommendedFeatures, setRecommendedFeatures] = useState([]); // State to store CSV feature names
  const [featureData, setFeatureData] = useState([]); // State to store data for selected features
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

  // Fetch and visualize data for the selected features
  const fetchDataAndVisualize = async () => {
    if (selectedFeatures.length < 2) {
      alert("Please select at least two features.");
      return;
    }
    
    startLoadingSpinner();

    try {
      const data = await extractFeatureData(selectedFeatures);
      setFeatureData(data);
      visualizeMultipleFeatures(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      stopLoadingSpinner();
    }
  };

  // Visualization logic to analyze relationships between multiple features
  const visualizeMultipleFeatures = (data) => {
    const chartsContainer = d3.select(chartsContainerRef.current);
    chartsContainer.selectAll('*').remove(); 

    // Generate scatter plots for all combinations of selected features
    for (let i = 0; i < selectedFeatures.length; i++) {
      for (let j = i + 1; j < selectedFeatures.length; j++) {
        const featureX = selectedFeatures[i];
        const featureY = selectedFeatures[j];
        createScatterPlot(data, featureX, featureY, chartsContainer);
      }
    }
  };

  // Scatter plot generation for pairs of features
  const createScatterPlot = (data, featureX, featureY, container) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Scatter Plot: ${featureX} vs ${featureY}`);

    const svg = chart.append('svg').attr('width', '100%').attr('height', 300);
    const width = svg.node().getBoundingClientRect().width;
    const height = 300; 
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };  

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // X-axis scale based on featureX data
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => +d[featureX]), d3.max(data, d => +d[featureX])])
      .range([0, plotWidth]);

    // Y-axis scale based on featureY data
    const yScale = d3.scaleLinear()
      .domain([d3.min(data, d => +d[featureY]), d3.max(data, d => +d[featureY])])
      .range([plotHeight, 0]);  // Inverted range for proper orientation

    // Append X axis
    g.append('g')
      .attr('transform', `translate(0, ${plotHeight})`)  
      .call(d3.axisBottom(xScale).ticks(6))  
      .append('text')
      .attr('fill', '#000')
      .attr('x', plotWidth / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(`${featureX}`);

    // Append Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(6))  
      .append('text')
      .attr('fill', '#000')
      .attr('x', -plotHeight / 2)
      .attr('y', -40)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text(`${featureY}`);

    // Plot the data points (scatter plot)
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(+d[featureX]))
      .attr('cy', d => yScale(+d[featureY]))
      .attr('r', 5)
      .attr('fill', 'steelblue');
  };

  return (
    <div className="page-container">
      <h2>Multiple Feature Analysis</h2>

      {/* Multi-feature Selection Input */}
      <select
        multiple
        value={selectedFeatures}
        onChange={(e) => {
          const options = e.target.options;
          const selected = [];
          for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
              selected.push(options[i].value);
            }
          }
          setSelectedFeatures(selected);
        }}
      >
        {recommendedFeatures.map((feature, idx) => (
          <option key={idx} value={feature}>
            {feature}
          </option>
        ))}
      </select>

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
