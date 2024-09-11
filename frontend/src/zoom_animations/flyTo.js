import getCenterZoomFromExtent from "../helpers/getCenterZoomFromExtent"

// Animation function
// https://openlayers.org/en/latest/examples/animation.html
const flyTo = (view, extent, done) => {
    const { center, zoom } = getCenterZoomFromExtent(extent, view)
    const duration = 2000;
    let parts = 2;
    let called = false;
    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate({
        center: center,
        duration: duration,
    }, callback);
    view.animate({
        zoom: zoom - 1,
        duration: duration / 2,
    }, {
        zoom: zoom,
        duration: duration / 2,
    }, callback);
}

export default flyTo