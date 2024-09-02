import ActiveLayerTab from "./ActiveLayerTab"
import "../Sidebar.css"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { ActiveLayersContext, QueriedContext } from "../contexts/Contexts"
import { useContext } from "react"

export default function ActiveSidebarTab({
    className
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