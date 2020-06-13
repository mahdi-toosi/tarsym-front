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
import Vue from "vue";

export default {
    newPointCoordinateUpdated(state, c) {
        const coordinates = [c.lat, c.lng];
        state.newPoint.pointLastChangedCoordinate = coordinates;
    },
    changeCoordinate(state, key) {
        const points = state.newPoint.Points;
        const draggablePoints = points.filter(
            (point) => point.isOn == true
        );
        if (draggablePoints.length <= 0) {
            state.newPoint.pointLastChangedCoordinate = points[key].coordinates;
            points[key].isOn = true;
        } else {
            Vue.toasted.info("ابتدا تغییر مختصات قبلی را ذخیره کنید", {
                position: "bottom-left",
                duration: 5 * 1000,
                keepOnHover: true,
                containerClass: "info",
                iconPack: "fontawesome",
                icon: "fa-close",
            });
        }
    },
    SET_POLYGON(state) {
        const obj = {
            coordinates: [],
            color: "green",
            isOn: true,
            fillColor: "blue",
            tooltip: null
        }
        state.newPoint.Polygons.push(obj);
    },
    setIcon(state) {
        const obj = {
            icon: "",
            coordinates: state.mapCenter,
            tooltip: null,
            isOn: false
        };
        state.newPoint.Points.push(obj);
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

    updateNewPointTitle(state, val) {
        state.newPoint.title = val;
    },
    UPDATE_ON_TOOL(state) {
        const tools = ["Points", "Polygons", "Polylines"];
        const onTool = state.newPoint.OnTool;
        onTool.condition = false;
        onTool.type = "";
        onTool.index = -1;
        for (let i = 0; i < tools.length; i++) {
            const type = tools[i];
            const thisTool = state.newPoint[type];
            const condition = (tool) => tool.isOn == true;
            const OnToolindex = thisTool.findIndex(condition);
            const weHaveOnTool = OnToolindex >= 0;
            if (weHaveOnTool) {
                onTool.condition = true;
                onTool.type = type;
                onTool.index = OnToolindex;
                break;
            }
        }
    },
    //  ! Update New Point Description ///////////////////////////////////////////////////////////////////
    updateNewPointDescription(state, val) {
        state.newPoint.description = val;
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