import { useAppStore } from "../../store/useAppStore"

const Sidebar = () => {
    // get node id and nodes details
    const selectedNodeId = useAppStore((state) => state.selectedNodeId)
    const nodes = useAppStore((state) => state.nodes)

    const selectedNode = nodes.find((node) => node.id === selectedNodeId)

    if(!selectedNode) {
        return (
            <aside className="h-full w-90 flex flex-col items-center justify-end text-center px-6 py-10">
                No Node Selected. Click a node to see details.
            </aside>
        )
    }

    return (
        <aside className="h-screen w-90 flex flex-col items-center justify-end px-6 py-10">
            <h2>{selectedNode.label}</h2>
            <p>ID: {selectedNode.id}</p>
        </aside>
    )
}

export default Sidebar