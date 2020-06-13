export default {
    newPoint: {
        title: null,
        description: null,
        Points: [],
        Polygons: [],
        Polylines: [],
        pointLastChangedCoordinate: null,
        OnTool: {
            condition: false,
            type: "",
            index: ""
        }
    },
    polylineTool: {
        latlngs: [],
        color: "red",
        isOn: false
    },
    zoom: 13,
    MouseCoordinate: null,
    clickCoordinates: null,
    category: null,
    categories: [],
    allPoints: [],
    mapCenter: ["36.21193841525171", "57.680192944186096"],
    readPoint: null,
    situations: {
        loading: true,
        thereIsNoPoint: false
    },
};