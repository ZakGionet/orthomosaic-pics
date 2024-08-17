import fetchMetadata from "./fetchMetadata"
import { transformExtent } from "ol/proj"

const getExtent = async (layerName) => {
    const response = await fetchMetadata(layerName)
    const minX = response.min_x
    const maxX = response.max_x
    const minY = response.min_y
    const maxY = response.max_y

    const extentDegrees = [minX, minY, maxX, maxY]
    const extentMeters = transformExtent(extentDegrees, 'EPSG:4326', 'EPSG:3857')
    return extentMeters
}
export default getExtent