import * as d3 from 'd3'
import { distance } from './kg-common'

export function updatePosition (dataBus) {
    const {
        relationCurveHeight
    } = dataBus.style

    dataBus.internal.groupNode.attr('transform', d => {
        return `translate(${d.x}, ${d.y})`
    })

    // if (nodeLinkSource) {
    //     const source = nodeLinkSource
    //     const overlay = d3.select('#g-wrap-node-overlay')
    //     if (!nodeLinkDragging) {
    //         overlay.select('circle')
    //             .attr('cx', source.x)
    //             .attr('cy', source.y)
    //         overlay.select('line')
    //             .attr('x2', source.x)
    //             .attr('y2', source.y)
    //     }
    //     overlay.select('line')
    //         .attr('x1', source.x)
    //         .attr('y1', source.y)
    // }

    dataBus.internal.groupLink.select('path')
        .attr('d', d => {
            const length = distance(d.source, d.target)
            let curvePoint = {
                x: length / 2,
                y: d.curveMultiplier * relationCurveHeight * 2
            }
            return `M 0 0 Q ${curvePoint.x} ${curvePoint.y} ${length} 0`
        })

    dataBus.internal.groupLink.select('rect')
        .attr('x', d => {
            let textEl = document.getElementById('link-text-' + d.id)
            let textLength = textEl ? textEl.getComputedTextLength() : 0
            d.textRect = {
                width: textLength
            }
            return distance(d.source, d.target) / 2 - textLength / 2
        })
        .attr('width', d => d.textRect.width)

    dataBus.internal.groupLink.select('text')
        .attr('x', d => distance(d.source, d.target) / 2)
        .attr('transform', d => {
            const length = distance(d.source, d.target)
            let dx = d.target.x - d.source.x
            return dx > 0 ? 'rotate(0)' : `rotate(180, ${length / 2}, ${d.curveMultiplier * relationCurveHeight})`
        })

    dataBus.internal.groupLink.attr('transform', d => {
        let translate = `translate(${d.source.x}, ${d.source.y})`
        let rotate = `rotate(${angle(d.source, d.target)})`
        return `${translate} ${rotate}`
    })
}

function drawGraphSimulation (dataBus, simulation) {
    const {
        nodeList,
        linkList
    } = dataBus

    if (simulation) {
        simulation.nodes(nodeList)
        simulation.force('link').links(linkList)
        simulation.alpha(1).restart()
        dataBus.internal.groupNode.call(drag(simulation, dataBus))
        return simulation
    }

    const {
        svgWidth,
        svgHeight,
        collideRadius
    } = dataBus.style

    simulation = d3.forceSimulation(nodeList)
        .force('link', d3.forceLink(linkList).id(d => d.id).strength(0.1))
        .force('collide', d3.forceCollide().radius(collideRadius).iterations(3).strength(0.1))
        .force('charge', d3.forceManyBody().strength(0.1))
        .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2).strength(0.1))

    simulation.on('tick', () => {
        updatePosition(dataBus)
    })

    dataBus.internal.groupNode.call(drag(simulation, dataBus))
    return simulation
}

export function angle (p1, p2) {
    let dx = p2.x - p1.x
    let dy = p2.y - p1.y
    if (dx === 0) {
        return dy > 0 ? 90 : -90
    }

    let a = Math.atan(dy / dx) / Math.PI * 180
    return dx > 0 ? a : a - 180
}

function drag (simulation, dataBus) {
    function onDragStart (event) {
        let simulationEnded = simulation.alpha() < simulation.alphaMin()
        if (!simulationEnded) {
            if (!event.active) {
                simulation.alphaTarget(0.3).restart()
            }
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
        }
    }

    function onDrag (event) {
        let simulationEnded = simulation.alpha() < simulation.alphaMin()
        if (simulationEnded) {
            event.subject.x = event.x
            event.subject.y = event.y
            updatePosition(dataBus)
        } else {
            event.subject.fx = event.x
            event.subject.fy = event.y
        }
    }

    function onDragEnd (event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    return d3.drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd)
}

export default drawGraphSimulation
