export function distance (p1, p2) {
    let dx = p2.x - p1.x
    let dy = p2.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
}

export function getNodeColor (dataBus, showColor, activeNodeId, d) {
    const defaultNodeColor = '#E6F4FF'
    if (d.id === activeNodeId) {
        return dataBus.style.activeNode.backgroundColor
    }
    if (showColor) {
        if (d.data._labels.length < 1) {
            return defaultNodeColor
        }
        let mapLabelColor = dataBus.style.mapLabelColor
        let firstLabel = d.data._labels[0]
        return mapLabelColor[firstLabel] || defaultNodeColor
    }
    return defaultNodeColor
}
