const docLayer = (state) => state.newDocs[state.DocProp.index];

export default {
    DRAG_TOOL_UPDATE(state, newSort) {
        docLayer(state).tools = newSort;
    },
    MAKE_TOOL_ON(state, index) {
        const thisTool = docLayer(state).tools[index];
        thisTool.isOn = true;
        thisTool.visible = true;
    },
    CHANGE_VISIBILITY(state, index) {
        const tool = docLayer(state).tools[index];
        tool.visible = !tool.visible;
    },
    CHANGE_POLYLINE_DECORATOR(state, { $event, index, type }) {
        const thisTool = docLayer(state).tools[index];
        const val = $event.target.checked;
        if (type === "arrow") thisTool.showArrow = val;
        if (type === "icon") thisTool.showIcon = val;
        if (type === "dashed") thisTool.dashed = val;
    },
    CHANGE_TOOLTIP(state, { index, val, type }) {
        const thisTool = docLayer(state).tools[index];
        if (type === "image" && process.env.NODE_ENV === "development" && val !== null) {
            val = process.env.VUE_APP_DOMAIN + val;
        }
        thisTool.tooltip[type] = val;
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
    SET_TOOL(state, { type, map }) {
        const currentDoc = docLayer(state);
        const obj = {
            isOn: true,
            type: type,
            tooltip: { text: null, image: null },
            coordinates: [],
            color: "#23A9AEFF",
            colorpicker: false,
            secondaryColor: "#23A9AEFF",
            visible: true,
        };
        if (type === "Point") {
            const isSearcheable = currentDoc.root && !currentDoc.tools.length;
            if (isSearcheable) obj.searchable = true;
            obj.iconName = null;
            obj.coordinates = isSearcheable ? ["0", "0"] : map.center;
            obj.angle = 0;
            obj.iconSize = 35;
        }
        if (type === "Textbox") {
            obj.coordinates = map.center;
            obj.width = 200;
            obj.height = 100;
            obj.fontSize = 16;
            obj.color = "#E6E6E6FF";
            obj.secondaryColor = "#4C4C4CFF";
        }
        if (type === "Polyline") {
            obj.showIcon = false;
            obj.showArrow = false;
            obj.iconName = "fa fa-plane";
            obj.iconSize = 35;
            obj.angle = 0;
            obj.iconRepeat = 30;
        }
        if (type === "Heatmap") {
            obj.key = new Date().getTime();
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
            const weHaveOnTool = OnToolindex > -1;
            if (weHaveOnTool) {
                onTool.condition = true;
                onTool.index = OnToolindex;
                break;
            }
        }
    },
    UPDATE_THIS_POINT_COORDINATE(state, { $event, tool }) {
        if (["Textbox", "Point"].includes(tool.type) && tool.isOn) {
            const coordinates = [$event.lat, $event.lng];
            tool.coordinates = coordinates;
        }
    },
};
