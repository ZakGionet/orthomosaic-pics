const getCenterZoomFromExtent = (extent, view) => {
    const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
    const resolution = view.getResolutionForExtent(extent)
    const zoom = view.getZoomForResolution(resolution)
    return {center: center, zoom: zoom}
}

export default getCenterZoomFromExtent