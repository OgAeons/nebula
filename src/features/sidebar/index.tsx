import { useAppStore } from '../../store/useAppStore'
import { FileUpload } from './components/FileUpload'
import { DataControls } from './components/DataControls'

// temp
const NodeDetails = ({ nodeId }: { nodeId: string }) => {
    const node = useAppStore((state) => 
        state.rawNodes.find(n => n.id === nodeId)
    )
    if (!node) return null
    
    return (
        <div className="text-sm">
        <h3 className="font-bold text-lg mb-2">{node.label || node.id}</h3>
        <pre className="p-2 bg-gray-900 rounded text-xs overflow-auto">
            {JSON.stringify(node, null, 2)}
        </pre>
        </div>
    )
}

export const Sidebar = () => {
    const selectedNodeId = useAppStore((state) => state.selectedNodeId)

    return (
        <aside className="absolute top-4 left-4 z-10 p-4 bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm text-white w-80 max-h-[calc(100vh-2rem)] overflow-y-auto">
            {/* File Upload */}
            <FileUpload />
            
            {/* Select label and faetures */}
            <DataControls />

            {/* 3. Node Info */}
            {selectedNodeId && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                <NodeDetails nodeId={selectedNodeId} />
                </div>
            )}
        </aside>
    )
}

export default Sidebar