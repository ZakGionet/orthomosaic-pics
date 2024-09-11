import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import VectorLayer from "ol/layer/Vector"

import { Style, Fill, Stroke } from "ol/style"


const handleGeoJSONLayer = async (activeLayersChange, layersCount, mapState) => {

    const fileName = activeLayersChange.file_name
    const fill = activeLayersChange.fill
    const stroke = activeLayersChange.stroke

    let parsedName = fileName.toLowerCase()
    parsedName = parsedName.replaceAll(' ', '_')
    parsedName = parsedName.replaceAll('-', '_')

    const fileResponse = await fetch(`http://localhost:8000/api/geojson/${parsedName}`);
    const geoJson = await fileResponse.json();

    const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geoJson['json_build_object'])
    })
    // handle adding extent to state
    const vectorLayer = new VectorLayer({
        source: vectorSource,
        name: fileName,
        style: new Style({
            fill: new Fill({
                color: fill
            }),
            stroke: new Stroke({
                color: stroke
            })
        }),
    })
    vectorLayer.setZIndex(layersCount)
    mapState.addLayer(vectorLayer)
    return vectorSource.getExtent()
}

export default handleGeoJSONLayer