import axios from "axios";

export default {
    // !  setUserProfileAndGet_id
    async setUserProfileAndGet_id({ dispatch, commit, rootState }, username) {
        const currentUser = rootState.user;
        if (username === currentUser.username) {
            commit("SET_User_to_Profile", currentUser);
            return currentUser._id;
        }

        const user = await axios
            .get("/users", { params: { username } })
            .then((res) => res.data.data[0])
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
            });
        if (user) {
            commit("SET_User_to_Profile", user);
            return user._id;
        } else return false;
    },
    // !  getUserDocs
    async getUserDocs({ rootState, state, dispatch, commit }, { nextPage, tag, category }) {
        const username = rootState.route.params.username;
        const user_id = await dispatch("setUserProfileAndGet_id", username);
        if (!user_id) {
            document.dispatchEvent(new CustomEvent("StopLoader"));
            return;
        }

        const params = {
            root: true,
            vitrine: false,
            "user._id": user_id,
            "$sort[createdAt]": -1,
            $limit: 20,
        };
        if (user_id !== rootState.user._id) params.situation = "publish";
        if (nextPage) params.$skip = state.profilePage.data.length;
        if (tag) params.tags = tag;
        if (category) params.categories = category;

        const result = await axios
            .get("/documents", { params })
            .then((res) => res.data)
            .catch((error) => {
                if (error != "Error: Request failed with status code 404")
                    dispatch("handleAxiosError", error, { root: true });
            });
        if (!result) {
            document.dispatchEvent(new CustomEvent("dataReceivedStopLoader"));
            return;
        }
        result.data = await dispatch("decode_the_docs", { docs: result.data });

        await commit("SET_DOCS_TO", { decoded_docs: result.data, list: "profilePage", merge: nextPage });
        commit("SET_TOTAL", { list: "profilePage", total: result.total });
        document.dispatchEvent(new CustomEvent("dataReceivedStopLoader"));
    },
};
