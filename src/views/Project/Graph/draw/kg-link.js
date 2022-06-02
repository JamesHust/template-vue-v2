function drawGraphLink (dataBus, svg) {
    const {
        linkList
    } = dataBus
    const {
        relationCurveHeight,
        nodeStartX,
        nodeStartY
    } = dataBus.style

    let gListList = svg.select('g.g-container-link')
    if (gListList.empty()) {
        gListList = svg.append('g')
            .attr('class', 'g-container-link')
    }

    let gLinkWrap = gListList.selectAll('g.g-wrap-link').data(linkList, d => d.id)

    gLinkWrap.exit().remove()

    let gLinkWrapEnter = gLinkWrap.enter()
        .append('g')
        .attr('class', 'g-wrap-link')
        .attr('transform', `translate(${nodeStartX}, ${nodeStartY})`)

    gLinkWrapEnter.append('path')
        .attr('class', 'link')
        .attr('marker-end', 'url(#arrow)')
        .on('click', dataBus.event.onLinkClick)

    gLinkWrapEnter.append('rect')
        .attr('x', 0)
        .attr('y', d => d.curveMultiplier * relationCurveHeight - 7)
        .attr('width', 10)
        .attr('height', 15)

    gLinkWrapEnter.append('text')
        .attr('id', d => 'link-text-' + d.id)
        .attr('class', d => 'link-text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('y', d => d.curveMultiplier * relationCurveHeight)
        .text(d => d.data._type)
        .on('click', dataBus.event.onLinkClick)

    let gLinkWrapAll = gLinkWrapEnter.merge(gLinkWrap)
    gLinkWrapAll.selectAll('path.link')
        .style('stroke', d => d.id === dataBus.style.activeLink.id ? dataBus.style.activeLink.color : null)
    gLinkWrapAll.selectAll('text.link-text')
        .style('fill', d => d.id === dataBus.style.activeLink.id ? dataBus.style.activeLink.color : null)

    return gLinkWrapAll
}

export default drawGraphLink
