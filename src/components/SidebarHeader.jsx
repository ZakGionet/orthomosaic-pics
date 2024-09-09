import directoryIcon from "../assets/directory-icon.svg"
import viewIcon from "../assets/view-icon.svg"

export default function SidebarHeader( {currentTab, setCurrentTab} ) {

    let panel = 'panel_'
    if (currentTab === 'allLayers') {
        panel = 'panel_0'
    }
    else {
        panel = 'panel_1'
    }
    return (
        <div
            className={`header`}
        >
            <div className={`button--overlay ${panel}`}></div>
            <div className="button--container">
                <button
                    className={``}
                    onClick={() => setCurrentTab("allLayers")}
                >
                    <img className="icon" src={directoryIcon}/>
                </button>


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