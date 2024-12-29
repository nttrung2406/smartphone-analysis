import * as d3 from 'd3'

export function renderMissingValue(data) {
    const missingCount = data.filter(d => !d || d === '').length;
    const filledCount = data.length - missingCount;

    const chart = d3.select('.missing-value__chart').append('p')
        .attr('class', 'data-info')
        .style('display', 'none') // Initially hidden
        .text(`Filled: ${filledCount}, Missing: ${missingCount}`)
    // console.log(chart)
}