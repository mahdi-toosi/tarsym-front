export default {
    newPoint: {
        title: null,
        description: null,
        coordinates: {
            lat: null,
            lng: null
        },
        tooltip: "ثبت مختصات",
        draggable: true
    },
    zoom: 13,
    MouseCoordinate: null,
    clickCoordinates: null,
    category: null,
    categories: [],
    allPoints: [],
    mapCenter: {
        lat: 36.21193841525171,
        lng: 57.680192944186096
    },
    readPoint: null,
    situations: {
        allPoints: false,
        readPoint: false,
        newPoint: false,
        loading: true,
        thereIsNoPoint: false
    },
    User: null
};