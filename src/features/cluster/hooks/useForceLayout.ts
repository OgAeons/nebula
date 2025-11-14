import type { Simulation } from "d3-force"
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force"
import { useEffect, useRef, useState } from "react"

export interface NodeData {
    id: string;
    label: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export interface LinkData {
    source: string;
    target: string;
}

export function useForceLayout(nodes: NodeData[], links: LinkData[], width: number, height: number) {
    const [, setTick] = useState(0)
    const simRef = useRef<Simulation<NodeData, LinkData> | null>(null)

    useEffect(() => {
        if (!width || !height) return

        const sim = forceSimulation<NodeData>(nodes)
            .force(
                "link",
                forceLink<NodeData, LinkData>(links)
                    .id((d) => d.id)
                    .distance(90)       
                    .strength(0.7)
            )
            .force("charge", forceManyBody().strength(-50))
            .force("center", forceCenter(width / 2, height / 2))
            .on("tick", () => {
                setTick((t) => t + 1)
            })

        simRef.current = sim

        return () => {
            sim.stop()
        }
    }, [nodes, links, width, height])

    return { nodes, links }
}