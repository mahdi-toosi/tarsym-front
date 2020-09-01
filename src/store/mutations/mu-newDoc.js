import router from "../../router";

const docLayer = (state) => state.newDocs[state.DocProp.index]

export default {
    CHANGE_MAP_LAYERS(state) {
        const doc = docLayer(state)
        if (!doc) return
        state.map.tileProviders.forEach((tileProvider, index) => {
            if (doc.layerIndex == index) tileProvider.visible = true
            else tileProvider.visible = false
        });
    },
    CHANGE_LAYER_INDEX(state, layerIndex) {
        const routeName = router.currentRoute.name
        if (routeName == 'create doc' || routeName == 'update doc')
            docLayer(state).layerIndex = layerIndex;
    },
    async REMOVE_THIS_DOC(state, _id) {
        if (state.allDocs.data) {
            let Docs = state.allDocs.data;
            let doc_index = await Docs.findIndex(doc => doc._id == _id);
            if (doc_index > -1) Docs.splice(doc_index, 1)
        }

        let Docs = state.newDocs
        let doc_index = await Docs.findIndex(doc => doc._id == _id)
        if (doc_index < 0) return

        const doc = Docs[doc_index];
        if (!doc.childs_id.length) {
            Docs.splice(doc_index, 1)
            return
        } else {
            let childs_index = []
            for (let index = 0; index < doc.childs_id.length; index++) {
                const child_id = doc.childs_id[index];
                const doc_index = await Docs.findIndex(doc => doc._id == child_id)
                if (doc_index > -1) childs_index.push(doc_index)
            }
            if (!childs_index.length) return
            for (let index = 0; index < childs_index.length; index++) {
                const child_index = childs_index[index];
                if (!Docs[child_index].childs_id.length) continue
                const doc_index = await Docs.findIndex(doc => doc._id == Docs[child_index]._id)
                if (doc_index > -1) childs_index.push(doc_index)
            }
            childs_index.forEach(child_index => Docs.splice(child_index, 1));
        }
    },
    CHANGE_POLYLINE_DECORATOR(state, {
        $event,
        index,
        type
    }) {
        const thisTool = docLayer(state).tools[index];
        const val = $event.target.checked;
        if (type == "arrow") thisTool.showArrow = val;
        if (type == "icon") thisTool.showIcon = val;
        if (type == "dashed") thisTool.dashed = val;
    },
    SET_ZOOM_LEVEL(state, val) {
        state.newDocs[0].zoom = val;
    },
    CHANGE_TOOLTIP(state, {
        index,
        val
    }) {
        const thisTool = docLayer(state).tools[index];
        thisTool.tooltip = val;
    },
    DELETE_TOOL(state, index) {
        const onTool = state.DocProp.OnTool;
        onTool.condition = false;
        docLayer(state).tools.splice(index, 1);
    },
    CHANGE_RANG_INPUT(state, obj) {
        const index = obj.$event.target.attributes.index.value;
        const val = Number(obj.$event.target.value);
        const thisTool = docLayer(state).tools[index]
        thisTool[obj.type] = val
    },
    SET_CHOSEN_TAXONOMY(state, {
        $event,
        type
    }) {
        let taxonomies = [];
        $event.forEach(taxonomy => {
            if (typeof taxonomy == 'string')
                taxonomy = {
                    name: taxonomy
                }
            taxonomy.name = taxonomy.name.trim()
            if (!taxonomy.type) taxonomy.type = type
            if (!taxonomy.childs) taxonomy.childs = []
            taxonomies.push(taxonomy)
        });
        //*  categories type = 1 / tags type = 2
        if (type == 1) {
            docLayer(state).categories = taxonomies
            return
        }
        docLayer(state).tags = taxonomies
    },
    ADD_DATE(state, {
        century,
        year,
        month,
        day
    }) {
        const doc_dateProps = docLayer(state).date_props
        if (century) doc_dateProps.century = century
        if (year) doc_dateProps.year = year
        if (month) doc_dateProps.month = month
        if (day) doc_dateProps.day = day
    },
    REMOVE_ICON(state, index) {
        const thisTool = docLayer(state).tools[index]
        thisTool.iconName = null
    },
    ADD_ICON(state, {
        iconName,
        index
    }) {
        const thisTool = docLayer(state).tools[index]
        thisTool.iconName = iconName
    },
    ADD_COLOR(state, obj) {
        const thisTool = docLayer(state).tools[obj.index]
        if (obj.secondaryColor) {
            thisTool.secondaryColor = obj.color
        } else thisTool.color = obj.color;
    },
    SET_TOOL(state, type) {
        const obj = {
            isOn: true,
            type: type,
            tooltip: null,
            coordinates: [],
            color: "#23A9AEFF",
            colorpicker: false,
            secondaryColor: "#23A9AEFF",
        }
        if (type == "Point") {
            obj.iconName = null
            obj.coordinates = state.map.center
            obj.angle = 0
            obj.iconSize = 35
            const is_searchable_point = docLayer(state).tools.length < 1
            if (is_searchable_point) obj.searchable = true
        }
        if (type == "Textbox") {
            obj.coordinates = state.map.center
            obj.width = 200
            obj.height = 100
            obj.fontSize = 16
            obj.color = "#E6E6E6FF"
            obj.secondaryColor = "#4C4C4CFF"
        }
        if (type == "Polyline") {
            obj.showIcon = false
            obj.showArrow = false
            obj.iconName = "fa fa-plane"
            obj.iconSize = 35
            obj.angle = 0
            obj.iconRepeat = 30
        }
        docLayer(state).tools.push(obj);
    },
    OFF_THE_ON_TOOL(state) {
        const onTool = state.DocProp.OnTool
        if (!onTool.condition) return
        const OnToolinDoc = docLayer(state).tools[onTool.index]
        OnToolinDoc.isOn = false
    },
    UPDATE_ON_TOOL(state) {
        const Docs = state.newDocs
        const onTool = state.DocProp.OnTool;
        onTool.condition = false;
        onTool.index = -1;
        for (let i = 0; i < Docs.length; i++) {
            const docLayer = Docs[i];
            const OnToolindex = docLayer.tools.findIndex(tool => tool.isOn == true);
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
        const index = state.DocProp.OnTool.index
        if (index < 0) return
        docLayer(state).tools[index].coordinates = coordinates;
    },
    UPDATE_DOC_INDEX(state) {
        const doc_id = router.currentRoute.params._id
        // const routeName = router.currentRoute.name
        // console.log('UPDATE_DOC_INDEX', 'routeName => ', routeName);
        const Docs = state.newDocs
        const thisObject = (obj) => obj._id == doc_id
        const index = Docs.findIndex(thisObject);
        state.DocProp.index = index
        state.DocProp._id = Docs[index]._id
    },
    SET_NEW_DOCUMENT(state, {
        fake_id,
        root
    }) {
        const newDocObj = {
            _id: fake_id,
            title: "",
            description: "",
            tools: [],
            date_props: {
                century: null,
                year: null,
                month: "01",
                day: "01"
            },
            childs_id: [],
            zoom: 4,
            layerIndex: 0
        };
        if (root) {
            newDocObj.tags = []
            newDocObj.categories = []
            newDocObj.root = true
        }
        state.newDocs.push(newDocObj)
    },
    ADD_NEW_ID(state, {
        doc,
        _id
    }) {
        const fakeID = doc._id
        state.newDocs.forEach(doc => {
            const index = doc.childs_id.findIndex(child_id => child_id == fakeID)
            if (index < 0) return
            doc.childs_id[index] = _id
        });
        doc._id = _id
        if (state.DocProp._id == fakeID) state.DocProp._id = _id
    },
    CLEAR_NEW_DOC(state) {
        router.push('/my-docs')
        state.newDocs = []
        state.DocProp = {
            index: 0,
            _id: 0,
            OnTool: {
                condition: false,
                index: -1
            },
        }
    },
}