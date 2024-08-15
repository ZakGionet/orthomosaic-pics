import fileIcon from "../assets/file-icon.svg"
import viewIcon from "../assets/view-icon.svg"
import infoIcon from "../assets/info-icon.svg"
import LayerSidebarTab from "./LayerSidebarTab"
import ActiveSidebarTab from "./ActiveSidebarTab"
import SidebarButton from "./SidebarButton"
import SidebarHeader from "./SidebarHeader"
import "../Sidebar.css"
import { v4 as uuidv4 } from 'uuid'

export default function Sidebar({layers, 
        activeLayers, setActiveLayers, 
        sidebarToggled, toggleSidebar, 
        currentTab, setCurrentTab,
        layersInfoOpened, setlayersInfoOpened
    }) {



    function updateActiveLayers(layerId) {
        console.log(`start updating active layers for layerId: ${layerId}`)
        setActiveLayers(prevLayers => {
            console.log('prev-layers:')
            console.log(prevLayers)
            const prevLayersKeys = prevLayers.map(layer => layer?.id)
            console.log('prev-layers keys:')
            console.log(prevLayersKeys)
            let newLayers = [...prevLayers]
            if (prevLayersKeys.includes(layerId)) {
                newLayers = prevLayers.filter(value => value.id !== layerId)
            }
            else {
                newLayers.push(layers[layerId])
            }
            return newLayers
        })
    }

    function rearrangeActiveLayers(dragIndex, hoverIndex) {
        setActiveLayers((prevActiveLayers) => {
            let newActiveLayers = [...prevActiveLayers]

            let movedActiveLayers = newActiveLayers[dragIndex]

            newActiveLayers.splice(dragIndex, 1)
            newActiveLayers.splice(hoverIndex, 0, movedActiveLayers)

            return newActiveLayers
        })
    }

    function toggleLayers(layerId) {
        setInfoToggledLayers(prevToggled => {
            let newToggled = [...prevToggled]
            if (prevToggled.includes(layerId)) {
                newToggled = prevToggled.filter(value => value !== layerId)
            }
            else {
                newToggled.push(layerId)
            }
            return newToggled
        })
    }

    return (
        <div
            className="sidebar"
        >
            <div>
                <SidebarHeader 
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                />
            </div>

            <div
                className={
                    `sidebar--all--layers--tab 
                    ${currentTab !== "allLayers" ?
                    "hidden-sidebar": ""
                }`
                }
            >
                <LayerSidebarTab 
                    layers={layers}
                    layersInfoOpened={layersInfoOpened}
                    toggleLayers={toggleLayers}
                    activeLayers={activeLayers}
                    updateActiveLayers={updateActiveLayers}
                />
            </div>

            <div
                className={
                    `sidebar--active--layers--tab 
                    ${currentTab !== "activeLayers" ?
                    "hidden-sidebar": ""
                }`
                    
                }
            >
                <ActiveSidebarTab 
                    activeLayers={activeLayers}
                    updateActiveLayers={updateActiveLayers}
                    rearrangeActiveLayers={rearrangeActiveLayers}
                />
            </div>
        </div>
    )
}