import LayerTab from "./LayerTab"
import "../Sidebar.css"

import { LayersContext, QueriedContext, ActiveLayersContext } from "../contexts/Contexts"
import { useContext } from "react"

export default function LayerSidebarTab({
        className,
        layersInfoOpened,
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
                    <LayerTab 
                        id={layer.id}
                        key={layer.id}
                        layerName={layer.layer_name}
                        fileName={layer.file_name}
                        info={layer.info}
                        infoOpened={infoOpened}
                        active={active}
                    />
            )
        })
    } else {
        layersMap = <span className="sidebar--loading">Loading placeholders...</span>
    }
    return (
        <div className={className}>
            {layersMap}
        </div>
    )
}