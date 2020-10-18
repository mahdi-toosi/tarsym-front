import axios from "axios";
import router from "../../router";

function makeTreeFromList(list) {
    // * set parent ID
    list.forEach((parent) => {
        parent.children = [];
        parent.childs.forEach((child_id) => {
            const child_index = list.findIndex((el) => el._id == child_id);
            list[child_index].parent_id = parent._id;
        });
    });
    // * make valid tree
    const idMapping = list.reduce((acc, el, i) => {
        acc[el._id] = i;
        return acc;
    }, {});
    // *
    let roots = [];
    list.forEach((el) => {
        // Handle the root element
        if (el.parent_id === undefined) {
            roots.push(el);
            return;
        }
        // Use our mapping to locate the parent element in our list array
        const parentEl = list[idMapping[el.parent_id]];
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el];
    });
    return roots;
}

export default {
    async AddNewCat({ state, commit, dispatch }) {
        const editStage = state.profilePage.categoriesPage.editStage;
        const parent = editStage.parent;
        const url = "/taxonomies/";

        await axios
            .post(url, editStage.item)
            .then(async ({ data }) => {
                if (parent) {
                    const edited_data = {
                        childs: [...parent.childs, data._id],
                    };
                    await axios.patch(url + parent._id, edited_data);
                }
                commit("HIDE_THE_EDIT_STAGE");
                // * show the new cat if parent unexpanded
                document.getElementById(parent._id).checked = true;
                // * refresh categories
                dispatch("GetCategories");
            })
            .catch((error) => dispatch("handleAxiosError", error));
    },
    GetCategories({ state, dispatch }) {
        const options = {
            params: {
                type: 1, //* categories type = 1 / tags type = 2
                $limit: 100,
            },
        };
        const url = "/taxonomies/";
        axios
            .get(url, options)
            .then((res) => {
                state.profilePage.categoriesPage.categories = {
                    tree: makeTreeFromList(res.data.data),
                    rawList: res.data.data,
                };
            })
            .catch((error) => dispatch("handleAxiosError", error));
    },
    UpdateCat({ state, dispatch, commit }) {
        const new_item = state.profilePage.categoriesPage.editStage.item;
        const url = "/taxonomies/";
        axios
            .put(url + new_item._id, new_item)
            .then(({ data, status }) => {
                if (status == 200) commit("UPDATE_CATEGORY", data);
            })
            .catch((error) => dispatch("handleAxiosError", error));
        commit("HIDE_THE_EDIT_STAGE");
    },
    // !  setUserProfileAndGet_id
    async setUserProfileAndGet_id({ state, dispatch, commit }, username) {
        const currentUser = state.user;
        if (username === currentUser.username) {
            commit("SET_User_to_Profile", currentUser);
            return currentUser._id;
        }
        const url = "/users";
        const options = {
            params: {
                username,
            },
        };
        const user = await axios
            .get(url, options)
            .then((res) => {
                console.log({ setUserProfileAndGet_id: res });
                if (res.status == 200) return res.data;
            })
            .catch((error) => {
                dispatch("handleAxiosError", error);
            });
        if (user) {
            commit("SET_User_to_Profile", user);
            return user._id;
        } else return false;
    },
    // !  getUserDocs
    async getUserDocs({ dispatch, commit }) {
        const username = router.currentRoute.params.username;
        const user_id = await dispatch("setUserProfileAndGet_id", username);
        if (!user_id) return;

        const url = "/documents";
        const options = {
            params: {
                root: true,
                "user.id": user_id,
            },
        };
        const docs = await axios
            .get(url, options)
            .then((res) => {
                if (res.status == 200) return res.data;
            })
            .catch((error) => {
                if (error != "Error: Request failed with status code 404") dispatch("handleAxiosError", error);
            });
        if (!docs) return;

        const decoded_docs = await dispatch("decode_the_docs", {
            docs,
        });
        docs.data = decoded_docs;
        await commit("SET_DOCS_TO_Profile_Page", docs);
    },
    async CHECK_User_Unread_Messages({ state, dispatch }) {
        const user_id = state.user._id;
        if (!user_id) return;
        await axios
            .get(`/unreadMsgs?_id=${user_id}`)
            .then(({ data }) => {
                state.profilePage.unreadMessages = data.unreadMsgs;
            })
            .catch((error) => dispatch("handleAxiosError", error));
    },
};