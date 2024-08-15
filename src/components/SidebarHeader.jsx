import directoryIcon from "../assets/directory-icon.svg"
import viewIcon from "../assets/view-icon.svg"

export default function SidebarHeader( {currentTab, setCurrentTab} ) {
    return (
        <div
            className={`sidebar--header--container`}
        >
            <div
                className={`sidebar--header--button--container`}
            >
                <button
                    className={`sidebar--header--button--all--layers`}
                    onClick={() => setCurrentTab("allLayers")}
                >
                    <img className="sidebar--header--directory--icon" src={directoryIcon}/>
                </button>
            </div>

            <div
                className={`sidebar--header--button--container`}
            >
                <button
                    className={`sidebar--header--button--active--layers`}
                    onClick={() => setCurrentTab("activeLayers")}
                >
                    <img className="sidebar--header--view--icon" src={viewIcon}/>
                </button>
            </div>
        </div>
    )
}