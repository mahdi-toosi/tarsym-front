import router from "../../router";

const docLayer = (state) => state.newDocs[state.DocProp.index];

export default {
    SET_Taxonomie_in_Doc(state, val) {
        const doc = docLayer(state);
        if (val.cat) doc.categories = val.$event;
        else doc.tags = val.$event;
    },
    MAKE_TOOL_ON(state, index) {
        const thisTool = docLayer(state).tools[index];
        thisTool.isOn = true;
        thisTool.visible = true;
    },
    CHANGE_VISIBILITY_FOR_THIS_DOC(state, _id) {
        const invisibleDocs = state.DocProp.invisibleDocs;
        const isInvisible = invisibleDocs.indexOf(_id);
        if (isInvisible >= 0) invisibleDocs.splice(isInvisible, 1);
        else invisibleDocs.push(_id);
    },
    CHANGE_VISIBILITY(state, index) {
        const tool = docLayer(state).tools[index];
        tool.visible = !tool.visible;
    },
    CLEAR_DATE(state) {
        docLayer(state).date_props = {
            century: null,
            year: null,
            month: "00",
            day: "00",
        };
    },
    UPDATE_MAP_ZOOM(state, zoom) {
        state.map.zoom = zoom;
        const routeName = router.currentRoute.name;
        if (routeName == "create doc" || routeName == "update doc") {
            const doc = docLayer(state);
            doc.map_animate.zoom = zoom;
        }
    },
    UPDATE_MAP_CENTER(state, coordinates) {
        state.map.center = coordinates;
        const routeName = router.currentRoute.name;
        if (routeName == "create doc" || routeName == "update doc") {
            const doc = docLayer(state);
            doc.map_animate.coordinates = coordinates;
        }
    },
    CHANGE_MAP_LAYERS(state, Layerindex) {
        if (Layerindex > -1) {
            state.map.tileProviders.forEach((tileProvider, index) => {
                if (Layerindex == index) tileProvider.visible = true;
                else tileProvider.visible = false;
            });
            return;
        }
        let doc = state.newDocs[state.DocProp.index];
        if (!doc) doc = state.readDoc[0];
        if (!doc) return;
        state.map.tileProviders.forEach((tileProvider, index) => {
            if (doc.map_animate.layerIndex == index) tileProvider.visible = true;
            else tileProvider.visible = false;
        });
    },
    CHANGE_LAYER_INDEX(state, layerIndex) {
        state.map.layerIndex = layerIndex;
        const routeName = router.currentRoute.name;
        if (["create doc", "update doc"].includes(routeName)) docLayer(state).map_animate.layerIndex = layerIndex;
    },
    async REMOVE_THIS_DOC(state, _id) {
        if (state.allDocs.data) {
            //  ? delete from allDocs
            let Docs = state.allDocs.data;
            let doc_index = await Docs.findIndex((doc) => doc._id === _id);
            if (doc_index > -1) Docs.splice(doc_index, 1);
        }

        let Docs = state.newDocs;
        let doc_index = await Docs.findIndex((doc) => doc._id === _id);
        if (doc_index < 0) return;

        // ? delete child from current doc
        const currentDoc = docLayer(state);
        const child_index = currentDoc.childs_id.findIndex((child_id) => child_id === _id);
        currentDoc.childs_id.splice(child_index, 1);

        const doc = Docs[doc_index];
        if (!doc.childs_id.length) {
            // ? if dosent have child , just delete document
            Docs.splice(doc_index, 1);
            return;
        } else {
            let childs_index = [];
            for (let index = 0; index < doc.childs_id.length; index++) {
                const child_id = doc.childs_id[index];
                const doc_index = await Docs.findIndex((doc) => doc._id === child_id);
                // ? get all childs index in newDocs
                if (doc_index > -1) childs_index.push(doc_index);
            }
            if (!childs_index.length) return;
            for (let index = 0; index < childs_index.length; index++) {
                const child_index = childs_index[index];
                if (!Docs[child_index].childs_id.length) continue;
                const doc_index = await Docs.findIndex((doc) => doc._id === Docs[child_index]._id);
                // ? get all of grandsons
                if (doc_index > -1) childs_index.push(doc_index);
            }
            // ? delete all of sons and grandsons in newDocs
            childs_index.forEach((child_index) => Docs.splice(child_index, 1));
        }
    },
    CHANGE_POLYLINE_DECORATOR(state, { $event, index, type }) {
        const thisTool = docLayer(state).tools[index];
        const val = $event.target.checked;
        if (type == "arrow") thisTool.showArrow = val;
        if (type == "icon") thisTool.showIcon = val;
        if (type == "dashed") thisTool.dashed = val;
    },
    SET_ZOOM_LEVEL(state, val) {
        state.newDocs[0].zoomLevel = val;
    },
    CHANGE_TOOLTIP(state, { index, val }) {
        const thisTool = docLayer(state).tools[index];
        thisTool.tooltip = val;
    },
    DELETE_TOOL(state, index) {
        const onTool = state.DocProp.OnTool;
        onTool.condition = false;
        docLayer(state).tools.splice(index, 1);
    },
    CHANGE_RANG_INPUT(state, obj) {
        const thisTool = docLayer(state).tools[obj.index];
        thisTool[obj.type] = obj.val;
    },
    ADD_DATE(state, { century, year, month, day }) {
        const doc_dateProps = docLayer(state).date_props;
        if (century) doc_dateProps.century = century;
        if (year) doc_dateProps.year = year;
        if (month) doc_dateProps.month = month;
        if (day) doc_dateProps.day = day;
    },
    REMOVE_ICON(state, index) {
        const thisTool = docLayer(state).tools[index];
        thisTool.iconName = null;
    },
    ADD_ICON(state, { iconName, index }) {
        const thisTool = docLayer(state).tools[index];
        thisTool.iconName = iconName;
    },
    ADD_COLOR(state, obj) {
        const thisTool = docLayer(state).tools[obj.index];
        if (obj.secondaryColor) {
            thisTool.secondaryColor = obj.color;
        } else thisTool.color = obj.color;
    },
    SET_TOOL(state, type) {
        const currentDoc = docLayer(state);
        const obj = {
            isOn: true,
            type: type,
            tooltip: null,
            coordinates: [],
            color: "#23A9AEFF",
            colorpicker: false,
            secondaryColor: "#23A9AEFF",
            visible: true,
        };
        if (type == "Point") {
            const isSearcheable = currentDoc.root && currentDoc.tools.length < 1;
            if (isSearcheable) obj.searchable = true;
            obj.iconName = null;
            obj.coordinates = isSearcheable ? ["0", "0"] : state.map.center;
            obj.angle = 0;
            obj.iconSize = 35;
        }
        if (type == "Textbox") {
            obj.coordinates = state.map.center;
            obj.width = 200;
            obj.height = 100;
            obj.fontSize = 16;
            obj.color = "#E6E6E6FF";
            obj.secondaryColor = "#4C4C4CFF";
        }
        if (type == "Polyline") {
            obj.showIcon = false;
            obj.showArrow = false;
            obj.iconName = "fa fa-plane";
            obj.iconSize = 35;
            obj.angle = 0;
            obj.iconRepeat = 30;
        }
        currentDoc.tools.push(obj);
    },
    OFF_THE_ON_TOOL(state) {
        const onTool = state.DocProp.OnTool;
        if (!onTool.condition) return;
        const OnToolinDoc = docLayer(state).tools[onTool.index];
        OnToolinDoc.isOn = false;
    },
    UPDATE_ON_TOOL(state) {
        const Docs = state.newDocs;
        const onTool = state.DocProp.OnTool;
        onTool.condition = false;
        onTool.index = -1;
        for (let i = 0; i < Docs.length; i++) {
            const docLayer = Docs[i];
            const OnToolindex = docLayer.tools.findIndex((tool) => tool.isOn == true);
            const weHaveOnTool = OnToolindex >= 0;
            if (weHaveOnTool) {
                onTool.condition = true;
                onTool.index = OnToolindex;
                break;
            }
        }
    },
    UPDATE_THIS_POINT_COORDINATE(state, clicked) {
        const coordinates = [clicked.lat, clicked.lng];
        const index = state.DocProp.OnTool.index;
        if (index == -1) return;
        docLayer(state).tools[index].coordinates = coordinates;
    },
    UPDATE_DOC_INDEX(state) {
        const doc_id = router.currentRoute.params._id;
        // const routeName = router.currentRoute.name
        // console.log('UPDATE_DOC_INDEX', 'routeName => ', routeName);
        const Docs = state.newDocs;
        const thisObject = (obj) => obj._id == doc_id;
        const index = Docs.findIndex(thisObject);
        state.DocProp.index = index;
        state.DocProp._id = Docs[index]._id;
    },
    SET_NEW_DOCUMENT(state, { fake_id, root, date_props }) {
        const newDocObj = {
            _id: fake_id,
            title: "",
            description: "",
            tools: [],
            date_props: date_props || {
                century: null,
                year: null,
                month: "00",
                day: "00",
            },
            childs_id: [],
            map_animate: {
                zoom: state.map.zoom,
                layerIndex: state.map.layerIndex,
                coordinates: state.map.center,
            },
        };
        if (root) {
            newDocObj.tags = [];
            newDocObj.categories = [];
            newDocObj.root = true;
            newDocObj.zoomLevel = 4;
        }
        state.newDocs.push(newDocObj);
    },
    ADD_NEW_ID(state, { doc, _id }) {
        const fakeID = doc._id;
        state.newDocs.forEach((doc) => {
            const index = doc.childs_id.findIndex((child_id) => child_id == fakeID);
            if (index < 0) return;
            doc.childs_id[index] = _id;
        });
        doc._id = _id;
        if (state.DocProp._id == fakeID) state.DocProp._id = _id;
    },
    CLEAR_NEW_DOC(state) {
        state.newDocs = [];
        state.DocProp = {
            index: 0,
            _id: 0,
            OnTool: {
                condition: false,
                index: -1,
            },
        };
    },
};
