import React, { useEffect, useRef, useState } from 'react';
import { extractLatLong } from '../support/mapCreator';
import '../assets/css/global.css';
import worldData from '../assets/countries.geo.json';
import * as d3 from 'd3';

const Overview = () => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [loading, setLoading] = useState(true);  // State to manage loading animation

  useEffect(() => {
    const drawMap = async (coordinates) => {
      const svg = d3.select(svgRef.current)
        .style('background-color', '#121212');

      const tooltip = d3.select(tooltipRef.current)
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'rgb(48, 106, 145)')
        .style('color', 'white')
        .style('padding', '5px 10px')
        .style('border-radius', '5px')
        .style('font-size', '12px');

      const updateDimensions = () => {
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;

        svg.attr('width', width)
          .attr('height', height);

        const projection = d3.geoMercator().fitSize([width, height], worldData);
        const path = d3.geoPath().projection(projection);

        // Clear previous elements
        svg.selectAll('*').remove();

        // Draw the world map
        svg.selectAll('path')
          .data(worldData.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', '#2d8c85')
          .attr('stroke', 'white')
          .attr('stroke-width', 0.5);

        // Plot the accident coordinates on the map
        svg.selectAll('circle')
          .data(coordinates)
          .enter()
          .append('circle')
          .attr('cx', d => projection([d.longitude, d.latitude])[0])
          .attr('cy', d => projection([d.longitude, d.latitude])[1])
          .attr('r', 4)
          .attr('fill', 'red')
          .on('mouseover', (event, d) => {
            tooltip.style('visibility', 'visible').text('England');
          })
          .on('mousemove', (event) => {
            tooltip
              .style('top', (event.pageY - 20) + 'px')
              .style('left', (event.pageX + 20) + 'px');
          })
          .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
          });
      };

      updateDimensions();

      // Handle window resize
      window.addEventListener('resize', updateDimensions);

      // Cleanup function to remove event listener
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    };

    const fetchAndDrawMap = async () => {
      try {
        const coordinates = await extractLatLong();  // Draw the map
        await drawMap(coordinates);  // Draw the map using the fetched coordinates
        setLoading(false);  // Stop the loading animation when the map is drawn
      } catch (error) {
        console.error("Error extracting coordinates:", error);
        setLoading(false);  // Stop loading if an error occurs
      }
    };

    fetchAndDrawMap();  // Start fetching coordinates and drawing the map
  }, []);

  return (
    <div className="page-container">
      {/* Conditional rendering of loading spinner */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading map...</p>
        </div>
      )}

      <p className="text-content">
        • Explore traffic accident data across England. Use this map to identify accident hotspots and uncover potential contributing factors such as weather conditions, time of day, and road infrastructure in statistics tab. Hover over points to learn more about specific locations.
      </p>
      <svg ref={svgRef} style={{ width: '100%', height: '400px' }}></svg>
      <div ref={tooltipRef} className="tooltip"></div>
    </div>
  );
};

export default Overview;
