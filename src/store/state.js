export default {
    newDocs: [],
    DocProp: {
        index: 0,
        _id: 0,
        invisibleDocs: [],
        OnTool: {
            condition: false,
            index: -1,
        },
    },
    readDoc: [],
    taxonomies: {
        tags: [],
        categories: [],
    },
    allDocs: {
        data: [],
    },
    map: {
        zoom: 5,
        MouseCoordinate: null,
        center: ["32.879587173066305", "54.01105444025955"],
        layerIndex: 0,
        tileProviders: [
            {
                name: "اُپن استریت مپ",
                visible: true,
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            },
            {
                name: "توپولوژی",
                visible: false,
                url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            },
            {
                name: "هوایی",
                visible: false,
                url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            },
            {
                name: "گوگل مپ",
                visible: false,
                url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
            },
            {
                name: "هوایی به همراه نام ها",
                visible: false,
                url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            },
        ],
    },
    searchPolygon: {
        coordinates: [],
        color: "#23A9AEFF",
        secondaryColor: "#23A9AEFF",
        isOn: false,
    },
    user: {},
    profilePage: {
        user: {},
        docs: [],
        unreadMessages: 0,
        categoriesPage: {
            categories: {},
            movecat: {},
            editStage: {
                item: {},
                show: false,
            },
        },
    },
};
