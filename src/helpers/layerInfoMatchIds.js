const layerInfoMatchIds = (layerInfo, oldId, newId) => {
    const newIdLayerInfo = layerInfo.map((layer) => {
        console.log(layer)
        layer[newId] = layer[oldId]
        delete layer[oldId]
        console.log(layer)
        return layer
    })
    return newIdLayerInfo
}

export default layerInfoMatchIds