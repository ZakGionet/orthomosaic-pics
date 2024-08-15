import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import webGLTileLayer from 'ol/layer/WebGLTile.js'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoTIFF } from 'ol/source';

import GeoJSON from "ol/format/GeoJSON.js";
import View from 'ol/View.js';
import { useEffect, useState, useRef } from "react"
import 'ol/ol.css';
import {fromLonLat} from 'ol/proj'
import Link from 'ol/interaction/Link';
import {Style, Fill, Stroke} from 'ol/style';
import { get as getProjection, getUserProjection } from 'ol/proj'
import proj4 from "proj4"
import {register} from 'ol/proj/proj4.js';
import Zoom from 'ol/control/Zoom.js'
import ScaleLine from 'ol/control/ScaleLine'
import ZoomToExtent from 'ol/control/ZoomToExtent.js'

export default function MapComponent({ activeLayers }) {

    console.log('re-rendering')
    console.log(activeLayers)
    const mapRef = useRef(null)
    const [mapState, setMapState] = useState(null)
    const [prevActiveLayers, setPrevActiveLayers] = useState(activeLayers)


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
                center: [438189.3, 5965517.69],
                zoom: 10,
            })
        })
        console.log(`mapInstance.projection: ${mapInstance.getView().getProjection().getCode()}`)
        
        /* Maintain a state containing the map */
        setMapState(mapInstance)

        /* Interactions */
        mapInstance.addInteraction(new Link())

        const scaleLine = new ScaleLine()
        mapInstance.addControl(scaleLine)

        const zoomToExtent = new ZoomToExtent({
            label: "no work:("
        })
        mapInstance.addControl(zoomToExtent)

        /* Point the map to null when component unmounts */
        return () => {
            mapInstance.setTarget(null)
        }

    }, [])

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
                const activeLayerIndex = activeLayers.findIndex(activeLayer => activeLayer.name === layer.get('name'))
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
            return !shortest.some(shortestLayer => shortestLayer.name === longestLayer.name);
        })[0];

        console.log(`Filtered activeLayers: ${activeLayersChange.name}`)
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
                        console.log(layer.get('name'))
                        if (layer.get('name') === activeLayersChange.name) {
                            console.log('found a match!')
                            mapState.removeLayer(layer)
                        }
                    }                
                })
            }
            else {
                console.log('adding layer...')
                if (activeLayersChange.type === "geojson") {
                    const fetchGeojsonLayer = async() => {
                        const fileResponse = await fetch(`./${activeLayersChange.url}`);
                        console.log(fileResponse)
                        const geoJson = await fileResponse.json();

                        const vectorSource = new VectorSource({
                            features: new GeoJSON().readFeatures(geoJson)
                        })
                        const vectorLayer = new VectorLayer({
                            source: vectorSource,
                            name: activeLayersChange.name,
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
                    }
                    fetchGeojsonLayer()
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
                        name: activeLayersChange.name,
                    })
                    geoTIFFLayer.setVisible(true)    
                    geoTIFFLayer.setZIndex(activeLayers.length)
                    mapState.addLayer(geoTIFFLayer)
                }
                
            }
        }
        setPrevActiveLayers(activeLayers)

        console.log(mapState.getLayers().getArray())
    }, [activeLayers])

    return (
        <div ref={mapRef} className='map'></div>
    )
}
