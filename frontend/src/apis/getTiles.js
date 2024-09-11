import path from 'path'

const fetchXYZTiles = async (name, x, y, z) => {
    const rootUrl = 'http://localhost:8000/api/rasters'
    const fileUrl = path.join(rootUrl, name, toString(z), toString(x), toString(y))

    try {
        const response = await fetch(fileUrl) 
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return response
    } catch (error) {
        console.error(error.message)
        return 0
    }
}
export default fetchXYZTiles