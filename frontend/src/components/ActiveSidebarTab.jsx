import ActiveLayerTab from "./ActiveLayerTab"
import "../Sidebar.css"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { ActiveLayersContext } from "../contexts/Contexts"
import { useContext } from "react"

export default function ActiveSidebarTab({
    className
}) {

    const { activeLayers } = useContext(ActiveLayersContext)

    const activeLayersMap = activeLayers.map((activeLayer, i) => {
        return (
            <ActiveLayerTab 
                id={activeLayer.id}
                key={activeLayer.id}
                index={i}
                layerName={activeLayer.layer_name}
                fileName={activeLayer.file_name}
                info={activeLayer.info}
            />
        )
    })

    activeLayersMap.reverse()
    
    return (
        <div className={className}>
            <DndProvider backend={HTML5Backend}>
                {activeLayersMap}
            </DndProvider>
        </div>
    )
}