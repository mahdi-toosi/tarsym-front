import router from "../../router";
import newDoc from "./mu-newDoc"

export default {
    ...newDoc,
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