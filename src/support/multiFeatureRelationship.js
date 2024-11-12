import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import { sampleCorrelation } from 'simple-statistics';

export const createCorrelationHeatmap = (data, container, feature1, feature2) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Correlation Heatmap for ${feature1} and ${feature2}`);
  
    const svg = chart.append('svg').attr('width', 250).attr('height', 250);
    const width = svg.attr('width');
    const height = svg.attr('height');

    const validData = data.filter(d => {
        return !isNaN(+d[feature1]) && !isNaN(+d[feature2]);
    });
    const feature1Values = validData.map(d => +d[feature1]);
    const feature2Values = validData.map(d => +d[feature2]);

    if (feature1Values.length < 2 || feature2Values.length < 2) {
        console.error("Not enough data to calculate correlation.");
        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height / 2)
           .attr("text-anchor", "middle")
           .attr("alignment-baseline", "middle")
           .text("Insufficient Data");
        return;
    }

    const correlation = sampleCorrelation(feature1Values, feature2Values);
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu).domain([-1, 1]);

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", colorScale(correlation));
  
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(correlation.toFixed(2));
    
    chart.append("p")
      .attr("class", "chart-note")
      .style("font-size", "12px")
      .style("color", "grey")
      .text("Note: 1 indicates a perfect positive correlation, -1 a perfect negative correlation, and 0 no correlation.");
    
};


export const createJointDistributionPlot = (data, container, feature1, feature2) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Joint Distribution of ${feature1} and ${feature2}`);

    const svg = chart.append('svg').attr('width', 400).attr('height', 300);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[feature1])).nice()
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[feature2])).nice()
        .range([height - margin.bottom, margin.top]);

    // Use d3Hexbin instead of d3.hexbin
    const hexbin = d3Hexbin()
        .x(d => xScale(d[feature1]))
        .y(d => yScale(d[feature2]))
        .radius(10)
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const bins = hexbin(data);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, d3.max(bins, d => d.length)]);

    svg.append("g")
        .selectAll("path")
        .data(bins)
        .enter()
        .append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("fill", d => colorScale(d.length));
    
    svg.append("g").attr("transform", `translate(0, ${height - margin.bottom})`).call(d3.axisBottom(xScale));
    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale));
};


export const createKDEPlot = (data, container, feature1, feature2) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`2D KDE Plot for ${feature1} and ${feature2}`);

    const svg = chart.append('svg').attr('width', 400).attr('height', 300);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[feature1])).nice()
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[feature2])).nice()
        .range([height - margin.bottom, margin.top]);

    // Use a density estimation library for 2D KDE here, or estimate density
    // For simplicity, this example uses contours
    const densityData = d3.contourDensity()
        .x(d => xScale(d[feature1]))
        .y(d => yScale(d[feature2]))
        .size([width, height])
        .bandwidth(30)(data);

    const colorScale = d3.scaleSequential(d3.interpolateMagma)
        .domain([0, d3.max(densityData, d => d.value)]);

    svg.selectAll("path")
        .data(densityData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", d => colorScale(d.value))
        .attr("opacity", 0.8);

    svg.append("g").attr("transform", `translate(0, ${height - margin.bottom})`).call(d3.axisBottom(xScale));
    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale));
};
