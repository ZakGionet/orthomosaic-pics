import fileIcon from "../assets/file-icon.svg"
import viewIcon from "../assets/view-icon.svg"
import infoIcon from "../assets/info-icon.svg"
import zoomIcon from "../assets/zoom-icon.svg"
import "../Sidebar.css"
// import handleZoomToExtent from "../helpers/handleZoomToExtent"

import { LayersContext, QueriedContext, ActiveLayersContext } from "../contexts/Contexts"
import { useContext, useState } from "react"

export default function LayerTab({
    id, 
    layerName,
    fileName, 
    info, 
    infoOpened, 
    active, 
}) {
    
    const {activeLayers, updateActiveLayers, rearrangeActiveLayers, toggleLayers } = useContext(ActiveLayersContext)
    const { isQueried, handleSetIsQueried } = useContext(QueriedContext)
    const [tabState, setTabState] = useState(false)

    const handleTabState = (triggerFn, id) => {
        triggerFn(id)
        setTabState(prev =>!prev)
    }
    return (
        <div 
            key={id} 
            className={
                `layer 
                ${infoOpened ? "infoOpened": ""}
                ${active ? "active": ""}
                `}
            >
            <div className="top">
                <div className="type--title--container">
                    <img className="icon" src={fileIcon} />
                    {layerName}
                </div>
                <div className="icon--container">
                    <button 
                        className="view--button"
                        onClick={() => handleTabState(updateActiveLayers, id)}    
                    >
                        <img 
                            className={`view--icon ${active ? "active" : ""}`}
                            src={viewIcon}
                        />
                    </button>
                </div> 
            </div>
            {
            tabState &&
            <div className={`bottom`}>
                <div className="info--container">
                    info={info}
                </div>

                <div className="icon--container">
                    <button 
                        className="info--button"
                        onClick={() => toggleLayers(id)}
                    >
                        <img className="info--icon" src={infoIcon}/>
                    </button>

                    <button
                        className={`zoom--button ${active ? "active" : ""}`}
                        onClick={() => handleSetIsQueried(fileName, active)}
                    >
                        <img className={`zoom--icon ${active ? "active" : ""}`} src={zoomIcon}/>
                    </button>
                </div>
            </div> 
            }                         
        </div>
    )
}