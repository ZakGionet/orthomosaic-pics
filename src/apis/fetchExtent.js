const fetchExtent = async (layer) => {
    console.log('fetching metadata')
    try {
        const url = `http://localhost:8000/api/layer_extent/${layer}`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log('metadata received:')
        console.log(json)
        
        const minX = json.x_min
        const minY = json.y_min
        const maxX = json.x_max
        const maxY = json.y_max
        
        return [minX, minY, maxX, maxY]
    } catch (error) {
        console.error(error.message)
        return 0
    }

}

export default fetchExtent