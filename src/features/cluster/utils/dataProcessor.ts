import { type NodeData } from "../hooks/useForceLayout"

// original data with string keys
interface RawNode extends NodeData {
    [key: string]: any
}

interface Link {
    source: string
    target: string
}

// min-max normalization 
function minMaxNormalization(values: number[]): number[] {
    if(values.length === 0) return []

    const min = Math.min(...values)
    const max = Math.max(...values)

    // if all values are same
    if(max - min === 0) {
        return values.map(() => 0.5)
    }

    return values.map( v => (v-min) / (max-min) )
}

// euclidean distance
function getDistance(NodeA: RawNode, NodeB: RawNode, features: string[]): number {
    let sumOfSquares = 0

    for(const feature of features) {
        const diff = (NodeA[`norm_${feature}`] || 0) - (NodeB[`norm_${feature}`] || 0)
        sumOfSquares += diff * diff
    }

    return Math.sqrt(sumOfSquares)
}

// generate links using knn
function generateLinksKNN(nodes: RawNode[], features: string[], k:number = 5): Link[] {
    // map to maintain unique links 
    const linksMap = new Map<string, Link>()

    for(let i=0; i<nodes.length; i++) {
        const nodeA = nodes[i]
        const distances: {nodeB: RawNode, distance: number}[] = []

        // calc distance to all nodes
        for(let j=0; j<nodes.length; j++) {
            if(i === j) continue

            const nodeB = nodes[j]
            const distance = getDistance(nodeA, nodeB, features)
            distances.push({ nodeB, distance})
        }

        // sort by distance and slice k neighbours
        distances.sort((a,b) => a.distance - b.distance)
        const nearestNeighbours = distances.slice(0, k)

        // generate Links
        nearestNeighbours.forEach(neighbour => {
            const sourceId = nodeA.id < neighbour.nodeB.id ? nodeA.id : neighbour.nodeB.id
            const targetId = nodeA.id < neighbour.nodeB.id ? neighbour.nodeB.id : nodeA.id
            const key = `${sourceId}-${targetId}`

            if(!linksMap.has(key)) {
                linksMap.set(key, { source: sourceId, target: targetId})
            }
        })
    }

    return Array.from(linksMap.values())
}


export function dataProcessor(rawNodes: RawNode[], features: string[], k: number = 5): {processedNodes: RawNode[], links: Link[]} {
    // Normalzation
    let normalizedNodes = rawNodes.map(n => ({...n}))     // deep copy

    for(const feature of features) {
        const featureValues = rawNodes.map(n => n[feature] as number)

        const normalizedValues = minMaxNormalization(featureValues)

        normalizedNodes.forEach((node, index) => {
            node[`norm_${feature}`] = normalizedValues[index]
        })
    }

    // Generate Links
    const links = generateLinksKNN(normalizedNodes, features, k) 

    return {
        processedNodes: normalizedNodes,
        links: links
    }
}