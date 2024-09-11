import pkg from 'pg';
import fs from 'fs/promises'
import url from 'url'
import path from 'path'
import 'dotenv/config'
const { Pool } = pkg;

// Change to reflect root of ALL tile folders
const TILE_ROOT = process.env.TILE_ROOT || '/'

const pool = new Pool({
    user: 'runoff_map_api',
    password: 'runoff_map_api',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'runoff_map'
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log('error')
    } else {
        console.log(res.rows[0])
    }

})
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err.stack);
});

// GET layer info from db
const getLayerInfo = (req, res) => {
    pool.query(`SELECT l_id, file_name, layer_name, type, info, stroke, fill FROM layer_info`, (err, queryRes) => {
        if (err) {
            console.log('Error querying layer_info')
            console.log(err)
        }
        else {
            res.json(queryRes.rows)
        }
    })
}

// GET layer metadata

const getExtent = (req, res) => {
    const name = req.params.name
    console.log(name)
    pool.query(`SELECT x_min,y_min,x_max,y_max FROM layer_info WHERE file_name = '${name}'`,
        (err, queryRes) => {
            if (err) {
                console.error(err.message)
                console.log('Cannot access layer metadata')
                res.status(500).json({message: 'not found'})
            }
            else {
                console.log('successful query extent')
                console.log(queryRes.rows[0])
                res.json(queryRes.rows[0])
            }
        }
    )
}

// GET geojson from db
const getGeoJSON = (req, res) => {
    try {
        const featureCollection = req.params.name
        console.log(featureCollection)
        pool.query(
            `
                SELECT json_build_object(
                    'type', 'FeatureCollection',
                    'features', json_agg(ST_AsGeoJSON(t.*)::json)
                ) FROM ${featureCollection} as t;
            `,
            (err, queryRes) => {
                if (err){
                    console.error(err.message)
                    return 0
                }
                res.json(queryRes.rows[0])
            }
        )
    } catch (error) {
        console.error(error.message)
    }
}

// GET tiles from db
const getTileUrl = (res) => {
    console.log(res)
    const url = res[0]?.raster_path
    return path.join(TILE_ROOT, url)

}

const getTile = (req, res) => {
    console.log('getTile queried')
    const name = req.params.name
    let z = req.params.z
    const x = req.params.x
    let y = req.params.y
    const split_y = y.split('.')
    y = split_y[0]
    console.log(x, y, z)
    pool.query(`
        SELECT * 
        FROM ${name}
        WHERE 
        zoom_level = ${z} AND 
        tile_column = ${x} AND 
        tile_row = ${y}`, 
        (err, queryRes) => {
            if (err) {
                console.error(err.message)
                console.log('not a valid coordinate')
                res.status(500).json({message: 'not found'})
            }
            else {
                console.log('query succesful:')
                console.log(queryRes.rows)
                res.sendFile(getTileUrl(queryRes.rows))
            }
        
    })
}

export default { getTile, getLayerInfo, getExtent, getGeoJSON}

