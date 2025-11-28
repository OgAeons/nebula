import { useRef, useEffect, useMemo } from "react"
import { useResizeObserver } from "../hooks/useResizeObserver" 
import { useForceLayout, type NodeData } from "../hooks/useForceLayout"
import { dataProcessor } from "../utils/dataProcessor"
import { useAppStore } from "../../../store/useAppStore"
import { zoom } from "d3-zoom"
import { select } from "d3-selection"
import { drag } from "d3-drag"
import { scaleOrdinal } from "d3-scale"
import { schemeCategory10 } from "d3"

const Cluster2D = () => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const gRef = useRef<SVGGElement>(null) 

    const { width, height } = useResizeObserver(canvasRef)

    // get state
    const rawNodes = useAppStore((state) => state.rawNodes)
    const selectedLabel = useAppStore((state) => state.selectedLabel)
    const selectedFeatures = useAppStore((state) => state.selectedFeatures)
    const selectNode = useAppStore((state) => state.selectNode)
    const clearSelection = useAppStore((state) => state.clearSelection)
    const kNeighbours = useAppStore((state) => state.kNeighbours)

    // memoize data 
    const {nodes, links} = useMemo(() => {
        if(selectedFeatures.length === 0 || rawNodes.length === 0) {
            return {nodes: [], links: []}
        }

        // normalization and k-NN link generation
        const {processedNodes, links} = dataProcessor(rawNodes, selectedFeatures, kNeighbours)

        // d3 node properties
        const d3Nodes: NodeData[] = processedNodes.map(n => ({ 
            ...n, 
            x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null 
        }))

        return {nodes: d3Nodes, links: links}
    }, [rawNodes, selectedFeatures, kNeighbours])

    // dynamic color
    const uniqueLabels = useMemo(() => {
        if (!selectedLabel) return [];
        return [...new Set(rawNodes.map(n => n[selectedLabel]))];
    }, [rawNodes, selectedLabel]);

    const colorScale = useMemo(() => {
        return scaleOrdinal(schemeCategory10).domain(uniqueLabels);
    }, [uniqueLabels]);

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
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.6)
        
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
                        .attr("fill", (d: any) => colorScale(d[selectedLabel!]) as string)
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1)

                    // Add text
                    group.append("text")
                        .text((d: any) => d[selectedLabel!])
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
    }, [nodes, links, width, height, simRef, selectNode, clearSelection, colorScale, selectedLabel]);   

    // UI state for empty data
    if (rawNodes.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
                <p>Please upload a CSV file to begin.</p>
            </div>
        )
    }

    return (
        <div ref={canvasRef} className="w-full h-full overflow-hidden select-none relative">
            {rawNodes.length > 0 && selectedFeatures.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10 text-white bg-black/30 pointer-events-none">
                    <p className="text-xl p-4 bg-gray-800/80 rounded-lg">
                        Please select features to build the graph.
                    </p>
                </div>
            )}
            <svg ref={svgRef} className="w-full h-full">
                <g ref={gRef} />
            </svg>
        </div>
    )
}
  
export default Cluster2D