const kbUtils = {
    isGraphDataFormat (rowList) {
        if (!rowList || rowList.length < 1) {
            return false
        }
        let firstItem = rowList[0]
        if (typeof firstItem !== 'object') {
            return false
        }
        let keyList = Object.keys(firstItem)
        for (let key of keyList) {
            let item = firstItem[key]
            if (typeof item !== 'object') {
                return false
            }
            if (kbUtils.isNode(item)) {
                return true
            } else if (kbUtils.isLink(item)) {
                return false
            }
        }
        return false
    },
    parseQueryDataToGraph (rowList) {
        // exist and not empty
        if (!rowList || rowList.length < 1) {
            return {
                nodeList: [],
                linkList: []
            }
        }
        // row type must be an object, so it can contain graph data
        if (typeof rowList[0] !== 'object') {
            return {
                nodeList: [],
                linkList: []
            }
        }
        // parse data
        const nodeMap = new Map()
        const linkMap = new Map()
        for (let row of rowList) {
            let keyList = Object.keys(row)
            for (let key of keyList) {
                let item = row[key]
                if (typeof item !== 'object') {
                    continue
                }
                if (kbUtils.isNode(item)) {
                    nodeMap.set(item._id, {
                        id: item._id,
                        data: item
                    })
                } else if (kbUtils.isLink(item)) {
                    linkMap.set(item._id, {
                        id: item._id,
                        source: item._from,
                        target: item._to,
                        value: 4,
                        curveMultiplier: 1,
                        data: item
                    })
                }
            }
        }
        return kbUtils.getGraphData(nodeMap, linkMap)
    },
    parseGraph (data) {
        const nodeMap = new Map()
        const linkMap = new Map()
        /** @namespace relation._x **/
        /** @namespace relation._y **/
        /** @namespace relation._z **/
        for (let node of data.nodes) {
            nodeMap.set(node._id, {
                id: node._id,
                x: Number(node._x) || 0,
                y: Number(node._y) || 0,
                z: Number(node._z) || 0,
                data: node
            })
        }
        /** @namespace relation._from **/
        /** @namespace relation._to **/
        for (let relation of data.relationships) {
            linkMap.set(relation._id, {
                id: relation._id,
                source: relation._from,
                target: relation._to,
                value: 4,
                curveMultiplier: 1,
                data: relation
            })
        }
        return kbUtils.getGraphData(nodeMap, linkMap)
    },
    getGraphData (nodeMap, linkMap) {
        linkMap.forEach(link => {
            let source = nodeMap.get(link.source)
            let target = nodeMap.get(link.target)
            if (source && target) {
                link.source = source
                link.target = target
            } else {
                linkMap.delete(link._id)
            }
        })
        const linkDuplicateMap = new Map()
        linkMap.forEach(link => {
            let duplicateId = link.source.id + '-->' + link.target.id
            let multiplier = 1
            if (linkDuplicateMap.has(duplicateId)) {
                multiplier = linkDuplicateMap.get(duplicateId)
                if (multiplier > 0) {
                    multiplier = -multiplier
                } else {
                    multiplier = -multiplier + 1
                }
            }
            linkDuplicateMap.set(duplicateId, multiplier)
            link.curveMultiplier = multiplier
        })
        let nodeList = Array.from(nodeMap, item => item[1])
        let linkList = Array.from(linkMap, item => item[1])
        return {
            nodeList,
            linkList
        }
    },
    isNode (item) {
        return item._id.startsWith('nodes')
    },
    isLink (item) {
        return item._id.startsWith('relationships')
    },
    /**
     * @param {string} item._hyperedge
     */
    isHyperedge (item) {
        return item._hyperedge
    },
    getNodeName (node) {
        if (!node) {
            return ''
        }
        if (kbUtils.isHyperedge(node)) {
            return node._id
        } else {
            return node._name
        }
    },
    appendGraphData (graphData, sourceData) {
        /** @namespace sourceData.in_relationships **/
        /** @namespace sourceData.out_relationships **/
        /** @namespace relation._from **/
        /** @namespace relation._to **/

        let inRelationList = sourceData.in_relationships
        let outRelationList = sourceData.out_relationships
        let nodeList = graphData.nodeList
        let linkList = graphData.linkList
        let linkMap = new Map()
        let nodeMap = new Map()
        linkList.forEach(link => {
            linkMap.set(link.id, link)
        })
        nodeList.forEach(node => {
            nodeMap.set(node.id, node)
        })
        for (let relation of inRelationList) {
            let rel = relation.rel
            if (!nodeMap.has(rel._from)) {
                let node = {
                    id: rel._from,
                    data: relation._from
                }
                nodeList.push(node)
                nodeMap.set(node.id, node)
            }
        }
        for (let relation of outRelationList) {
            let rel = relation.rel
            if (!nodeMap.has(rel._to)) {
                let node = {
                    id: rel._to,
                    data: relation._to
                }
                nodeList.push(node)
                nodeMap.set(node.id, node)
            }
        }

        let createLinkFn = relationList => {
            for (let relation of relationList) {
                let rel = relation.rel
                if (!linkMap.has(rel._id)) {
                    let link = {
                        id: rel._id,
                        source: nodeMap.get(rel._from),
                        target: nodeMap.get(rel._to),
                        value: 4,
                        curveMultiplier: 1,
                        data: rel
                    }
                    linkList.push(link)
                    linkMap.set(link.id, link)
                }
            }
        }
        createLinkFn(inRelationList)
        createLinkFn(outRelationList)

        return {
            nodeList,
            linkList
        }
    }
}

export default kbUtils
