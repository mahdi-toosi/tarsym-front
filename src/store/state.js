export default {
    newDocs: [],
    newDocProp: {
        index: 0,
        id: 0,
        OnTool: {
            condition: false,
            index: -1
        },
    },
    allTags: [{
        name: 'تگ اول'
    }],
    allDocs: [],
    map: {
        zoom: 5,
        MouseCoordinate: null,
        center: ["32.879587173066305", "54.01105444025955"],
        tools: []
    },
    readPoint: null,
    situations: {
        loading: true,
        thereIsNoPoint: false
    },
    user: {},
};