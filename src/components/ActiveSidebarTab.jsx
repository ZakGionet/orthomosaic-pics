import ActiveLayerTab from "./ActiveLayerTab"
import "../Sidebar.css"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function ActiveSidebarTab({activeLayers, updateActiveLayers, rearrangeActiveLayers, handleSetIsQueried }) {

    const activeLayersMap = activeLayers.map((activeLayer, i) => {
        console.log(activeLayer.name)
        return (
            <ActiveLayerTab 
                id={activeLayer.id}
                key={activeLayer.id}
                index={i}
                name={activeLayer.name}
                updateActiveLayers={updateActiveLayers}
                rearrangeActiveLayers={rearrangeActiveLayers}
                handleSetIsQueried={handleSetIsQueried}
            />
        )
    })

    activeLayersMap.reverse()
    
    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <div>
                    {activeLayersMap}
                </div>
            </DndProvider>
        </div>
    )
}