import * as d3 from 'd3'
import { distance, getNodeColor } from './kg-common'
import kbUtils from '@/utils/kbUtils'

function drawGraphNode (dataBus, svg) {
    const {
        nodeList
    } = dataBus
    const {
        nodeRadius,
        nodeStartX,
        nodeStartY
    } = dataBus.style

    let gNodeList = svg.select('g.g-container-node')
    if (gNodeList.empty()) {
        gNodeList = svg.append('g')
            .attr('class', 'g-container-node')
    }

    let gNodeWrap = gNodeList.selectAll('g.g-wrap-node')
        .data(nodeList, d => d.id)

    gNodeWrap.exit().remove()

    let gNodeWrapEnter = gNodeWrap.enter()
        .append('g')
        .attr('id', d => 'g-wrap-node-' + d.id)
        .attr('class', 'g-wrap-node')
        .attr('transform', `translate(${nodeStartX}, ${nodeStartY})`)

    gNodeWrapEnter.append('title')
        .text(d => d.id)

    gNodeWrapEnter.append('circle')
        .attr('class', 'g-wrap-node-circle')
        .attr('r', nodeRadius)
        .on('contextmenu', (e, d) => {
            e.preventDefault()
            dataBus.event.onNodeContextMenu(e, d)
        })
        .on('click', dataBus.event.onNodeClick)
        .on('mouseenter', (event, d) => {
            if (dataBus.internal.nodeLinkDragging) {
                dataBus.internal.nodeLinkTarget = d
            } else {
                dataBus.internal.nodeLinkSource = d
                const overlay = d3.select('#g-wrap-node-overlay')
                overlay.classed('active', true)
                overlay.select('circle')
                    .attr('cx', d.x)
                    .attr('cy', d.y)
                overlay.select('line')
                    .attr('x1', d.x)
                    .attr('y1', d.y)
                    .attr('x2', d.x)
                    .attr('y2', d.y)
            }
        })
        .on('mouseleave', (event, d) => {
            if (dataBus.internal.nodeLinkDragging) {
                return
            }
            let svgRect = document.getElementById(dataBus.svgId).getBoundingClientRect()
            let mouseSVG = {
                x: event.x - svgRect.x,
                y: event.y - svgRect.y
            }
            if (distance(mouseSVG, d) < nodeRadius) {
                return
            }
            const overlay = d3.select('#g-wrap-node-overlay')
            overlay.classed('active', false)
            overlay.select('circle')
                .attr('cx', 0)
                .attr('cy', 0)
            overlay.select('line')
                .attr('x0', 0)
                .attr('y0', 0)
            // dataBus.event.onSaveGraphLayout()
        })

    gNodeWrapEnter.append('text')
        .attr('id', d => 'node-text-' + d.id)
        .attr('class', 'node-text')
        .attr('dx', nodeRadius + 3)
        .attr('alignment-baseline', 'middle')
        .text(d => kbUtils.getNodeName(d.data))
        .on('mousedown', e => e.stopPropagation())

    let gNodeWrapAll = gNodeWrapEnter.merge(gNodeWrap)
    gNodeWrapAll
        .select('.node-text')
        .text(d => kbUtils.getNodeName(d.data))

    gNodeList
        .selectAll('g.g-wrap-node')
        .classed('active', d => d.id === dataBus.style.activeNode.id)
        .select('.g-wrap-node-circle')
        .style('fill', d => {
            return getNodeColor(dataBus, dataBus.showColor, dataBus.style.activeNode.id, d)
        })

    return gNodeWrapAll
}

export default drawGraphNode
