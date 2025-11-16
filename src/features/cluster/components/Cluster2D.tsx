import { useRef, useEffect, useMemo } from "react"
import { useResizeObserver } from "../hooks/useResizeObserver" 
import { useForceLayout, type NodeData } from "../hooks/useForceLayout"
import { generateLinks, type ExtendedLinkData } from "../utils/generateLinks"
import { useAppStore } from "../../../store/useAppStore"
import { zoom } from "d3-zoom"
import { select } from "d3-selection"
import { drag } from "d3-drag"

const COLORS = {
    firstLetter: "#18ed6d",
    lastLetter: "#2b65d9",
    nodeFill: "#76c2c1"
}

const Cluster2D = () => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const gRef = useRef<SVGGElement>(null) 

    const { width, height } = useResizeObserver(canvasRef)

    // get state
    const rawNodes = useAppStore((state) => state.nodes)
    const selectNode = useAppStore((state) => state.selectNode)
    const clearSelection = useAppStore((state) => state.clearSelection)

    // Memoize data 
    const nodes: NodeData[] = useMemo(() => {
        return (rawNodes as any[]).map(n => ({ ...n, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null }))
    }, [rawNodes]) 
    const links = useMemo(() => {
        return generateLinks(nodes)
    }, [nodes])

    // Get simulation from the hook
    const { simRef } = useForceLayout(nodes, links, width, height)

    useEffect(() => {
        if (!svgRef.current || !gRef.current || !simRef.current || !width || !height) return
    
        const svg = select(svgRef.current)
        const g = select(gRef.current)
        const sim = simRef.current
    
        // remove old g children to prevent duplicates
        g.selectAll("*").remove()

        //clear node selection
        svg.on("click", () => {
            clearSelection()
        })
    
        // ZOOM
        svg.call(
            zoom<SVGSVGElement, unknown>().on("zoom", (e) => { 
                g.attr("transform", e.transform)
            })
        )
    
        // DRAG HANDLER 
        const dragHandler = drag<SVGGElement, NodeData>()
            .on("start", (event, d) => {
                if (!event.active) sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) sim.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    
        // selections
        const linkSelection = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links, (d: any) => `${d.source.id}-${d.target.id}`)
            .join("line")
            .attr("stroke", d => (d as ExtendedLinkData).type === "firstLetter" ? COLORS.firstLetter : COLORS.lastLetter)
            .attr("stroke-width", 1)
            .attr("opacity", 1)
        
        const nodeSelection = g.append("g")
            .attr("class", "nodes")
            .selectAll("g.node-group")
            .data(nodes, (d: any) => d.id)
            .join(
                (enter) => {
                    // Create the group
                    const group = enter.append("g").attr("class", "node-group");

                    // Add circle
                    group.append("circle")
                        .attr("r", 10)
                        .attr("fill", COLORS.nodeFill)
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1)

                    // Add text
                    group.append("text")
                        .text(d => d.label)
                        .attr("x", 16)
                        .attr("y", 4)
                        .attr("fill", "#eee")

                    // Apply drag handler
                    group.call(dragHandler);

                    // select node
                    group.on("click",  (event, d) => {
                        event.stopPropagation();
                        selectNode(d.id)
                    })
                    
                    return group;
                }
            )
    
        sim.on("tick", () => {
            linkSelection
                .attr("x1", d => (d.source as unknown as NodeData).x) 
                .attr("y1", d => (d.source as unknown as NodeData).y)
                .attr("x2", d => (d.target as unknown as NodeData).x)
                .attr("y2", d => (d.target as unknown as NodeData).y)
    
            nodeSelection
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
        })

        return () => {
            sim.on("tick", null);
        }
    }, [nodes, links, width, height, simRef, selectNode, clearSelection]);   

    return (
        <div ref={canvasRef} className="w-full h-full overflow-hidden select-none">
            <svg ref={svgRef} className="w-full h-full">
                <g ref={gRef} />
            </svg>
        </div>
    )
}
  
export default Cluster2D