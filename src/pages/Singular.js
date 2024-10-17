import React, { useEffect, useState, useRef } from 'react';
import { extractFeatureData } from '../support/singularFeatureExtractor';
import * as d3 from 'd3';
import '../assets/css/global.css';

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

    // Null/Missing values chart
    createMissingValuesChart(data, chartsContainer);
    // Unique values chart
    createUniqueValuesChart(data, chartsContainer);
    // Distribution chart
    createDistributionChart(data, chartsContainer);

    window.addEventListener('resize', () => {
      chartsContainer.selectAll('*').remove(); 
      createMissingValuesChart(data, chartsContainer);
      createUniqueValuesChart(data, chartsContainer);
      createDistributionChart(data, chartsContainer);
    });
  };

  const createMissingValuesChart = (data, container) => {
    const missingCount = data.filter(d => !d || d === '').length;
    const filledCount = data.length - missingCount;
  
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Missing Values for ${featureName}`);
  
    const svg = chart.append('svg').attr('width', '100%').attr('height', 250); // Increased height for axes
    const width = svg.node().getBoundingClientRect().width;
    const margin = { top: 10, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = 200;
  
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    const barData = [{ label: 'Filled', count: filledCount }, { label: 'Missing', count: missingCount }];
    const xScale = d3.scaleBand().domain(barData.map(d => d.label)).range([0, chartWidth]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(barData, d => d.count)]).range([chartHeight, 0]);
  
    // Draw bars
    g.selectAll('.bar')
      .data(barData)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.label))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.count))
      .attr('fill', d => d.label === 'Missing' ? 'red' : 'green');
  
    g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  
    g.append('g').call(d3.axisLeft(yScale));
  };
  
  const createUniqueValuesChart = (data, container) => {
    const uniqueCounts = d3.rollup(data, v => v.length, d => d);
    const uniqueValues = Array.from(uniqueCounts.entries()).map(([key, value]) => ({ key, value }));
  
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Unique Values for ${featureName}`);
  
    const svg = chart.append('svg').attr('width', '100%').attr('height', 250); // Increased height for axes
    const width = svg.node().getBoundingClientRect().width;
    const margin = { top: 10, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = 200;
  
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    const xScale = d3.scaleBand().domain(uniqueValues.map(d => d.key)).range([0, chartWidth]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(uniqueValues, d => d.value)]).range([chartHeight, 0]);
  
    // Draw bars
    g.selectAll('.bar')
      .data(uniqueValues)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.key))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.value))
      .attr('fill', 'steelblue');
  
    g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  
    g.append('g').call(d3.axisLeft(yScale));
  };
  
  const createDistributionChart = (data, container) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Distribution of Values for ${featureName}`);
  
    const svg = chart.append('svg').attr('width', '100%').attr('height', 250); // Increased height for axes
    const width = svg.node().getBoundingClientRect().width;
    const margin = { top: 10, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = 200;
  
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    const xScale = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([0, chartWidth]);
  
    const bin = d3.bin()
      .domain(xScale.domain()) 
      .thresholds(xScale.ticks(20)); 
  
    const histogram = bin(data.map(Number));
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(histogram, d => d.length)])
      .range([chartHeight, 0]);
  
    // Draw bars
    g.selectAll('.bar')
      .data(histogram)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.x0))
      .attr('y', d => yScale(d.length))
      .attr('width', d => xScale(d.x1) - xScale(d.x0))
      .attr('height', d => chartHeight - yScale(d.length))
      .attr('fill', 'orange');
  
    // Add X-axis
    g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
  
    // Add Y-axis
    g.append('g').call(d3.axisLeft(yScale));
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
