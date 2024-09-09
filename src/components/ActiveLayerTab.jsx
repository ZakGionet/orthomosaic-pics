import infoIcon from "../assets/info-icon.svg"
import viewIcon from "../assets/view-icon.svg"
import fileIcon from "../assets/file-icon.svg"
import zoomIcon from "../assets/zoom-icon.svg"

import "../Sidebar.css"
import { useDrag, useDrop } from "react-dnd"
import { useRef, useEffect } from 'react'

import { LayersContext, QueriedContext, ActiveLayersContext } from "../contexts/Contexts"

import { useContext } from "react"

export default function ActiveLayerTab({ 
    id, 
    layerName, 
    fileName,
    index, 
    info
}) {
    console.log(`fileName value for rendered activelayer: ${fileName}`)
    const { activeLayers, updateActiveLayers, rearrangeActiveLayers, toggleLayers } = useContext(ActiveLayersContext)
    const { isQueried, handleSetIsQueried } = useContext(QueriedContext)

    // See https://react-dnd.github.io/react-dnd/examples/sortable/simple
    const ref = useRef(null)

    const [{handlerId}, drop] = useDrop({
        accept: 'activeLayer',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId()
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            console.log(`dragIndex: ${dragIndex}`)
            console.log(`hoverIndex: ${hoverIndex}`)
            if (dragIndex === hoverIndex) {
                return
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            const hoverMiddleY = 
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            
            const clientOffset = monitor.getClientOffset()

            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            } 

        },
        drop(item, monitor) {
            const dragIndex = item.index
            const hoverIndex = index
            if (dragIndex !== hoverIndex) {
                rearrangeActiveLayers(dragIndex, hoverIndex)
                item.index = hoverIndex
            }
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: 'activeLayer',
        item: () => {
            return {id, index}
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    drag(drop(ref))

    return (

            <div 
                ref={ref}
                key={id} 
                data-handler-id={handlerId}
                className={`layer active`}
            >
                <div className="top">
                    <div className="type--title--container">
                        <img className="icon" src={fileIcon} />
                        {layerName}
                    </div>

                    <div className="icon--container">
                        <button 
                            className="view--button"
                            onClick={() => updateActiveLayers(id)}    
                        >
                            <img 
                                className={
                                    `view--icon active`
                                } 
                                src={viewIcon}
                            />
                        </button>
                    </div> 
                </div>
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
                            className={`zoom--button active`}
                            onClick={() => handleSetIsQueried(fileName, true)}
                        >
                            <img className={`zoom--icon active`} src={zoomIcon}/>
                        </button>
                    </div>
                </div> 
            </div>  

    )
}