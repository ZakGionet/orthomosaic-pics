import fetchExtent from "../apis/fetchExtent"
import buildTileLayer from "./buildTileLayer"

const handleTileBuild = async (layersCount, fileName, mapState) => {
    const extent = await fetchExtent(fileName)
    mapState.addLayer(buildTileLayer(extent, fileName, layersCount))
    return extent
}

export default handleTileBuild