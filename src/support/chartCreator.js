import * as d3 from 'd3';

export const createMissingValuesChart = (data, container, featureName) => {
    const missingCount = data.filter(d => !d || d === '').length;
    const filledCount = data.length - missingCount;

    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Missing Values for ${featureName}`);

    const svg = chart.append('svg').attr('width', '100%').attr('height', 250);
    const width = svg.node().getBoundingClientRect().width;
    const margin = { top: 10, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = 200;

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const barData = [
        { label: 'Filled', count: filledCount },
        { label: 'Missing', count: missingCount }
    ];
    const xScale = d3.scaleBand()
        .domain(barData.map(d => d.label))
        .range([0, chartWidth])
        .padding(0.2);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(barData, d => d.count)])
        .range([chartHeight, 0]);

    // Draw bars
    g.selectAll('.bar')
        .data(barData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
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


export const createUniqueValuesChart = (data, container, featureName) => {
    const uniqueCounts = d3.rollup(data, v => v.length, d => d);
    const uniqueValues = Array.from(uniqueCounts.entries()).map(([key, value]) => ({ key, value }));

    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Unique Values for ${featureName}`);

    const svg = chart.append('svg').attr('width', '100%').attr('height', 250);
    const width = svg.node().getBoundingClientRect().width;
    const margin = { top: 10, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = 200;

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(uniqueValues.map(d => d.key))
        .range([0, chartWidth])
        .padding(0.2);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(uniqueValues, d => d.value)])
        .range([chartHeight, 0]);

    // Draw bars
    g.selectAll('.bar')
        .data(uniqueValues)
        .enter()
        .append('rect')
        .attr('class', 'bar')
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

export const createDistributionChart = (data, container, featureName) => {
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Distribution of Values for ${featureName}`);

    const svg = chart.append('svg').attr('width', '100%').attr('height', 250);
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
        .attr('class', 'bar')
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

export const createOutliersChart = (data, container, featureName) => {
  const chart = container.append('div').attr('class', 'chart');
  chart.append('h4').text(`Outliers for ${featureName}`);

  const svg = chart.append('svg').attr('width', '100%').attr('height', 250);
  const width = svg.node().getBoundingClientRect().width;
  const margin = { top: 10, right: 30, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = 200;

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  const sortedData = data.sort(d3.ascending);
  const q1 = d3.quantile(sortedData, 0.25);
  const median = d3.quantile(sortedData, 0.5);
  const q3 = d3.quantile(sortedData, 0.75);
  const iqr = q3 - q1;
  const min = q1 - 1.5 * iqr;
  const max = q3 + 1.5 * iqr;

  const xScale = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([0, chartWidth]);

  g.append('line')
      .attr('x1', xScale(min))
      .attr('x2', xScale(max))
      .attr('y1', chartHeight / 2)
      .attr('y2', chartHeight / 2)
      .attr('stroke', 'black');

  g.append('rect')
      .attr('x', xScale(q1))
      .attr('y', chartHeight / 2 - 20)
      .attr('width', xScale(q3) - xScale(q1))
      .attr('height', 40)
      .attr('fill', 'lightblue');

  g.append('line')
      .attr('x1', xScale(median))
      .attr('x2', xScale(median))
      .attr('y1', chartHeight / 2 - 20)
      .attr('y2', chartHeight / 2 + 20)
      .attr('stroke', 'black');

  // Draw outliers
  g.selectAll('.outlier')
      .data(sortedData.filter(d => d < min || d > max))
      .enter()
      .append('circle')
      .attr('class', 'outlier')
      .attr('cx', d => xScale(d))
      .attr('cy', chartHeight / 2)
      .attr('r', 4)
      .attr('fill', 'red');

  // X-axis
  g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));
};

export const createDensityChart = (data, container, featureName) => {
  const chart = container.append('div').attr('class', 'chart');
  chart.append('h4').text(`Density Plot for ${featureName}`);

  const svg = chart.append('svg').attr('width', '100%').attr('height', 250);
  const width = svg.node().getBoundingClientRect().width;
  const margin = { top: 10, right: 30, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = 200;

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([0, chartWidth]);

  const density = d3.scaleLinear().domain(xScale.domain());
  const densityData = d3.histogram().domain(xScale.domain()).thresholds(40)(data);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(densityData, d => d.length)])
      .range([chartHeight, 0]);

  const line = d3.line()
      .x(d => xScale(d.x0))
      .y(d => yScale(d.length))
      .curve(d3.curveBasis);

  g.append('path')
      .datum(densityData)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('d', line);

  // X-axis
  g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));

  // Y-axis
  g.append('g').call(d3.axisLeft(yScale));
};

export const createFrequencyChart = (data, container, featureName) => {
  const chart = container.append('div').attr('class', 'chart');
  chart.append('h4').text(`Frequency Distribution for ${featureName}`);

  const svg = chart.append('svg').attr('width', '100%').attr('height', 250);
  const width = svg.node().getBoundingClientRect().width;
  const margin = { top: 10, right: 30, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = 200;

  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  const numericData = data.filter(d => !isNaN(d) && d !== null && d !== undefined);

  const binSize = 100;
  const binnedData = d3.rollups(numericData, v => v.length, d => Math.floor(d / binSize) * binSize)
      .sort((a, b) => d3.ascending(a[0], b[0])); 

  const xScale = d3.scaleBand()
      .domain(binnedData.map(d => `${d[0]} - ${d[0] + binSize - 1}`)) 
      .range([0, chartWidth])
      .padding(0.1);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(binnedData, d => d[1])])
      .range([chartHeight, 0]);

  g.selectAll('.bar')
      .data(binnedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(`${d[0]} - ${d[0] + binSize - 1}`))
      .attr('y', d => yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d[1]))
      .attr('fill', 'steelblue');

  // X-axis with rotated labels
  g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  // Y-axis
  g.append('g').call(d3.axisLeft(yScale));
};

