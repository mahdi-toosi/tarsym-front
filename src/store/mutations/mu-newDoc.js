import router from "../../router";

function thisDoc(state) {
    return state.newDocs[state.newDocProp.index]
}

export default {
    CHANGE_POLYLINE_DECORATOR(state, tag) {
        const index = tag.target.attributes.index.value;
        const changeType = tag.target.attributes.changeType.value;
        const thisTool = thisDoc(state).tools[index];
        const val = tag.target.checked;
        if (changeType == "arrow") thisTool.showArrow = val;
        if (changeType == "icon") thisTool.showIcon = val;
    },
    CHANGE_TOOLTIP(state, tag) {
        const index = tag.target.attributes.index.value;
        const thisTool = thisDoc(state).tools[index];
        const val = tag.target.value;
        thisTool.tooltip = val;
    },
    OFF_THIS_TOOL(state, thisTool) {
        thisTool.isOn = false;
    },
    DELETE_TOOL(state, index) {
        thisDoc(state).tools.splice(index, 1);
        const onTool = state.newDocProp.OnTool;
        onTool.condition = false;
    },
    UPDATE_TOOLTIPS(state) {
        thisDoc(state).tools.forEach((element, index) => {
            const input = `input[index="${index}"]`;
            const thisInput = document.querySelector(input);
            thisInput.value = element.tooltip;
        });
    },
    CHANGE_ICON(state, obj) {
        const index = obj.$event.target.attributes.index.value;
        const val = Number(obj.$event.target.value);
        const thisTool = thisDoc(state).tools[index]
        switch (obj.type) {
            case 'angle':
                thisTool.iconRotate = val;
                break;
            case 'size':
                thisTool.iconSize = val;
                break;
            case 'repeat':
                thisTool.iconRepeat = val;
                break;
            default:
                break;
        }
    },
    SET_CHOSEN_TAG(state, tags) {
        // console.log(tags);
        thisDoc(state).tags = tags
    },
    ADD_DATE(state, picked) {
        thisDoc(state).date = picked;
    },
    ADD_ICON(state, {
        iconName,
        index
    }) {
        const thisTool = thisDoc(state).tools[index]
        thisTool.iconName = iconName
    },
    ADD_COLOR(state, {
        color,
        index,
        secondaryColor
    }) {
        const thisTool = thisDoc(state).tools[index]
        if (!secondaryColor) {
            thisTool.color = color;
            return
        }
        thisTool.secondaryColor = color
    },
    SET_TOOL(state, type) {
        const obj = {
            isOn: true,
            type: type,
            tooltip: null,
            coordinates: [],
            color: "#194d33",
            colorpicker: false,
            secondaryColor: "blue",
        }
        const is_searchable_point = thisDoc(state).tools.length < 1
        if (type == "Point") {
            obj.iconName = null
            obj.coordinates = state.mapCenter
            obj.iconRotate = 0
            obj.iconSize = 35
            if (is_searchable_point) obj.searchable = true
        }
        if (type == "Polyline") {
            obj.showIcon = false
            obj.showArrow = false
            obj.iconName = "fa fa-plane"
            obj.iconSize = 35
            obj.iconRotate = 0
            obj.iconRepeat = 30
        }
        const thisLayer = state.newDocs[state.newDocProp.index]
        thisLayer.tools.push(obj);
    },
    UPDATE_ON_TOOL(state) {
        const Docs = state.newDocs
        const onTool = state.newDocProp.OnTool;
        onTool.condition = false;
        onTool.index = -1;
        for (let i = 0; i < Docs.length; i++) {
            const thisDoc = Docs[i];
            const condition = (tool) => tool.isOn == true;
            const OnToolindex = thisDoc.tools.findIndex(condition);
            const weHaveOnTool = OnToolindex >= 0;
            if (weHaveOnTool) {
                onTool.condition = true;
                onTool.index = OnToolindex;
                break;
            }
        }
    },
    UPDATE_THIS_POINT_COORDINATE(state, c) {
        const coordinates = [c.lat, c.lng];
        const index = state.newDocProp.OnTool.index
        const thisLayer = state.newDocs[state.newDocProp.index]
        const thisPoint = thisLayer.tools[index];
        // console.log(thisPoint);
        thisPoint.coordinates = coordinates;
    },
    UPDATE_NEW_DOC_INDEX(state) {
        // const isNewDocRoute = router.currentRoute.name == "new point with prop"
        // if (isNewDocRoute) {
        const docID = router.currentRoute.params.id
        const Docs = state.newDocs
        const thisObject = (obj) => obj.id == docID
        const index = Docs.findIndex(thisObject);
        state.newDocProp.index = index
        state.newDocProp.id = Docs[index].id
        // if (Docs.length == 1) {
        // state.newDocProp.rootID = Docs[index].id
        // }
        // }
    },
    SET_NEW_DOCUMENT(state, {
        fake_id,
        father_id
    }) {
        const newDocObj = {
            id: fake_id,
            title: "",
            description: "",
            tags: [],
            tools: [],
            date: null,
            father_id: String(father_id),
            childs_id: [],
        };
        state.newDocs.push(newDocObj)
    },
    ADD_NEW_ID(state, {
        doc,
        id
    }) {
        // console.log(doc.father_id == 0);
        doc.previous_id = doc.id
        doc.id = id
    }
}