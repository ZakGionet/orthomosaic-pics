import LayerGroup from "ol/layer/Group"
import TileLayer from "ol/layer/Tile"
import { XYZ } from "ol/source"

const buildTileLayer = (extent, fileName, layersCount) => {
    const layerGroup = new LayerGroup({
        name: fileName,
        layers: [
            new TileLayer({
                name: fileName,
                extent: extent,
                source: new XYZ({
                    minZoom: 0,
                    maxZoom: 21,
                    url: `http://localhost:8000/api/raster/${fileName}/{z}/{x}/{-y}.png`,
                    tileSize: [256, 256]
                })
            })
        ]
    })
    console.log('layer group debugging:')
    layerGroup.setVisible(true)
    layerGroup.setZIndex(layersCount)
    return layerGroup
}

export default buildTileLayer