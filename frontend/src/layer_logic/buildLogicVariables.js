const buildLogicVariables = (prevActiveLayers, activeLayers) => {
        /* Layer added or removed */
        let longest = []
        let shortest = []
        let removing = false

        if (prevActiveLayers.length > activeLayers.length) {
            longest = [...prevActiveLayers]
            shortest = [...activeLayers]
            removing = true
        }
        else {
            longest = [...activeLayers]
            shortest = [...prevActiveLayers]
            removing = false
        }

        /* Is assigned the element which is in one layer and not the other */
        let activeLayersChange = longest.filter(longestLayer => {
            return !shortest.some(shortestLayer => shortestLayer.file_name === longestLayer.file_name);
        })[0];

        return { removing, activeLayersChange }
}

export default buildLogicVariables