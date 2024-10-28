import * as d3 from 'd3';

// Function to create a missing values chart
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

// Function to create a unique values chart
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

// Function to create a distribution chart
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


/**
 * Create a horizontal bar chart.
 * @param {Array} data - The data to visualize.
 * @param {string} selector - The DOM element selector to append the chart.
 */
export const createHorizontalBarChart = (data, selector) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 100 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]) 
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, height])
    .padding(0.1);

  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => y(d.name))
    .attr('width', d => x(d.value))
    .attr('height', y.bandwidth())
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Name: ${d.name}<br>Value: ${d.value}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

  svg.append('g').call(d3.axisLeft(y));
  svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
};

/**
 * Create a vertical bar chart.
 * @param {Array} data 
 * @param {string} selector 
 */
export const createVerticalBarChart = (data, selector) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value))
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Name: ${d.name}<br>Value: ${d.value}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

  svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
  svg.append('g').call(d3.axisLeft(y));
};

/**
 * Create a line chart.
 * @param {Array} data 
 * @param {string} selector 
 */
export const createLineChart = (data, selector) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)) 
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height, 0]);

  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line);

  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('r', 5)
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`X: ${d.x}<br>Y: ${d.y}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

  svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
  svg.append('g').call(d3.axisLeft(y));
};

/**
 * Create a scatter plot.
 * @param {Array} data 
 * @param {string} selector 
 */
export const createScatterPlot = (data, selector) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)]) 
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)]) 
    .range([height, 0]);

  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  svg.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('r', 5)
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`X: ${d.x}<br>Y: ${d.y}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

  svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
  svg.append('g').call(d3.axisLeft(y));
};

/**
 * Create a pie chart.
 * @param {Array} data 
 * @param {string} selector 
 */
export const createPieChart = (data, selector) => {
  const width = 600;
  const height = 400;
  const radius = Math.min(width, height) / 2;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie()
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const arcs = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc');

  arcs.append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.name))
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Name: ${d.data.name}<br>Value: ${d.data.value}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));
};

/**
 * Create a stacked bar chart.
 * @param {Array} data 
 * @param {string} selector 
 */


export const createStackedBarChart = (data, selector) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const keys = Object.keys(data[0]).slice(1); // Assuming the first key is the x-axis label

  const x = d3.scaleBand()
    .domain(data.map(d => d.name)) // Replace 'name' with your x-axis key
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.sum(keys, key => d[key]))])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  svg.append('g')
    .selectAll('g')
    .data(d3.stack().keys(keys)(data))
    .enter().append('g')
    .attr('fill', d => color(d.key))
    .selectAll('rect')
    .data(d => d)
    .enter().append('rect')
    .attr('x', d => x(d.data.name))
    .attr('y', d => y(d[1]))
    .attr('height', d => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth());

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));
};

/**
 * Create a waterfall chart.
 * @param {Array} data - Array of data objects.
 * @param {string} selector - The CSS selector to append the chart to.
 */
export const createWaterfallChart = (data, selector) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.name)) // Replace 'name'
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.cumulativeValue)]) // Replace cumulative values
    .range([height, 0]);

  svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.cumulativeValue))
    .attr('height', d => height - y(d.value))
    .attr('width', x.bandwidth());

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));
};

/**
 * Create a treemap.
 * @param {Array} data - Array of data objects.
 * @param {string} selector - The CSS selector to append the chart to.
 */
export const createTreemap = (data, selector) => {
  const width = 600;
  const height = 400;

  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const root = d3.hierarchy({ values: data })
    .sum(d => d.value); //Replace 'value' property
  d3.treemap()
    .size([width, height])
    .padding(1)(root);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  svg.selectAll('rect')
    .data(root.leaves())
    .enter().append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => color(d.data.name)); // Replace 'name' property

  svg.selectAll('text')
    .data(root.leaves())
    .enter().append('text')
    .attr('x', d => d.x0 + 5) // Adjust for padding
    .attr('y', d => d.y0 + 20) // Adjust for padding
    .text(d => d.data.name); // Replace with the appropriate text
};


