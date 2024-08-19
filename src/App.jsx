import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { useEffect, useState } from 'react';
import MapComponent from './components/MapComponent';
import "./MapComponent.css"
import "./App.css"
import Sidebar from './components/Sidebar';
import database from './database';
// import layerArr from "./json_layer"
import GeoJSON from 'ol/format/GeoJSON';
import SidebarButton from './components/SidebarButton';
import getLayers from './apis/getLayers.js'
import fetchLayerInfo from './apis/getLayers.js';
import layerInfoMatchIds from './helpers/layerInfoMatchIds.js';
export default function App() {

    const [layersInfoOpened, setlayersInfoOpened] = useState([])
    const [sidebarIsVisible, setSidebarIsVisible] = useState(true)
    const [activeLayers, setActiveLayers] = useState([])
    const [activeGeoJson, setActiveGeoJson] = useState([])
    const [currentTab, setCurrentTab] = useState("allLayers")
    const [layers, setLayers] = useState(null)
    const [isQueried, setIsQueried] = useState({name: '', trigger: false})

    useEffect(() => {
        const handleFetchLayerInfo = async () => {
            const layerInfo = await fetchLayerInfo()
            const newIdLayerInfo = layerInfoMatchIds(layerInfo, 'l_id', 'id')
            setLayers(newIdLayerInfo)
        }
        handleFetchLayerInfo()
    }, [])
    useEffect(() => {
        console.log("layers::")
        console.log(layers)
    }, [layers])
    
    return (
        <main>

            <MapComponent 
                activeGeoJson={activeGeoJson}
                activeLayers={activeLayers}
                isQueried={isQueried}
                setIsQueried={setIsQueried}
            />

            <div
                className={
                    `sidebar--container ${sidebarIsVisible ? "": "hidden"}`
                }
            >
                <Sidebar 
                    layers={layers}
                    activeLayers={activeLayers}
                    setActiveLayers={setActiveLayers}
                    sidebarToggled={sidebarIsVisible}
                    isQueried={isQueried}
                    setIsQueried={setIsQueried}
                    toggleSidebar={() => setSidebarIsVisible(prev => !prev)}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    layersInfoOpened={layersInfoOpened}
                    setlayersInfoOpened={setlayersInfoOpened}
                />

                <div
                    className={`toggle--sidebar--button`}
                >
                    <SidebarButton 
                        sidebarIsVisible={sidebarIsVisible}
                        toggleSidebar={() => setSidebarIsVisible(prev => !prev)}
                    />
                </div>
            </div>

            
            
        </main>
    )
}