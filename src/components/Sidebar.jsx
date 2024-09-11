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

    let panel
    if (currentTab === 'allLayers') {
        panel = 0
    } 
    else if (currentTab === 'activeLayers') {
        panel = 1
    }
    const panelClass = 'panel_' + parseInt(panel)

    return (
        <div
            className="sidebar"
        >
            <SidebarHeader 
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            <div className={`panel--container ${panelClass}`}> 
                <LayerSidebarTab 
                    className={`layers--panel`}
                    layersInfoOpened={layersInfoOpened}
                />
                <ActiveSidebarTab 
                    className={`activeLayers--panel`}
                />
            </div>
        </div>
    )
}