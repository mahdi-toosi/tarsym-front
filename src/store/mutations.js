import router from "../router";

export default {
    CHANGE_ICON_REPEAT(state, tag) {
        const index = tag.target.attributes.index.value;
        const val = tag.target.value;
        const thisDoc = state.newDocs[state.newDocProp.index]
        const thisTool = thisDoc.tools[index]
        thisTool.decorator.icon.repeat = Number(val);
    },
    CHANGE_ICON_ANGLE(state, tag) {
        const index = tag.target.attributes.index.value;
        const val = tag.target.value;
        const thisDoc = state.newDocs[state.newDocProp.index]
        const thisTool = thisDoc.tools[index]
        thisTool.decorator.icon.rotate = Number(val);
    },
    CHANGE_ICON_SIZE(state, tag) {
        const index = tag.target.attributes.index.value;
        const val = tag.target.value;
        const thisDoc = state.newDocs[state.newDocProp.index]
        const thisTool = thisDoc.tools[index]
        thisTool.decorator.icon.size = Number(val);
    },
    SET_CHOSEN_TAG(state, tags) {
        const thisDoc = state.newDocs[state.newDocProp.index]
        console.log(tags);
        thisDoc.tags = tags
    },
    ADD_ICON(state, {
        iconName,
        index
    }) {
        const thisDoc = state.newDocs[state.newDocProp.index]
        if (thisDoc.tools[index].type == "Polyline") {
            thisDoc.tools[index].decorator.icon.name = iconName
            return
        }
        thisDoc.tools[index].icon = iconName;
    },
    ADD_COLOR(state, {
        color,
        index,
        type,
        secondaryColor
    }) {
        const thisDoc = state.newDocs[state.newDocProp.index]
        const thisTool = thisDoc.tools[index]
        if (!secondaryColor) {
            thisTool.color = color;
            return
        }
        switch (type) {
            case "Polygon":
                thisTool.fillColor = color
                break;
            case "Polyline":
                thisTool.decorator.icon.color = color
                break;
            default:
                break;
        }
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
        if (Docs.length == 1) {
            state.newDocProp.rootID = Docs[index].id
        }
        // }
    },
    ADD_NEW_DOCUMENT(state, {
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
            father_id: father_id,
            childs_id: [],
        };
        state.newDocs.push(newDocObj)
    },
    UPDATE_THIS_POINT_COORDINATE(state, c) {
        const coordinates = [c.lat, c.lng];
        const index = state.newDocProp.OnTool.index
        const thisLayer = state.newDocs[state.newDocProp.index]
        const thisPoint = thisLayer.tools[index];
        thisPoint.coordinates = coordinates;
    },
    SET_TOOL(state, type) {
        const obj = {
            type: type,
            coordinates: [],
            color: "#194d33",
            colorpicker: false,
            isOn: true,
            fillColor: "blue",
            tooltip: null
        }
        if (type == "Point") {
            obj.icon = null;
            obj.coordinates = state.mapCenter
        }
        if (type == "Polyline") {
            obj.decorator = {
                icon: {
                    name: "fa fa-plane",
                    color: null,
                    size: 35,
                    rotate: 0,
                    repeat: 30
                }
            }
        }
        const thisLayer = state.newDocs[state.newDocProp.index]
        thisLayer.tools.push(obj);
    },
    backToAllPoints() {
        // situations(state.situations, 'allPoints')
    },

    closeNewPointMarker(state) {
        router.push({
            name: 'all points'
        })
        state.newDocs.title = null
        state.newDocs.description = null
    },

    mapCenterUpdated(state, center) {
        state.mapCenter = center;
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
    //  ! Set All Categories ///////////////////////////////////////////////////////////////////
    setAllCategories(state, categories) {
        state.categories = categories
    },
    //  ! Set All Points we get ///////////////////////////////////////////////////////////////////
    setAllPoints(state, Points) {
        if (Points.length == 0) {
            // situations(state.situations, 'thereIsNoPoint')
            console.log('barai in category hichi sabt nashode');
        } else {
            state.allPoints = []
            Points.forEach(point => {
                state.allPoints.push(point)
            });
            // situations(state.situations, 'allPoints')
        }
    },
    //  ! Set Category ///////////////////////////////////////////////////////////////////
    setCategory(state, category) {
        state.category = category
    },
    //  ! read one point ///////////////////////////////////////////////////////////////////
    readThisPoint(state, data) {
        if (state.situations.newPoint) {
            let sure = confirm('انصراف میدی ؟؟')
            if (sure) {
                // situations(state.situations, 'readPoint')
            } else {
                return
            }
        }
        if (data.latlng) {
            const point = state.allPoints.filter((point) => {
                return point.location.coordinates[1] == data.latlng.lat && point.location.coordinates[0] == data.latlng.lng
            })
            state.readPoint = point[0];
        } else {
            const point = state.allPoints.filter((point) => {
                return point.location.coordinates[1] == data[1] && point.location.coordinates[0] == data[0]
            })
            state.readPoint = point[0];
        }
        // situations(state.situations, 'readPoint')
    },
    //  ! Set The Current User ///////////////////////////////////////////////////////////////////
    setTheCurrentUser(state, CurrentUser) {
        state.User = CurrentUser
    },
    //  ! Set New Point Without Refresh ///////////////////////////////////////////////////////////////////
    setNewPointWithoutRefresh(state, data) {
        data.user = state.User
        state.allPoints.unshift(data);
        // situations(state.situations, 'allPoints')
    },
}