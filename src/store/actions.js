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
import Vue from "vue";

export default {
    async setCategory({
        state,
        commit
    }, category) {
        await commit('setCategory', category)

        // * just for see all points select below! :D
        if (state.situations.allPoints || state.situations.thereIsNoPoint) {
            situations(state.situations, 'loading')
            // * get the all points with this category
            const url = '/point/' + category._id
            try {
                await this.$axios.get(url).then((res) => {
                    if (res.status == 200) {
                        commit('setAllPoints', res.data)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
    },

    // ! post new point
    async CreateNewPointMarker({
        state,
        // commit
    }) {
        // const url = '/point/'
        const coordinate = {
            type: 'Point',
            coordinates: [state.newPoint.coordinates.lng, state.newPoint.coordinates.lat]
        }
        const data = {
            title: state.newPoint.title,
            excerpt: state.newPoint.description,
            description: state.newPoint.description,
            location: coordinate,
            zoom: state.zoom,
            category: state.category._id
        }
        // console.log(data);
        try {
            // await this.$axios.post(url, data).then((res) => {
            //     if (res.status == 201) {
            //         commit('setNewPointWithoutRefresh', data)
            //     }

            // })
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    },

    async getAllCategories({
        commit
    }) {
        const url = '/category/'
        try {
            const categories = await this.$axios.get(url)
            commit('setAllCategories', categories.data)
        } catch (error) {
            console.log(error);
        }
    },

    async getTheCurrentUser({
        commit
    }) {
        const url = '/currentUser/'
        try {
            const user = await this.$axios.get(url);
            if (user.data == 401) {
                console.log('you should login');
            } else {
                commit('setTheCurrentUser', user.data)
            }
            // switch (user.data) {
            //     case 401:
            //         console.log('you should login');
            //         break;
            //     default:
            //         commit('setTheCurrentUser', user.data)
            //         break;
            // }
        } catch (error) {
            console.log(error);
        }

    },

    async getAllPoints({
        commit,
        state
    }) {
        const url = "/point/";
        const allPoints = await this.$axios.get(url);
        commit('setAllPoints', allPoints.data)
        situations(state.situations, 'allPoints')
    },
    async setPolygon({
        commit,
        state
    }) {
        if (!state.newPoint.OnTool.condition) {
            await commit('SET_POLYGON');
            await commit('UPDATE_ON_TOOL');
        } else {
            Vue.toasted.info("درحال استفاده از ابزاری هستید", {
                position: "bottom-left",
                duration: 5 * 1000,
                keepOnHover: true,
                iconPack: "fontawesome",
                icon: "fa-close",
            });
        }
    }
}