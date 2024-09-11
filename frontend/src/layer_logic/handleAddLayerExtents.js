const handleAddLayerExtents = async (fileName, extent, setLayerExtents) => {
    extent = await extent

    setLayerExtents((prevLayerExtents) => {
        if (prevLayerExtents) {
            let newLayerExtents = [...prevLayerExtents]
            newLayerExtents.push({name: fileName, extent: extent})
            return newLayerExtents
        }
        else {
            return [{name: fileName, extent: extent}]
        }
    })
}

export default handleAddLayerExtents