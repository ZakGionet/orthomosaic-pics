import LayerTab from "./LayerTab"
import "../Sidebar.css"

export default function LayerSidebarTab({
    layers, layersInfoOpened, toggleLayers, activeLayers, updateActiveLayers}) {

    const layersMap = layers.map(layer => {
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
                    toggleLayers={toggleLayers}
                    active={active}
                    updateActiveLayers={updateActiveLayers}
                />
            </div>
        )
    })
    return (
        <div>
            {layersMap}
        </div>
    )
}