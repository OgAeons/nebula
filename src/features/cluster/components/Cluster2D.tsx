import { useRef, useEffect } from "react"
import sample from "../../../data/sample.json"
import { useForceLayout, type NodeData, type LinkData } from "../hooks/useForceLayout"
import { generateLinks } from "../utils/generateLinks"
import { zoom } from "d3-zoom"
import { select } from "d3-selection"
import { useResizeObserver } from "../hooks/useResizeObserver"

const Cluster2D = () => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const { width, height } = useResizeObserver(canvasRef)

    const nodes: NodeData[] = sample as any
    const links: LinkData[] = generateLinks(nodes)

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
                            stroke="#"
                            strokeWidth={1}
                            opacity={0.6}
                        />
                    ))}

                    {simNodes.map((node) => (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                            <circle r={10} fill="#222" stroke="#999" strokeWidth={1} />
                            <text x={16} y={4} fontSize="12" fill="#fff" className="select-none">
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