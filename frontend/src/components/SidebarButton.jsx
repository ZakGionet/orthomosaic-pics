import arrowIcon from "../assets/arrow-icon.svg"

export default function SidebarButton({toggleSidebar, sidebarIsVisible}) {
    return (
        <button 
            className={`sidebar--toggle--button`} 
            onClick={toggleSidebar}
        >
            <img 
                className={`arrow--icon ${sidebarIsVisible ? "visible" : ""}`}
                src={arrowIcon} 
            />
        </button>
    )
}