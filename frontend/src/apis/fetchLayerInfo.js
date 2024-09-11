const fetchLayerInfo = async () => {
    const url = 'http://localhost:8000/api/layer_info'
    try {
        const response = await fetch(url, {
            headers: {"Access-Control-Allow-Origin": "http://localhost:8000/api/layer_info"}
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        return json
    } catch (error) {
        console.error(error.message)
        return 0
    }
    
}

console.log(fetchLayerInfo())
export default fetchLayerInfo