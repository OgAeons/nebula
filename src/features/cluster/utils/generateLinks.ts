import type { NodeData, LinkData } from "../hooks/useForceLayout";

export function generateLinks(nodes: NodeData[]) {
    const links: LinkData[] = [];
  
    // First letter grouping
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const firstA = nodes[i].label[0].toLowerCase();
            const firstB = nodes[j].label[0].toLowerCase();
    
            if (firstA === firstB) {
                links.push({ source: nodes[i].id, target: nodes[j].id });
            }
        }
    }
  
    // Last letter grouping
    for (let i = 0; i < nodes.length; i++) {
        const aLast = nodes[i].label.slice(-1).toLowerCase();
    
        for (let j = i + 1; j < nodes.length; j++) {
            const bLast = nodes[j].label.slice(-1).toLowerCase();
    
            if (aLast === bLast) {
                links.push({ source: nodes[i].id, target: nodes[j].id });
            }
        }
    }
  
    return links;
}
  