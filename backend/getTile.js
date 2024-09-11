import { pool } from "./db"

// GET tiles from db
const sendTile = (res) => {
    console.log(res)
    const url = res[0].raster_path
    return path.join('/home/zak-gionet/Desktop/tiles', url)

}

const getTile = (req, res) => {
    const name = req.params.name
    const z = req.params.z
    const x = req.params.x
    let y = req.params.y
    const split_y = y.split('.')
    y = split_y[0]
    console.log(y)
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
                res.sendFile(sendTile(queryRes.rows))
            }
        
    })
}
