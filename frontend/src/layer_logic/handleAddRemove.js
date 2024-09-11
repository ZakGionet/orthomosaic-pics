import handleLayerRemove from "./handleLayerRemove"

const handleAddRemove = (activeLayers, prevActiveLayers, setLayerExtents) => {
    /* Layer added or removed */
    let longest = []
    let shortest = []
    let removing = false
    
    if (prevActiveLayers.length > activeLayers.length) {
        longest = [...prevActiveLayers]
        shortest = [...activeLayers]
        removing = true
    }
    else {
        longest = [...activeLayers]
        shortest = [...prevActiveLayers]
        removing = false
    }
    
    /* Is assigned the element which is in one layer and not the other */
    let activeLayersChange = longest.filter(longestLayer => {
        return !shortest.some(shortestLayer => shortestLayer.file_name === longestLayer.file_name);
    })[0];

    console.log(`Filtered activeLayers: ${activeLayersChange.file_name}`)
    console.log(activeLayersChange)
    /* Not sure why we're checking if the layers array exists */
    if (mapState.getLayers().getArray()) {
        // unsure if we need to check it this way
        if (removing === true && mapState.getLayers().getArray().length > 1) {        
            handleLayerRemove(mapState.getLayers().getArray(), activeLayersChange.file_name)
        }
        else {
            let extent 
            if (activeLayersChange.type === "geojson") {
                extent = handleGeoJSONLayer(activeLayersChange)
            }
            else if (activeLayersChange.type === "geotiff") {
                try {
                    const geoTIFFSource = new GeoTIFF({
                        sources: [{
                            url: `./${activeLayersChange.url}`,
                            // overviews needs to be in [], this isn't ez to find lol
                            overviews: [`./${activeLayersChange.url}.ovr`],
                            // gotta figure out how to read the headers properly, for now they are added manually.
                            nodata: -9999, min: 0, max: 217,
                        }]
                    })

                    console.log('geotiff state:')
                    console.log(geoTIFFSource.getState())
                    if (checkSourceError(geoTIFFSource)) {
                        console.log(`layer ${activeLayersChange.file_name} source error.`)
                    }
                    else {
                        const geoTIFFLayer = new webGLTileLayer({
                            source: geoTIFFSource,
                            name: activeLayersChange.file_name,
                        })
                        geoTIFFLayer.setVisible(true)    
                        geoTIFFLayer.setZIndex(activeLayers.length)
                        mapState.addLayer(geoTIFFLayer)
                    }
                } catch (error) {
                    console.error(error)
                }
            }
            else if (activeLayersChange.type === 'raster') {
                extent = handleTileBuild(activeLayersChange)
                console.log('success running buildTileLayer')
    
            }
            const handleAddLayerExtents = async (layerName, extent) => {
                extent = await extent
                console.log('handling AddLayerExtent')
                console.log(extent)
                setLayerExtents((prevLayerExtents) => {
                    if (prevLayerExtents) {
                        let newLayerExtents = [...prevLayerExtents]
                        newLayerExtents.push({name: layerName, extent: extent})
                        console.log('pushed new extent')
                        console.log(newLayerExtents)
                        return newLayerExtents
                    }
                    else {
                        return [{name: layerName, extent: extent}]
                    }
                })
            }
            handleAddLayerExtents(activeLayersChange.file_name, extent)
            console.log('layerExtents:')
            console.log(layerExtents)
            
        }
    }
}