import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';

import ScaleLine from 'ol/control/ScaleLine'

import Rotate from 'ol/control/Rotate.js'
import MousePosition from 'ol/control/MousePosition.js'


import 'ol/ol.css';

import TileLayer from 'ol/layer/Tile.js';

import { useEffect, useState, useRef, useContext } from "react"

import flyTo from '../zoom_animations/flyTo';
import reorderLayers from '../layer_logic/reorderLayers';
import handleTileBuild from '../layer_logic/handleTileBuild'
import handleGeoTIFF from '../layer_logic/handleGeoTIFF';
import handleAddLayerExtents from '../layer_logic/handleAddLayerExtents';
import handleLayerRemove from '../layer_logic/handleLayerRemove';
import handleGeoJSONLayer from '../layer_logic/handleGeoJSONLayer';

import { ActiveLayersContext, QueriedContext } from '../contexts/Contexts';
import buildLogicVariables from '../layer_logic/buildLogicVariables';

const MapComponent = () => {

    // Contexts
    const { activeLayers } = useContext(ActiveLayersContext)
    const { isQueried } = useContext(QueriedContext)

    const mapRef = useRef(null)
    const [mapState, setMapState] = useState(null)
    const [prevActiveLayers, setPrevActiveLayers] = useState(activeLayers)
    const [layerExtents, setLayerExtents] = useState(null)

    /* Creates Map instance after component is mounted */
    useEffect(() => {


        const osmLayer = new TileLayer({
            source: new OSM()
        })
        osmLayer.setProperties({"name": "osm-layer"})
        const mapInstance = new Map({
            target: mapRef.current,
            layers: [osmLayer],
            view: new View({
                center: [-8003970, 5666128],
                zoom: 10,
            })
        })

        /* Maintain a state containing the map */
        setMapState(mapInstance)

        /* Interactions */
        const rotate = new Rotate()
        mapInstance.addControl(rotate)
        
        const mousePosition = new MousePosition()
        mapInstance.addControl(mousePosition)

        const scaleLine = new ScaleLine()
        mapInstance.addControl(scaleLine)

        /* Point the map to null when component unmounts */
        return () => {
            mapInstance.setTarget(null)
        }

    }, [])

    // Handling zoom to layer
    useEffect(() => {
        if (isQueried.name === "" || !mapState || !layerExtents) {
            return
        }
        const extent = layerExtents.filter(layer => layer.name === isQueried.name)[0].extent
        flyTo(mapState.getView(), extent, () => {})
    }, [isQueried])

    // Handling layer add/remove/reorder
    useEffect(() => {
        /* Make sure map is properly mounted, not sure why we're doing this */
        if (!mapState || prevActiveLayers.length === 0 && activeLayers.length === 0) {
            return
        }

        /* REORDERING LAYERS */
        if (prevActiveLayers.length === activeLayers.length) {
            reorderLayers(mapState.getLayers().getArray(), activeLayers)
            return
        }

        const { removing, activeLayersChange } = buildLogicVariables(prevActiveLayers, activeLayers)

        if (mapState.getLayers().getArray()) {

            /* REMOVING LAYERS */
            if (removing === true && mapState.getLayers().getArray().length > 1) {        
                handleLayerRemove(mapState, activeLayersChange.file_name, setLayerExtents)
            }

            /* ADDING LAYERS */
            else {
                let extent 
                if (activeLayersChange.type === "geojson") {
                    extent = handleGeoJSONLayer(activeLayersChange, activeLayers.length, mapState)
                }
                else if (activeLayersChange.type === 'raster') {
                    extent = handleTileBuild(activeLayers.length, activeLayersChange.file_name, mapState)

                }
                else if (activeLayersChange.type === "geotiff") {
                    console.log(`Geotiff not currently supported`)
                    return 
                    handleGeoTIFF()
                }
                handleAddLayerExtents(activeLayersChange.file_name, extent, setLayerExtents)
            }
        }
        setPrevActiveLayers(activeLayers)
    }, [activeLayers])

    return (
        <div ref={mapRef} className='map'></div>
    )
}
export default MapComponent