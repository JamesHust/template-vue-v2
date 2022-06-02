import { angle, updatePosition } from './kg-simulation'
import * as d3 from 'd3'
import { distance } from './kg-common'

export function drawGraphLayout (dataBus) {
    updatePosition(dataBus)
    dataBus.internal.groupNode.call(drag(dataBus))
}

function drag (dataBus) {
    function onDrag (event, d) {
        d.x = event.x
        d.y = event.y
        updateNodePosition(this, d.id, dataBus)
    }
    //
    // function onDragEnd (event) {
    //     dataBus.event.onSaveGraphLayout(event)
    // }

    return d3.drag()
        .on('drag', onDrag)
        // .on('end', onDragEnd)
}

function updateNodePosition (element, nodeId, dataBus) {
    const {
        relationCurveHeight
    } = dataBus.style

    d3.select(element)
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

    let relatedLink = dataBus.internal.groupLink.filter(link => link.source.id === nodeId || link.target.id === nodeId)

    relatedLink.select('path')
        .attr('d', d => {
            const length = distance(d.source, d.target)
            let curvePoint = {
                x: length / 2,
                y: d.curveMultiplier * relationCurveHeight * 2
            }
            return `M 0 0 Q ${curvePoint.x} ${curvePoint.y} ${length} 0`
        })

    relatedLink.select('rect')
        .attr('x', d => {
            let textEl = document.getElementById('link-text-' + d.id)
            let textLength = textEl ? textEl.getComputedTextLength() : 0
            d.textRect = {
                width: textLength
            }
            return distance(d.source, d.target) / 2 - textLength / 2
        })
        .attr('width', d => d.textRect.width)

    relatedLink.select('text')
        .attr('x', d => distance(d.source, d.target) / 2)
        .attr('transform', d => {
            const length = distance(d.source, d.target)
            let dx = d.target.x - d.source.x
            return dx > 0 ? 'rotate(0)' : `rotate(180, ${length / 2}, ${d.curveMultiplier * relationCurveHeight})`
        })

    relatedLink.attr('transform', d => {
        let translate = `translate(${d.source.x}, ${d.source.y})`
        let rotate = `rotate(${angle(d.source, d.target)})`
        return `${translate} ${rotate}`
    })
}
