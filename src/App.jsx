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
import layerArr from "./json_layer"
import GeoJSON from 'ol/format/GeoJSON';
import SidebarButton from './components/SidebarButton';

export default function App() {

    const [layersInfoOpened, setlayersInfoOpened] = useState([])
    const [sidebarIsVisible, setSidebarIsVisible] = useState(true)
    const [activeLayers, setActiveLayers] = useState([])
    const [activeGeoJson, setActiveGeoJson] = useState([])
    const [currentTab, setCurrentTab] = useState("allLayers")
    const [layers, setLayers] = useState(layerArr["layers"])


    return (
        <main>

            <MapComponent 
                activeGeoJson={activeGeoJson}
                activeLayers={activeLayers}
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