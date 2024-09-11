import { GeoTIFF } from "ol/source"

const handleGeoTIFF = () => {
    return 
    // currently not supported
    try {
        const geoTIFFSource = new GeoTIFF({
            sources: [{
                url: `http://localhost:8000/api/geotiff/${activeLayersChange.file_name}`,
                // overviews needs to be in [], this isn't ez to find lol
                overviews: [`http://localhost:8000/api/geotiff/${activeLayersChange.file_name}.ovr`],
                // gotta figure out how to read the headers properly, for now they are added manually.
                nodata: -9999, min: 0, max: 217,
            }]
        })
        const checkSourceError = async (sourceObject) => {
            return sourceObject.getState() === 'error'
        }
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

export default handleGeoTIFF