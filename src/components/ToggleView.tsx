import { useViewStore } from "../features/cluster/store/useViewStore";

export default function ToggleView() {
    const { clusterView, toggleView } = useViewStore();

    const is3D = clusterView === '3D'
  
    return (
        <div
            onClick={toggleView}
            className="w-18 h-10 bg-zinc-700 rounded-full relative flex items-center transition-colors duration-300 cursor-pointer select-none"
        >
            <div
                className={`w-8 h-8 bg-white rounded-full absolute top-1 transition-all duration-300 shadow ${is3D ? 'left-9' : 'left-1'}`}
            />
            <span className="absolute left-2.5 text-sm">2D</span>
            <span className="absolute right-2.5 text-sm">3D</span>
        </div>
    )
}