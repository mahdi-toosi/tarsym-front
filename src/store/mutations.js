//  ! Set All situations false except this trueSituations  /////////////////////////////////////////////////
function situations(situations, trueSituations) {
    for (let key in situations) {
        let hasSituationsProperty = Object.prototype.hasOwnProperty.call(situations, key);
        if (hasSituationsProperty) {
            if (key == trueSituations) {
                // console.log(trueSituations);
                situations[key] = true
            } else {
                situations[key] = false
            }
            // console.log(`${key} : ${situations[key]}`)
        }
    }
}
import router from "../router";

export default {
    UPDATE_NEW_DOC_INDEX(state) {
        // const isNewDocRoute = router.currentRoute.name == "new point with prop"
        // if (isNewDocRoute) {
        const docID = router.currentRoute.params.id
        const Docs = state.newPoint
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
            Points: [],
            Polygons: [],
            Polylines: [],
            father_id: father_id,
            childs_id: [],
        };
        state.newPoint.push(newDocObj)
    },
    UPDATE_THIS_POINT_COORDINATE(state, c) {
        const coordinates = [c.lat, c.lng];
        const index = state.newDocProp.OnTool.index
        const thisLayer = state.newPoint[state.newDocProp.index]
        const thisPoint = thisLayer.Points[index];
        thisPoint.coordinates = coordinates;
    },
    SET_TOOL(state, type) {
        const obj = {
            coordinates: [],
            color: "green",
            isOn: true,
            fillColor: "blue",
            tooltip: null
        }
        if (type == "Points") {
            obj.icon = "";
            obj.coordinates = state.mapCenter
        }
        const index = state.newDocProp.index
        state.newPoint[index][type].push(obj);
    },
    backToAllPoints(state) {
        situations(state.situations, 'allPoints')
    },

    closeNewPointMarker(state) {
        router.push({
            name: 'all points'
        })
        state.newPoint.title = null
        state.newPoint.description = null
    },

    mapCenterUpdated(state, center) {
        state.mapCenter = center;
    },

    UPDATE_ON_TOOL(state) {
        const toolTypes = ["Points", "Polygons", "Polylines"];
        const onTool = state.newDocProp.OnTool;
        onTool.condition = false;
        onTool.type = "";
        onTool.index = -1;
        for (let i = 0; i < toolTypes.length; i++) {
            const toolType = toolTypes[i];
            const thisNewDoc = state.newPoint[state.newDocProp.index]
            const thisTool = thisNewDoc[toolType];
            const condition = (tool) => tool.isOn == true;
            const OnToolindex = thisTool.findIndex(condition);
            const weHaveOnTool = OnToolindex >= 0;
            if (weHaveOnTool) {
                onTool.condition = true;
                onTool.type = toolType;
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
            situations(state.situations, 'thereIsNoPoint')
            console.log('barai in category hichi sabt nashode');
        } else {
            state.allPoints = []
            Points.forEach(point => {
                state.allPoints.push(point)
            });
            situations(state.situations, 'allPoints')
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
                situations(state.situations, 'readPoint')
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
        situations(state.situations, 'readPoint')
    },
    //  ! Set The Current User ///////////////////////////////////////////////////////////////////
    setTheCurrentUser(state, CurrentUser) {
        state.User = CurrentUser
    },
    //  ! Set New Point Without Refresh ///////////////////////////////////////////////////////////////////
    setNewPointWithoutRefresh(state, data) {
        data.user = state.User
        state.allPoints.unshift(data);
        situations(state.situations, 'allPoints')
    },
}