import Cluster from "./features/cluster"
import Sidebar from "./features/sidebar"

const App = () => {

    return (
        <div className="h-screen w-screen bg-nebula-darkpurple text-nebula-lightgrey flex overflow-hidden">
            <div className="bg-nebula-darkgrey">
                <Sidebar />
            </div>
            <div className="flex-1">
                <Cluster />
            </div>
        </div>
    )
}

export default App