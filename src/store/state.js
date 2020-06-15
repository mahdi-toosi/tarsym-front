export default {
    newPoint: [],
    newDocProp: {
        index: 0,
        lastAddedDocID: 0,
        OnTool: {
            condition: false,
            type: "",
            index: -1
        },
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