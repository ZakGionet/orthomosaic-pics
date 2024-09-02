import fileIcon from "../assets/file-icon.svg"
import viewIcon from "../assets/view-icon.svg"
import infoIcon from "../assets/info-icon.svg"
import zoomIcon from "../assets/zoom-icon.svg"
import "../Sidebar.css"
// import handleZoomToExtent from "../helpers/handleZoomToExtent"

import { LayersContext, QueriedContext, ActiveLayersContext } from "../contexts/Contexts"
import { useContext } from "react"

export default function LayerTab({
        id, 
        name, 
        info, 
        infoOpened, 
        // toggleLayers, 
        active, 
        // updateActiveLayers, 
        // isQueried, 
        // handleSetIsQueried
    }) {
    
    const {activeLayers, updateActiveLayers, rearrangeActiveLayers, toggleLayers } = useContext(ActiveLayersContext)
    const { isQueried, handleSetIsQueried } = useContext(QueriedContext)

    return (
        <div 
            key={id} 
            className={
                `sidebar--layer 
                ${infoOpened ? "infoOpened": ""}
                ${active ? "--active": ""}
                `}
            >
            <div className="sidebar--layer--top">
                <div className="sidebar--layer--left">
                    <img className="file-icon" src={fileIcon} />
                    {name}
                </div>
                <div className="sidebar--icons">
                    <button 
                        className="sidebar--info--button"
                        onClick={() => toggleLayers(id)}
                    >
                        <img className="sidebar--layer--info--icon" src={infoIcon}/>
                    </button>
                    <button 
                        className="sidebar--view--button"
                        onClick={() => updateActiveLayers(id)}    
                    >
                        <img 
                            className={`sidebar--layer--view--icon${active ? "--active" : ""}`}
                            src={viewIcon}
                        />
                    </button>
                    <button
                        className={`sidebar--zoom-button${active ? "--active" : ""}`}
                        onClick={() => handleSetIsQueried(name, active)}
                    >
                        <img className='sidebar--zoom-icon' src={zoomIcon}/>
                    </button>
                </div> 
            </div>
            {
            infoOpened &&
            <div className="sidebar--layer--bottom">
                info: {info}
            </div> 
            }                         
        </div>
    )
}