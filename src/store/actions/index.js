import newDoc from "./ac-newDoc"
import crudNewDoc from "./CRUD-newDoc"

export default {
    ...newDoc,
    ...crudNewDoc,
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
    ready_document_for_send({
        state
    }, thisDoc) {
        let doc = {
            ...thisDoc,
            junk: {}
        }
        const is_this_doc_root = state.newDocProp.rootID == thisDoc.id
        if (is_this_doc_root) {
            const this_tool = obj => obj.searchable == true
            const searchable_tool_index = thisDoc.tools.findIndex(this_tool)
            doc.coordinates = {
                type: "Point",
                coordinates: thisDoc.tools[searchable_tool_index].coordinates
            }
            doc.root = true
        }
        //  * description must be junk ?? (should include in the search query)
        const clear_this_items = ['tools']
        clear_this_items.forEach(element => {
            doc.junk[element] = thisDoc[element]
            delete doc[element]
        });
        delete doc.childs_id

        doc.junk = JSON.stringify(doc.junk)
        // const data_striggify = JSON.stringify(doc)
        return doc
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
}