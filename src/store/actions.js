import Vue from "vue";
import router from "../router";

function sendinfoToast(text) {
    Vue.toasted.info(text, {
        position: "bottom-left",
        duration: 5 * 1000,
        keepOnHover: true,
        iconPack: "fontawesome",
        icon: "fa-close",
    });
}

export default {
    async setCategory({
        // state,
        commit
    }, category) {
        await commit('setCategory', category)

        // * just for see all points select below! :D
        // if (state.situations.allPoints || state.situations.thereIsNoPoint) {
        //     situations(state.situations, 'loading')
        //     // * get the all points with this category
        //     const url = '/point/' + category._id
        //     try {
        //         await this.$axios.get(url).then((res) => {
        //             if (res.status == 200) {
        //                 commit('setAllPoints', res.data)
        //             }
        //         })
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
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
        // state
    }) {
        const url = "/point/";
        const allPoints = await this.$axios.get(url);
        commit('setAllPoints', allPoints.data)
        // situations(state.situations, 'allPoints')
    },
    async setTool({
        commit,
        state
    }, type) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            await commit('SET_TOOL', type);
            await commit('UPDATE_ON_TOOL');
            return;
        } else {
            sendinfoToast("درحال استفاده از ابزاری هستید");
        }
    },
    async addNewDoc({
        commit,
        getters,
        state
    }, father_id = 0) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const fake_id = new Date().getTime();
            if (father_id !== 0) {
                const index = state.newDocProp.index;
                state.newDocs[index].childs_id.push(fake_id);
            }
            await commit('ADD_NEW_DOCUMENT', {
                fake_id,
                father_id
            })
            const path = `/new-point/${getters.lastAddedDocID}`;
            await router.push(path);
            await commit('UPDATE_NEW_DOC_INDEX');
            return;
        } else {
            sendinfoToast("ابتدا تغییر مختصات قبلی را ذخیره کنید");
        }
    },
    async goBack({
        state,
        commit
    }) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const thisDoc = state.newDocProp.index;
            const father_id = state.newDocs[thisDoc].father_id;
            const path = `/new-point/${father_id}`;
            await router.push(path);
            await commit('UPDATE_NEW_DOC_INDEX');
            return;
        } else {
            sendinfoToast("ابتدا تغییر مختصات قبلی را ذخیره کنید");
        }
    },
    async goToChild({
        commit,
        state
    }, id) {
        const all_tools_is_off = !state.newDocProp.OnTool.condition;
        if (all_tools_is_off) {
            const path = `/new-point/${id}`;
            await router.push(path);
            await commit('UPDATE_NEW_DOC_INDEX');
            return;
        } else {
            sendinfoToast("ابتدا تغییر مختصات قبلی را ذخیره کنید");
        }
    },
}