import ActiveLayerTab from "./ActiveLayerTab"
import "../Sidebar.css"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { ActiveLayersContext, QueriedContext } from "../contexts/Contexts"
import { useContext } from "react"

export default function ActiveSidebarTab({
    // activeLayers, 
    // updateActiveLayers, 
    // rearrangeActiveLayers, 
    // handleSetIsQueried 
}) {

    const { activeLayers, updateActiveLayers, rearrangeActiveLayers, toggleLayers } = useContext(ActiveLayersContext)
    const { isQueried, handleSetIsQueried } = useContext(QueriedContext)
    
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