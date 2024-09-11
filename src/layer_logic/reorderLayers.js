const reorderLayers = (layersArray, activeLayers) => {
    for (const layer of layersArray) {
        if (layer.get('name') !== 'osm-layer') {
            const activeLayerIndex = activeLayers.findIndex(activeLayer => activeLayer.file_name === layer.get('name'))
            layer.setZIndex(activeLayerIndex + 1)
        }
    }
}

export default reorderLayers