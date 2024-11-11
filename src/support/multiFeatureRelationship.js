import * as d3 from 'd3';
import * as ss from 'simple-statistics';
import { sampleCorrelation } from 'simple-statistics';

export const createCorrelationHeatmap = (data, container, feature1, feature2) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Correlation Heatmap for ${feature1} and ${feature2}`);
  
    const svg = chart.append('svg').attr('width', 250).attr('height', 250);
    const width = svg.attr('width');
    const height = svg.attr('height');
  
    const correlation = sampleCorrelation(data.map(d => d[feature1]), data.map(d => d[feature2]));
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
  };
  

/*
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

    const hexbin = d3.hexbin()
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

export const createInteractionPlot = (data, container, feature1, feature2, feature3) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Interaction Plot of ${feature1} and ${feature2} by ${feature3}`);

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

    const colorScale = d3.scaleSequential(d3.interpolateCool)
        .domain(d3.extent(data, d => d[feature3]));

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[feature1]))
        .attr("cy", d => yScale(d[feature2]))
        .attr("r", 3)
        .attr("fill", d => colorScale(d[feature3]));

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


export const createScatterPlot = (data, container, feature1, feature2) => {
    // Define dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 250 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
  
    const svg = d3.select(container)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Define scales for x and y axes
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => +d[feature1]))
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => +d[feature2]))
      .range([height, 0]);
  
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5));
  
    svg.append("g")
      .call(d3.axisLeft(yScale).ticks(5));
  
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[feature1]))
      .attr("cy", d => yScale(d[feature2]))
      .attr("r", 3)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);
  
    // Add labels to the axes
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .text(feature1);
  
    svg.append("text")
      .attr("class", "axis-label")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text(feature2);
  };
  

export const createFacetGrid = (data, container, feature1, feature2, conditionFeature) => {
    const uniqueConditions = [...new Set(data.map(d => d[conditionFeature]))];
    
    uniqueConditions.forEach(condition => {
        const chartData = data.filter(d => d[conditionFeature] === condition);
        const subContainer = container.append('div').attr('class', 'facet');
        createScatterPlot(subContainer, chartData, feature1, feature2);
        subContainer.append("h5").text(`${conditionFeature}: ${condition}`);
    });
};
*/
