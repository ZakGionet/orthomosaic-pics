const fetchMetadata = async (layer) => {
    console.log('fetching metadata')
    try {
        const url = `http://localhost:8000/api/layer_metadata/${layer}`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json()
        console.log('metadata received:')
        console.log(json)
        return json
    } catch (error) {
        console.error(error.message)
        return 0
    }

}

export default fetchMetadata