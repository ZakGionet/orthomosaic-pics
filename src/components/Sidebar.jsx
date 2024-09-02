import fileIcon from "../assets/file-icon.svg"
import viewIcon from "../assets/view-icon.svg"
import infoIcon from "../assets/info-icon.svg"
import LayerSidebarTab from "./LayerSidebarTab"
import ActiveSidebarTab from "./ActiveSidebarTab"
import SidebarButton from "./SidebarButton"
import SidebarHeader from "./SidebarHeader"
import "../Sidebar.css"


export default function Sidebar({
        sidebarToggled, 
        toggleSidebar, 
        currentTab, 
        setCurrentTab,
        layersInfoOpened, 
        setlayersInfoOpened,
    }) {


    return (
        <div
            className="sidebar"
        >
            <SidebarHeader 
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            <LayerSidebarTab 
                className={
                    `sidebar--all--layers--tab 

                    ${currentTab !== "allLayers" 
                        ?
                    "hidden-sidebar": ""}`
                }
                layersInfoOpened={layersInfoOpened}
            />
            <ActiveSidebarTab 
                className={
                    `sidebar--active--layers--tab 

                    ${currentTab !== "activeLayers" 
                        ?
                    "hidden-sidebar": ""}`
                }
            />
        </div>
    )
}