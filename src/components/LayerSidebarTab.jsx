import LayerTab from "./LayerTab"
import "../Sidebar.css"

import { LayersContext, QueriedContext, ActiveLayersContext } from "../contexts/Contexts"
import { useContext } from "react"

export default function LayerSidebarTab({
        // layers, 
        layersInfoOpened,
        // toggleLayers,
        // activeLayers,
        // updateActiveLayers,
        // isQueried,
        // handleSetIsQueried
    }) {
    
    const layers = useContext(LayersContext)
    const { isQueried, handleSetIsQueried } = useContext(QueriedContext)
    const { activeLayers, updateActiveLayers, rearrangeActiveLayers, toggleLayers } = useContext(ActiveLayersContext)

    let layersMap
    if (layers) {
        layersMap = layers.map(layer => {
            const infoOpened = layersInfoOpened.includes(layer.id)
            const active = activeLayers.some(activeLayer => activeLayer.id === layer.id)
            return (
                <div
                    key={layer.id}
                >
                    <LayerTab 
                        id={layer.id}
                        name={layer.name}
                        info={layer.info}
                        infoOpened={infoOpened}
                        // toggleLayers={toggleLayers}
                        active={active}
                        // updateActiveLayers={updateActiveLayers}
                        // isQueried={isQueried}
                        // handleSetIsQueried={handleSetIsQueried}
                    />
                </div>
            )
        })
    } else {
        layersMap = <h1>Loading placeholder</h1>
    }
    return (
        <div>
            {layersMap}
        </div>
    )
}