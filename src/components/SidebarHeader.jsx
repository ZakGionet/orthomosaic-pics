import directoryIcon from "../assets/directory-icon.svg"
import viewIcon from "../assets/view-icon.svg"

export default function SidebarHeader( {currentTab, setCurrentTab} ) {
    return (
        <div
            className={`header`}
        >
            <div
                className={`button--container`}
            >
                <button
                    className={``}
                    onClick={() => setCurrentTab("allLayers")}
                >
                    <img className="icon" src={directoryIcon}/>
                </button>
            </div>

            <div
                className={`button--container`}
            >
                <button
                    className={``}
                    onClick={() => setCurrentTab("activeLayers")}
                >
                    <img className="icon" src={viewIcon}/>
                </button>
            </div>
        </div>
    )
}