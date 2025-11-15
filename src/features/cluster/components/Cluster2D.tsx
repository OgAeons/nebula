import { useRef, useEffect, useMemo } from "react" 
import sample from "../../../data/sample.json"
import { useForceLayout, type NodeData } from "../hooks/useForceLayout"
import { generateLinks, type ExtendedLinkData } from "../utils/generateLinks"
import { zoom } from "d3-zoom"
import { select } from "d3-selection"
import { useResizeObserver } from "../hooks/useResizeObserver"

const COLORS = {
    firstLetter: "#18ed6d",
    lastLetter: "#2b65d9",
    nodeFill: "#18ede6"
}

const Cluster2D = () => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const { width, height } = useResizeObserver(canvasRef)

    // Memoize nodes so they are NOT re-created on every render
    const nodes: NodeData[] = useMemo(() => {
        return (sample as any[]).map(n => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }))
    }, []) 

    // Memoize links, and only re-calculate if nodes array changes
    const links = useMemo(() => {
        return generateLinks(nodes)
    }, [nodes])

    const { nodes: simNodes, links: simLinks } = useForceLayout(nodes, links, width, height)

    useEffect(() => {
        if(!svgRef.current) return

        const svg = select(svgRef.current)

        ;(svg as any).call(
            zoom<SVGSVGElement, unknown>().on("zoom", (e) => {
                svg.select("g").attr("transform", e.transform)
            })
        )
    }, [])

    return (
        <div ref={canvasRef} className="w-full h-full overflow-hidden select-none">
            <svg ref={svgRef} className="w-full h-full">
                <g>
                    {simLinks.map((link, i) => (
                        <line 
                            key={i}
                            x1={(link.source as any).x}
                            y1={(link.source as any).y}
                            x2={(link.target as any).x}
                            y2={(link.target as any).y}
                            stroke={(link as ExtendedLinkData).type === 'firstLetter' ? COLORS.firstLetter : COLORS.lastLetter} 
                            strokeWidth={1}
                            opacity={0.6}
                        />
                    ))}

                    {simNodes.map((node) => (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                            <circle r={10} fill={COLORS.nodeFill} stroke="#999" strokeWidth={1} />
                            <text 
                                x={16} 
                                y={4} 
                                fontSize="12" 
                                fill="#eee"
                                className="select-none"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    )
}
  
export default Cluster2D