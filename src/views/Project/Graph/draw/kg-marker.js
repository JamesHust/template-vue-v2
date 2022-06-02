function drawGraphMarker (dataBus, svg) {
    const {
        nodeRadius,
        markerSize
    } = dataBus.style

    let gMarker = svg.select('g.g-marker')
    if (gMarker.empty()) {
        svg.append('g')
            .attr('class', 'g-marker')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', `0 0 ${markerSize} ${markerSize}`)
            .attr('refX', nodeRadius + markerSize)
            .attr('refY', markerSize / 2)
            .attr('markerWidth', markerSize)
            .attr('markerHeight', markerSize)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', `M 0 0 L ${markerSize} ${markerSize / 2} L 0 ${markerSize} z`)
    }
}

export default drawGraphMarker
