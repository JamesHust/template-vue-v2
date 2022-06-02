<template>
    <div class="OntologyView">
        <svg id="ontologyGraph"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: 'OntologyView',
    data () {
        return {
            ontologyInstance: null,
            dataBus: {
                nodeList: [],
                linkList: [],
                style: {
                    zoom: 100,
                    width: 1670,
                    height: 813
                },
                event: {
                    onZoom: this.onZoom
                }
            }
        }
    },
    mounted () {
        this.updateOntology()
    },
    methods: {
        updateOntology () {
            // this.dataBus.nodeList = this.graphData.nodeList
            // this.dataBus.linkList = this.graphData.linkList
            // if (this.ontologyInstance) {
            //     this.ontologyInstance.update(this.dataBus)
            // } else {
            //     this.ontologyInstance = this.createOntology(this.dataBus)
            // }
            this.ontologyInstance = this.createOntology(this.dataBus)
        },
        createOntology (dataBus) {
            this.initOntology(dataBus)
        },
        initOntology (dataBus) {
            // // get svg
            // const svg = d3.select('#ontologyGraph')
            //     .attr('width', dataBus.style.width)
            //     .attr('height', dataBus.style.height)
            //
            // // clear svg
            // svg.select('*').remove()
            //
            // // create zoom
            // let gZoom = svg.select('g.g-zoom')
            // gZoom = svg.append('g')
            //     .attr('class', 'g-zoom')
            // let zoom = d3.zoom()
            //     .on('zoom', e => {
            //         gZoom.attr('transform', e.transform)
            //     })
            // svg.call(zoom)
            //
            // return {
            //     svg,
            //     zoom,
            //     gZoom
            // }

            const width = 960
            const height = 500
            const types = [
                'licensing',
                'suit',
                'resolved'
            ]
            const color = d3.scaleOrdinal(types, d3.schemeCategory10)
            const links = [
                {
                    source: 'Microsoft',
                    target: 'Amazon',
                    type: 'licensing'
                },
                {
                    source: 'Microsoft',
                    target: 'HTC',
                    type: 'licensing'
                },
                {
                    source: 'Samsung',
                    target: 'Apple',
                    type: 'suit'
                },
                {
                    source: 'Motorola',
                    target: 'Apple',
                    type: 'suit'
                },
                {
                    source: 'Nokia',
                    target: 'Apple',
                    type: 'resolved'
                },
                {
                    source: 'HTC',
                    target: 'Apple',
                    type: 'suit'
                },
                {
                    source: 'Kodak',
                    target: 'Apple',
                    type: 'suit'
                },
                {
                    source: 'Microsoft',
                    target: 'Barnes & Noble',
                    type: 'suit'
                },
                {
                    source: 'Microsoft',
                    target: 'Foxconn',
                    type: 'suit'
                },
                {
                    source: 'Oracle',
                    target: 'Google',
                    type: 'suit'
                },
                {
                    source: 'Apple',
                    target: 'HTC',
                    type: 'suit'
                }
            ]
            const nodes = [
                { id: 'Microsoft' },
                { id: 'Amazon' },
                { id: 'HTC' },
                { id: 'Samsung' },
                { id: 'Apple' },
                { id: 'Motorola' },
                { id: 'Nokia' },
                { id: 'Kodak' },
                { id: 'Barnes & Noble' },
                { id: 'Foxconn' },
                { id: 'Oracle' },
                { id: 'Google' },
                { id: 'Inventec' },
                { id: 'LG' },
                { id: 'RIM' },
                { id: 'Sony' },
                { id: 'Qualcomm' },
                { id: 'Huawei' },
                { id: 'ZTE' },
                { id: 'Ericsson' }
            ]

            function linkArc (d) {
                const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y)
                return ` M${d.source.x},${d.source.y}A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`
            }

            function drag (simulation) {
                function dragstarted (event, d) {
                    if (!event.active) simulation.alphaTarget(0.3).restart()
                    d.fx = d.x
                    d.fy = d.y
                }

                function dragged (event, d) {
                    d.fx = event.x
                    d.fy = event.y
                }

                function dragended (event, d) {
                    if (!event.active) simulation.alphaTarget(0)
                    d.fx = null
                    d.fy = null
                }

                return d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended)
            }

            const simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links).id(d => d.id))
                .force('charge', d3.forceManyBody().strength(-400))
                .force('x', d3.forceX())
                .force('y', d3.forceY())

            const svg = d3.select('#ontologyGraph')
                .attr('viewBox', [-width / 2, -height / 2, width, height])
                .style('font', '12px sans-serif')

            // Per-type markers, as they don't inherit styles.
            svg.append('defs').selectAll('marker')
                .data(types)
                .join('marker')
                .attr('id', d => `arrow-${d}`)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 15)
                .attr('refY', -0.5)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('fill', color)
                .attr('d', 'M0,-5L10,0L0,5')

            const link = svg.append('g')
                .attr('fill', 'none')
                .attr('stroke-width', 1.5)
                .selectAll('path')
                .data(links)
                .join('path')
                .attr('stroke', d => color(d.type))
                .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location)})`)

            const node = svg.append('g')
                .attr('fill', 'currentColor')
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round')
                .selectAll('g')
                .data(nodes)
                .join('g')
                .call(drag(simulation))

            node.append('circle')
                .attr('stroke', 'white')
                .attr('stroke-width', 1.5)
                .attr('r', 4)

            node.append('text')
                .attr('x', 8)
                .attr('y', '0.31em')
                .text(d => d.id)
                .clone(true).lower()
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .attr('stroke-width', 3)

            simulation.on('tick', () => {
                link.attr('d', linkArc)
                node.attr('transform', d => `translate(${d.x},${d.y})`)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.OntologyView {
  background: #F7F8F9;
  height: 100%;
  width: 100%;
}
</style>
