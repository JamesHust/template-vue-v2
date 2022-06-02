import * as d3 from 'd3'
import drawGraphMarker from './kg-marker'
import drawGraphNode from './kg-node'
import drawGraphSimulation from './kg-simulation'
import drawGraphLink from './kg-link'
import { drawGraphLayout } from './kg-layout'
import { getNodeColor } from './kg-common'

function initGraph (dataBus) {
    // get svg
    const svg = d3.select('#' + dataBus.svgId)

    // init internal bus
    if (!dataBus.internal) {
        dataBus.internal = {}
    }

    // clear svg
    svg.select('*').remove()

    // create zoom
    let gZoom = svg.select('g.g-zoom')
    gZoom = svg.append('g')
        .attr('class', 'g-zoom')

    let zoom = d3.zoom()
        .extent([[0, 0], [dataBus.style.svgWidth, dataBus.style.svgHeight]])
        .scaleExtent([0.1, 2])
        .on('zoom', e => {
            dataBus.event.onZoom(e.transform)
            gZoom.attr('transform', e.transform)
        })
    svg.call(zoom)

    // create marker
    drawGraphMarker(dataBus, svg)

    return {
        svg,
        zoom,
        gZoom
    }
}

function updateGraph (dataBus, simulation, gZoom) {
    // update graph
    dataBus.internal.groupLink = drawGraphLink(dataBus, gZoom)
    dataBus.internal.groupNode = drawGraphNode(dataBus, gZoom)

    // update layout
    if (dataBus.updateLayout) {
        simulation = drawGraphSimulation(dataBus, simulation)
    } else {
        drawGraphLayout(dataBus)
    }
    return simulation
}

export function createGraph (dataBus) {
    let { svg, zoom, gZoom } = initGraph(dataBus)
    let simulation = updateGraph(dataBus, null, gZoom)

    return {
        update (dataBus) {
            simulation = updateGraph(dataBus, simulation, gZoom)
        },
        stopSimulation () {
            if (simulation) {
                simulation.stop()
            }
        },
        zoom (newTransform) {
            // noinspection JSCheckFunctionSignatures
            zoom.transform(svg, newTransform)
        },
        updateActive (showColor, activeNodeId, activeLinkId) {
            dataBus.internal.groupNode.classed('active', d => d.id === activeNodeId)
            dataBus.internal.groupLink.classed('active', d => d.id === activeLinkId)
        },
        updateColorNode (showColor, activeNodeId) {
            dataBus.internal.groupNode.selectAll('circle.g-wrap-node-circle')
                .style('fill', d => getNodeColor(dataBus, showColor, activeNodeId, d))
                .style('stroke', d => d.id === activeNodeId ? dataBus.style.activeNode.borderColor : null)
        }
    }
}
