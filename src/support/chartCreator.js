import * as d3 from 'd3';

export const createMissingValuesChart = (data, container, featureName) => {
    const missingCount = data.filter(d => !d || d === '').length;
    const filledCount = data.length - missingCount;

    const chart = container.append('div').attr('class', 'chart missing-value__chart');
    chart.append('h4').text(`Missing Values for ${featureName}`);

    const svg = chart.append('svg').attr('width', '100%').attr('height', 250);
    const width = svg.node().getBoundingClientRect().width;
    const margin = { top: 10, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = chartWidth / 2;

    //const width = parseInt(d3.select("body").style("width"));
    //const height = width / 2; // Tỷ lệ 2:1

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

    const chart = container.append('div').attr('class', 'chart unique-value__chart');
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

    // Tooltip setup
    // Add <p> element for displaying data
    const tooltip = chart.append('div')
        .attr('class', 'unique-data')
        .style('display', 'block')

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
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d) => {
            console.log(d.value)
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`Value: ${d.value}`)
                .style('right', `50px`)
                .style('top', `50px`)
                .style('background', 'white !important');
        })

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

    // Tooltip setup
    // Add <p> element for displaying data
    const tooltip = chart.append('div')
        .attr('class', 'unique-data')
        .style('display', 'block')


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
        .attr('fill', 'orange')
        .on('mouseover', (event, d) => {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`Value: ${d.length}`)
                .style('width', '200px')
                .style('right', `50px`)
                .style('top', `50px`)
                .style('background', 'white !important');
        })

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

    // Tooltip
    const tooltip = chart.append('div')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('color', 'black')
        .style('padding', '5px 10px')
        .style('border-radius', '4px')
        .style('visibility', 'hidden')
        .style('pointer-events', 'none')
        .style('font-size', '12px');

    // Draw outliers with interaction
    g.selectAll('.outlier')
        .data(sortedData.filter(d => d < min || d > max))
        .enter()
        .append('circle')
        .attr('class', 'outlier')
        .attr('cx', d => xScale(d))
        .attr('cy', chartHeight / 2)
        .attr('r', 4)
        .attr('fill', 'red')
        .on('mouseover', (event, d) => {
            tooltip.style('visibility', 'visible')
                .style('top', `20px`)
                .style('left', `550px`)
                .html(`<strong>Outlier:</strong> ${d}`);
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });

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

    const densityData = d3.histogram()
        .domain(xScale.domain())
        .thresholds(40)(data);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(densityData, d => d.length)])
        .range([chartHeight, 0]);

    const line = d3.line()
        .x(d => xScale(d.x0))
        .y(d => yScale(d.length))
        .curve(d3.curveBasis);

    // Vẽ đường cong mật độ
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

    // Tooltip
    const tooltip = chart.append('div')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('color', 'black')
        .style('padding', '10px 10px')
        .style('border-radius', '4px')
        .style('visibility', 'hidden')
        .style('pointer-events', 'none')
        .style('font-size', '12px');

    // Overlay để bắt sự kiện chuột
    svg.append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mousemove', function (event) {
            const [mouseX] = d3.pointer(event);
            const xValue = xScale.invert(mouseX - margin.left);
            console.log(xValue)
            // Tìm bin gần nhất
            const closestBin = densityData.reduce((prev, curr) =>
                Math.abs(curr.x0 - xValue) < Math.abs(prev.x0 - xValue) ? curr : prev
            );

            // Hiển thị tooltip
            tooltip.style('visibility', 'visible')
                .style('top', `20px`)
                .style('left', `550px`)
                .html(`
            <strong>X:</strong> ${xValue.toFixed(2)}<br>
            <strong>Density:</strong> ${closestBin.length}
          `);
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });
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

    // Tooltip
    const tooltip = chart.append('div')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('color', 'black')
        .style('padding', '10px 10px')
        .style('border-radius', '4px')
        .style('visibility', 'hidden')
        .style('pointer-events', 'none')
        .style('font-size', '12px');

    // Bars with interaction
    g.selectAll('.bar')
        .data(binnedData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(`${d[0]} - ${d[0] + binSize - 1}`))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => chartHeight - yScale(d[1]))
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d) => {
            tooltip.style('visibility', 'visible')
                .style('top', `20px`)
                .style('left', `550px`)
                .html(`
                    <strong>Range:</strong> ${d[0]} - ${d[0] + binSize - 1}<br>
                    <strong>Frequency:</strong> ${d[1]}
                `);
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });

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

