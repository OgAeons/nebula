import { useViewStore } from "./store/useViewStore"
import Cluster2D from "./components/Cluster2D"
import Cluster3D from "./components/Cluster3D"
import ToggleView from "../../components/ToggleView"

const Cluster = () => {
    const { clusterView } = useViewStore();
    return (
        <div className="w-full h-full relative">
            <div className="absolute">
                <ToggleView />
            </div>

            {clusterView === '2D' ? <Cluster2D /> : <Cluster3D />}
        </div>
    )
  }
  
  export default Cluster