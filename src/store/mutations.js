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

export default {
    newPointMarker(state) {
        // if (!state.situations.newPoint) {
        situations(state.situations, 'newPoint')

        state.newPoint.coordinates.lat = state.mapCenter.lat
        state.newPoint.coordinates.lng = state.mapCenter.lng
        // }
    },

    backToAllPoints(state) {
        situations(state.situations, 'allPoints')
    },

    closeNewPointMarker(state) {
        situations(state.situations, 'allPoints')
        state.newPoint.title = null
        state.newPoint.description = null
    },

    mapCenterUpdated(state, center) {
        state.mapCenter = center;
    },

    updateNewPointTitle(state, val) {
        state.newPoint.title = val;
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