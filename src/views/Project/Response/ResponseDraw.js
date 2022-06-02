import * as d3 from 'd3'
import $utils from '@/utils/utils'

const itemHeight = 50
const itemMargin = 10
const intentWidth = 100
const conditionWidth = 300
const queryWidth = 300
const answerWidth = 300

export function drawResponseGraph (svgId, dataBus) {
    const svg = d3.select('#' + svgId)
    svg.selectAll('*').remove()
    const items = dataBus.items

    let gZoom = svg.select('g.g-zoom')
    gZoom = svg.append('g')
        .attr('class', 'g-zoom')
    let zoom = d3.zoom()
        .extent([[0, 0], [dataBus.svgWidth, dataBus.svgHeight]])
        .scaleExtent([0.1, 2])
        .on('zoom', e => {
            gZoom.attr('transform', e.transform)
        })
    svg.call(zoom)

    for (let i = 0; i < items.length; i++) {
        let item = items[i]

        let itemGroup = gZoom.append('g')
        itemGroup
            .attr('transform', `translate(${intentWidth + itemMargin * 2}, ${itemMargin + i * (itemHeight + itemMargin)})`)

        // condition group
        let conditionGroup = itemGroup.append('g')
        conditionGroup.append('rect')
            .attr('width', conditionWidth)
            .attr('height', itemHeight)
            .attr('rx', 5)
            .attr('ry', 5)
        conditionGroup.append('text')
            .attr('dx', 15)
            .attr('dy', 15)
            .text(item.description)
        conditionGroup.append('text')
            .attr('dx', conditionWidth / 2)
            .attr('dy', 15)
            .text(item.condition_type)
        conditionGroup.append('text')
            .attr('dx', 15)
            .attr('dy', 30)
            .text(item.condition_text)

        // query group
        let queryGroup = itemGroup.append('g')
            .attr('transform', `translate(${conditionWidth + itemMargin}, 0)`)
        queryGroup.append('rect')
            .attr('width', queryWidth)
            .attr('height', itemHeight)
            .attr('rx', 5)
            .attr('ry', 5)
        queryGroup.append('text')
            .attr('dx', 15)
            .attr('dy', 30)
            .text($utils.limitStr(item.query, 20))

        // answer group
        let answerGroup = itemGroup.append('g')
            .attr('transform', `translate(${conditionWidth + queryWidth + itemMargin * 2}, 0)`)
        answerGroup.append('rect')
            .attr('width', answerWidth)
            .attr('height', itemHeight)
            .attr('rx', 5)
            .attr('ry', 5)
        answerGroup.append('text')
            .attr('dx', 15)
            .attr('dy', 30)
            .text(item.answer)

        // override group
        let overrideGroup = itemGroup.append('g')
            .attr('transform', `translate(${conditionWidth + queryWidth + answerWidth + itemMargin * 3}, 0)`)
        overrideGroup.append('rect')
            .attr('width', queryWidth)
            .attr('height', itemHeight)
            .attr('rx', 5)
            .attr('ry', 5)
        overrideGroup.append('text')
            .attr('dx', 15)
            .attr('dy', 30)
            .text(JSON.stringify(item.override_result))
    }
}
