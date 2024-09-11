import fileIcon from "../assets/file-icon.svg"
import viewIcon from "../assets/view-icon.svg"
import infoIcon from "../assets/info-icon.svg"
import zoomIcon from "../assets/zoom-icon.svg"
import "../Sidebar.css"
// import handleZoomToExtent from "../helpers/handleZoomToExtent"

import { QueriedContext, ActiveLayersContext } from "../contexts/Contexts"
import { useContext } from "react"

export default function LayerTab({
    id, 
    layerName,
    fileName, 
    info, 
    infoOpened, 
    active, 
}) {
    
    const { updateActiveLayers, toggleLayers } = useContext(ActiveLayersContext)
    const { handleSetIsQueried } = useContext(QueriedContext)

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
                    {/* <span className="tooltip">Add Layer</span> */}
                    <button 
                        className="view--button"
                        onClick={() => updateActiveLayers(id)}    
                    >
                        <img 
                            className={`view--icon ${active ? "active" : ""}`}
                            src={viewIcon}
                        />
                    </button>
                </div> 
            </div>
            {
            active &&
            <div className={`bottom`}>
                <div className="info--container">
                    info={info}
                </div>

                <div className="icon--container">
                    <button 
                        className="info--button"
                        onClick={() => toggleLayers(id)}
                    >
                        {/* <span className="tooltip">Additional Information</span> */}
                        <img className="info--icon" src={infoIcon}/>
                    </button>

                    <button
                        className={`zoom--button ${active ? "active" : ""}`}
                        onClick={() => handleSetIsQueried(fileName, active)}
                    >
                        {/* <span className="tooltip">Zoom to Layer</span> */}
                        <img className={`zoom--icon ${active ? "active" : ""}`} src={zoomIcon}/>
                    </button>
                </div>
            </div> 
            }                         
        </div>
    )
}