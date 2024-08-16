import LayerTab from "./LayerTab"
import "../Sidebar.css"

export default function LayerSidebarTab({
    layers, layersInfoOpened, toggleLayers, activeLayers, updateActiveLayers}) {

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
                        toggleLayers={toggleLayers}
                        active={active}
                        updateActiveLayers={updateActiveLayers}
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