import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import { sampleCorrelation } from 'simple-statistics';

export const createTooltip = (container) => {
    const tooltip = container.append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.7)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("visibility", "hidden")
        .style("pointer-events", "none");
    
    return tooltip;
};

export const showTooltip = (tooltip, event, content) => {
    tooltip.style("visibility", "visible")
        .html(content)
        .style("top", `${event.pageY + 10}px`)
        .style("left", `${event.pageX + 10}px`);
};

export const hideTooltip = (tooltip) => {
    tooltip.style("visibility", "hidden");
};

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

    const tooltip = createTooltip(container);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[feature1])).nice()
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[feature2])).nice()
        .range([height - margin.bottom, margin.top]);

    const hexbin = d3Hexbin()
        .x(d => xScale(d[feature1]))
        .y(d => yScale(d[feature2]))
        .radius(10)
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const bins = hexbin(data);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([0, d3.max(bins, d => d.length)]);

    svg.append("g").selectAll("path")
        .data(bins)
        .enter()
        .append("path")
        .attr("d", hexbin.hexagon())
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("fill", d => colorScale(d.length))
        .on("mouseover", function (event, d) {
            // Thu nhỏ hình lục giác khi mouseover
            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", d => `translate(${d.x},${d.y}) scale(0.8)`); // Thu nhỏ 80%

            // Hiển thị tooltip
            const content = d.map(p => `
                <strong>${feature1}:</strong> ${p[feature1]}<br/>
                <strong>${feature2}:</strong> ${p[feature2]}
            `).join('<br/><br/>');
            showTooltip(tooltip, event, content);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function () {
            // Khôi phục kích thước hình lục giác khi mouseout
            d3.select(this)
                .transition()
                .duration(150)
                .attr("transform", d => `translate(${d.x},${d.y}) scale(1)`); // Quay lại kích thước ban đầu

            // Ẩn tooltip
            hideTooltip(tooltip);
        });

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
    const chart = container.append('div').attr('class', 'chart');
    chart.append('h4').text(`Scatter Plot for ${feature1} and ${feature2}`);

    const svg = chart.append('svg').attr('width', 400).attr('height', 300);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const tooltip = createTooltip(container);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d[feature1]))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d[feature2]))
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(5));

    // Lọc bỏ các chấm có giá trị null cho feature1 hoặc feature2
    const filteredData = data.filter(d => d[feature1] != null && d[feature2] != null);

    svg.selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(+d[feature1]))
        .attr("cy", d => yScale(+d[feature2]))
        .attr("r", 3)  // Kích thước ban đầu
        .attr("fill", "steelblue")
        .attr("opacity", 0.7)
        .on("mouseover", function (event, d) {
            // Thay đổi màu sắc và phóng to chấm khi hover
            d3.select(this)
                .attr("fill", "yellow")
                .attr("r", 6);  // Phóng to chấm

            // Hiển thị tooltip
            const content = `
                <strong>${feature1}:</strong> ${d[feature1]}<br/>
                <strong>${feature2}:</strong> ${d[feature2]}
            `;
            showTooltip(tooltip, event, content);
        })
        .on("mousemove", (event) => {
            tooltip.style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function () {
            // Khôi phục màu sắc và kích thước ban đầu khi không hover
            d3.select(this)
                .attr("fill", "steelblue")
                .attr("r", 3);  // Khôi phục kích thước ban đầu

            // Ẩn tooltip
            hideTooltip(tooltip);
        });

    // Add labels to the axes
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 25)
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