import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import Link from 'ol/interaction/Link';
import {Style, Fill, Stroke} from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine'
import ZoomToExtent from 'ol/control/ZoomToExtent.js'
import Rotate from 'ol/control/Rotate.js'
import MousePosition from 'ol/control/MousePosition.js'
import Zoom from 'ol/control/Zoom.js'

import 'ol/ol.css';
import LayerGroup from 'ol/layer/Group';

import TileLayer from 'ol/layer/Tile.js';
import webGLTileLayer from 'ol/layer/WebGLTile.js'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoTIFF } from 'ol/source';
import XYZ from 'ol/source/XYZ';
import GeoJSON from "ol/format/GeoJSON.js";
import { easeIn, easeOut } from 'ol/easing.js'
import { useEffect, useState, useRef, useContext } from "react"

import fetchExtent from '../apis/fetchExtent';

import { ActiveLayersContext, QueriedContext } from '../contexts/Contexts';

const MapComponent = ({ 
        // activeLayers, 
        // isQueried 
    }) => {

    // Contexts
    const {activeLayers, updateActiveLayers, rearrangeActiveLayers, toggleLayers} = useContext(ActiveLayersContext)
    const { isQueried, handleSetIsQueried } = useContext(QueriedContext)

    console.log('re-rendering')
    console.log(activeLayers)
    const mapRef = useRef(null)
    const [mapState, setMapState] = useState(null)
    const [prevActiveLayers, setPrevActiveLayers] = useState(activeLayers)
    const setViewRef = useRef(null)
    const [layerExtents, setLayerExtents] = useState(null)

    /* Creates Map instance after component is mounted */
    useEffect(() => {


        const osmLayer = new TileLayer({
            source: new OSM()
        })
        osmLayer.setProperties({"name": "osm-layer"})   // Using this to target osm layer later

        /* 
            This is just a test for implementing GeoTIFF's!
            In Qgis, use warp(reproject) to transform the crs of the tif.
            export -> save as -> 
                options -> add TILED = YES
                pyramids -> add to desired precision (gotta figure this out properly)

            To add/remove geotiff layers, have to revisit how the current mechanism works, as the layers are different.
            This might be as easy as checking if the layer is of a certain type.
            We also have to add an edge-case for OSM.
        
        /* Create a map object */
        const mapInstance = new Map({
            target: mapRef.current,
            layers: [osmLayer],
            view: new View({
                center: [-8019943, 5637190],
                zoom: 22,
            })
        })
        console.log(`mapInstance.projection: ${mapInstance.getView().getProjection().getCode()}`)
        
        /* Maintain a state containing the map */
        setMapState(mapInstance)

        /* Interactions */
        // mapInstance.addInteraction(new Link())

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

    // Handling setLayerExtents
    const handleSetLayerExtents = (layerName) => {

    }

    // Helper function to export view functions
    setViewRef.current = (extent) => {
        if (mapState) {
            mapState.setView(new View({
                extent: extent
            }))
        }
    }


    // Helper functions for handling tile layers layers
    
    const buildTileLayer = (extentMeters, activeLayersChange) => {
        const layerGroup = new LayerGroup({
            name: activeLayersChange.file_name,
            layers: [
                new TileLayer({
                    name: activeLayersChange.file_name,
                    extent: extentMeters,
                    source: new XYZ({
                        minZoom: 0,
                        maxZoom: 21,
                        url: `http://localhost:8000/api/raster/${activeLayersChange.file_name}/{z}/{x}/{-y}.png`,
                        tileSize: [256, 256]
                    })
                })
            ]
        })
        console.log('layer group debugging:')
        layerGroup.setVisible(true)
        layerGroup.setZIndex(activeLayers.length)
        mapState.addLayer(layerGroup)
        
    }
    const handleTileBuild = async (activeLayersChange) => {
        const extentMeters = await fetchExtent(activeLayersChange.file_name)
        console.log('running handleTileBuild')
        console.log(extentMeters)
        buildTileLayer(extentMeters, activeLayersChange)
        return extentMeters
    }
    // Handles adding geojsons
    const handleGeoJSONLayer = async(activeLayersChange) => {
        console.log('handling geojson fetch')
        console.log(activeLayersChange)
        let parsedName = activeLayersChange.file_name.toLowerCase()
        parsedName = parsedName.replaceAll(' ', '_')
        parsedName = parsedName.replaceAll('-', '_')
        const fileResponse = await fetch(`http://localhost:8000/api/geojson/${parsedName}`);
        console.log(fileResponse)
        const geoJson = await fileResponse.json();
        console.log(geoJson)
        console.log(geoJson['json_build_object'])

        const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(geoJson['json_build_object'])
        })
        // handle adding extent to state
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            name: activeLayersChange.file_name,
            style: new Style({
                fill: new Fill({
                    color: activeLayersChange.fill
                }),
                stroke: new Stroke({
                    color: activeLayersChange.stroke
                })
            }),
        })
        vectorLayer.setZIndex(activeLayers.length)
        mapState.addLayer(vectorLayer)
        return vectorSource.getExtent()
    }
    useEffect(() => {
        console.log('Starting zoom query')
        console.log(`queried layer name: ${isQueried.name}`)
        console.log('current extents:')
        console.log(layerExtents)

        // Animation function
        // https://openlayers.org/en/latest/examples/animation.html
        if (isQueried.name === "") {
            return
        }
        if (!mapState) {
            return
        }
        if (!layerExtents) {
            return
        }
        
        function flyTo(view, extent, done) {
            const getCenterZoomFromExtent = (extent) => {
                const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
                const resolution = mapState.getView().getResolutionForExtent(extent)
                const zoom = mapState.getView().getZoomForResolution(resolution)
                return {center: center, zoom: zoom}
            }
            const { center, zoom } = getCenterZoomFromExtent(extent)
            const duration = 2000;
            let parts = 2;
            let called = false;
            function callback(complete) {
                --parts;
                if (called) {
                    return;
                }
                if (parts === 0 || !complete) {
                    called = true;
                    done(complete);
                }
            }
            view.animate({
                center: center,
                duration: duration,
            }, callback);
            view.animate({
                zoom: zoom - 1,
                duration: duration / 2,
            }, {
                zoom: zoom,
                duration: duration / 2,
            }, callback);
        }
        const extent = layerExtents.filter(layer => layer.name === isQueried.name)[0].extent
        flyTo(mapState.getView(), extent, () => {})
    }, [isQueried])

    useEffect(() => {
        /* Make sure map is properly mounted, not sure why we're doing this */
        if (!mapState) {
            return
        }
        /* Makes sure this isn't executed without layers. */
        if (prevActiveLayers.length === 0 && activeLayers.length === 0) {
            console.log('no active layers or layer changes (map initialized)')
            return
        }
        /* Layer re-ordering, currently goes through ALL active layers */
        if (prevActiveLayers.length === activeLayers.length) {
            console.log('no add/remove')
            
            const mapLayers = [...mapState.getLayers().getArray()]
            const osmLayer = mapLayers.shift()      // removing the osmlayer from the array
            for (const layer of mapLayers) {
                const activeLayerIndex = activeLayers.findIndex(activeLayer => activeLayer.file_name === layer.get('name'))
                layer.setZIndex(activeLayerIndex + 1)

            }
            mapState.setLayers([osmLayer, ...mapLayers])    // osmlayer gets readded

            /* Was */
            // async function ReorderLayers(activeLayers, mapState) {
            //     for (const layer of activeLayers) {
            //         if (layer.type === "geojson") {
            //             try {
            //                 const fileResponse = await fetch(`./${layer.url}`)
            //                 console.log(fileResponse)
            //                 const geoJson = await fileResponse.json();
        
            //                 const vectorSource = new VectorSource({
            //                     features: new GeoJSON().readFeatures(geoJson)
            //                 })
            //                 const vectorLayer = new VectorLayer({
            //                     source: vectorSource,
            //                     name: layer.name,
            //                     style: new Style({
            //                         fill: new Fill({
            //                             color: layer.fill
            //                         }),
            //                         stroke: new Stroke({
            //                             color: layer.stroke
            //                         })
            //                     }),
            //                 })
            //                 mapState.addLayer(vectorLayer)
            //             } catch (error) {
            //                 console.error(`Error loading layer ${layer.name}`, error)
            //             } 
    
            //         }
            //         else if (layer.type === "geotiff") {
            //             const geoTIFFSource = new GeoTIFF({
            //                 sources: [{
            //                     url: layer.url,
            //                     // overviews needs to be in [], this isn't ez to find lol
            //                     overviews: [`./${layer.url}.ovr`],
            //                     // gotta figure out how to read the headers properly, for now they are added manually.
            //                     nodata: -9999, min: 0, max: 217,
            //                 }]
            //             })
            //             const geoTIFFLayer = new webGLTileLayer({
            //                 source: geoTIFFSource,
            //                 name: layer.name,
            //             })
            //             geoTIFFLayer.setVisible(true)    
            //             mapState.addLayer(geoTIFFLayer)
            //         }
                    
            //     }
            // }
            // ReorderLayers(activeLayers, mapState)

            return
        }

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
                console.log('removing layer...')
                let layerArray = mapState.getLayers().getArray()
                layerArray.forEach(layer => {
                    // This condition is to ignore the osm layer
                    if (layer.get('name') != 'osm-layer') {
                        console.log(`layer ${layer.get('name')}:`)
                        console.log(layer)
                        if (layer.get('name') === activeLayersChange.file_name) {
                            console.log(`Found layer '${layer.get('name')}' to remove.`)
                            mapState.removeLayer(layer)
                        }
                    }                
                })
                setLayerExtents(prevLayerExtents => {
                    console.log(`Removing layer extent  ${activeLayersChange.file_name}`)
                    let newLayerExtents = []
                    newLayerExtents = prevLayerExtents.filter(layer => layer.name !== activeLayersChange.file_name)
                    console.log(`new extents array:`)
                    console.log(newLayerExtents)
                    return newLayerExtents
                    
                })

            }
            else {
                let extent 
                console.log('adding layer...')
                if (activeLayersChange.type === "geojson") {
                    console.log('adding geojson')
                    console.log(activeLayersChange.file_name)
                    extent = handleGeoJSONLayer(activeLayersChange)
                }
                else if (activeLayersChange.type === "geotiff") {
                    const geoTIFFSource = new GeoTIFF({
                        sources: [{
                            url: `./${activeLayersChange.url}`,
                            // overviews needs to be in [], this isn't ez to find lol
                            overviews: [`./${activeLayersChange.url}.ovr`],
                            // gotta figure out how to read the headers properly, for now they are added manually.
                            nodata: -9999, min: 0, max: 217,
                        }]
                    })
                    const geoTIFFLayer = new webGLTileLayer({
                        source: geoTIFFSource,
                        name: activeLayersChange.file_name,
                    })
                    geoTIFFLayer.setVisible(true)    
                    geoTIFFLayer.setZIndex(activeLayers.length)
                    mapState.addLayer(geoTIFFLayer)
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
        setPrevActiveLayers(activeLayers)

        console.log(mapState.getLayers().getArray())
    }, [activeLayers])

    return (
        <div ref={mapRef} className='map'></div>
    )
}

export default MapComponent