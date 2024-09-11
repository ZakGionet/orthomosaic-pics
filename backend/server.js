import express from 'express'
import db from './db.js'
import * as fs from 'node:fs/promises';
import cors from 'cors'
import 'dotenv/config'

const PORT = process.env.PORT
const WEBSITE_ROOT = process.env.WEBSITE_ROOT

const app = express()
app.use(cors())
app.use(express.static(WEBSITE_ROOT))
app.get('/', (req, res) => {
    res.send(index)
})
app.get('/api/raster/:name/:z/:x/:y', db.getTile)

app.get('/api/layer_info', db.getLayerInfo)

app.get('/api/layer_extent/:name', db.getExtent)

app.get('/api/geojson/:name', db.getGeoJSON)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))