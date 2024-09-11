const handleLayerRemove = (mapState, fileName, setLayerExtents) => {
    for (const layer of mapState.getLayers().getArray()) {
        if (layer.get('name') === fileName) {
            mapState.removeLayer(layer)
            break
        }           
    }
    setLayerExtents(prevLayerExtents => {
        let newLayerExtents = []
        newLayerExtents = prevLayerExtents.filter(layer => layer.name !== fileName)
        return newLayerExtents                  
    })
    return 0
}

export default handleLayerRemove