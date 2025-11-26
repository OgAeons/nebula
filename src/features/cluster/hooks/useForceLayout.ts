import type { Simulation } from "d3-force"
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3-force"
import { useEffect, useRef } from "react"

export interface NodeData {
    id: string;
    label: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    fx: number | null
    fy: number | null
}

export interface LinkData {
    source: string;
    target: string;
}

export function useForceLayout(nodes: NodeData[], links: LinkData[], width: number, height: number) {
    const simRef = useRef<Simulation<NodeData, LinkData> | null>(null)

    useEffect(() => {
        if (!width || !height) return

        const sim = forceSimulation<NodeData>(nodes)
            .force(
                "link",
                forceLink<NodeData, LinkData>(links)
                    .id((d) => d.id)
                    .distance(200)       
                    .strength(0.7)
            )
            .force("charge", forceManyBody().strength(-30))
            .force("center", forceCenter(width / 2, height / 2))
            .force("collide", forceCollide().radius(40))

        simRef.current = sim

        return () => {
            sim.stop()
        }
    }, [nodes, links, width, height])

    return { nodes, links, simRef }
}