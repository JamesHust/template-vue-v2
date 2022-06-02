import * as d3 from 'd3'

function drawGraphNodeOverlay (dataBus, svg) {
    // const {
    //     nodeRadius
    // } = dataBus.style

    const groupWrapNodeOverlay = svg.append('g')
        .attr('class', 'g-container-node-overlay')
        .append('g')
        .attr('id', 'g-wrap-node-overlay')
        .attr('class', 'g-wrap-node-overlay')

    groupWrapNodeOverlay.append('circle')
        .attr('class', 'node-overlay-point')
        .attr('r', 5)

    groupWrapNodeOverlay.append('line')
        .attr('class', 'node-overlay-line')
        .attr('x0', 0)
        .attr('y0', 0)
        .attr('x1', 0)
        .attr('y1', 0)

    // create line first
    groupWrapNodeOverlay
        .call(linkDrag(dataBus))

    return groupWrapNodeOverlay
}

function linkDrag (dataBus) {
    const gWrapNodeOverlay = d3.select('#g-wrap-node-overlay')
    const nodeOverlayPoint = gWrapNodeOverlay.select('.node-overlay-point')
    const nodeOverlayLine = gWrapNodeOverlay.select('.node-overlay-line')

    function onDragStart () {
        dataBus.internal.nodeLinkDragging = true
        let source = dataBus.internal.nodeLinkSource
        nodeOverlayLine
            .attr('x1', source.x)
            .attr('y1', source.y)
    }

    function onDrag (event) {
        nodeOverlayPoint
            .attr('cx', event.x)
            .attr('cy', event.y)
        nodeOverlayLine
            .attr('x2', event.x)
            .attr('y2', event.y)
    }

    function onDragEnd (event) {
        dataBus.internal.nodeLinkDragging = false
        nodeOverlayPoint
            .attr('cx', 0)
            .attr('cy', 0)
        nodeOverlayLine
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0)

        dataBus.event.onCreateLink(
            dataBus.internal.nodeLinkSource,
            dataBus.internal.nodeLinkTarget
        )
    }

    return d3.drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd)
}

export default drawGraphNodeOverlay
