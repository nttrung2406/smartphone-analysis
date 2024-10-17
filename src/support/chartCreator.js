function drawBarChart(data, feature, title, targetDiv) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3.select(targetDiv)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const counts = d3.rollup(data, v => v.length, d => d[feature]);
  
    const xScale = d3.scaleBand()
      .domain(Array.from(counts.keys()))
      .range([0, width])
      .padding(0.2);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(Array.from(counts.values()))])
      .range([height, 0]);
  
    svg.selectAll('.bar')
      .data(Array.from(counts.entries()))
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d[0]))
      .attr('y', d => yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d[1]))
      .attr('fill', '#00FFFF');
  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .call(d3.axisLeft(yScale));
  
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(title);
  }
  
  // Line chart drawing function
  function drawLineChart(data, feature, title, targetDiv) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3.select(targetDiv)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const counts = d3.rollup(data, v => d3.mean(v, d => d.Accident_Severity), d => d[feature]);
  
    const xScale = d3.scaleBand()
      .domain(Array.from(counts.keys()))
      .range([0, width])
      .padding(0.2);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(Array.from(counts.values()))])
      .range([height, 0]);
  
    const line = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));
  
    svg.append('path')
      .datum(Array.from(counts.entries()))
      .attr('fill', 'none')
      .attr('stroke', '#00FFFF')
      .attr('stroke-width', 2)
      .attr('d', line);
  
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-40)')
      .style('text-anchor', 'end');
  
    svg.append('g')
      .call(d3.axisLeft(yScale));
  
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(title);
  }