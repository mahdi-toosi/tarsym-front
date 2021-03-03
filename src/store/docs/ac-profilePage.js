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
            .then((res) => res.data)
            .catch((error) => {
                dispatch("handleAxiosError", error, { root: true });
            });
        if (user) {
            commit("SET_User_to_Profile", user);
            return user._id;
        } else return false;
    },
    // !  getUserDocs
    async getUserDocs({ rootState, state, dispatch, commit }, { nextPage }) {
        const username = rootState.route.params.username;
        const user_id = await dispatch("setUserProfileAndGet_id", username);
        if (!user_id) return;

        const options = {
            params: {
                root: true,
                vitrine: false,
                "user._id": user_id,
                "$sort[createdAt]": -1,
                $limit: 20,
                $skip: nextPage ? state.profilePage.data.length : 0,
            },
        };
        const result = await axios
            .get("/documents", options)
            .then((res) => res.data)
            .catch((error) => {
                if (error != "Error: Request failed with status code 404")
                    dispatch("handleAxiosError", error, { root: true });
            });
        if (!result) return;
        result.data = await dispatch("decode_the_docs", { docs: result });
        if (nextPage) {
            result.merge = true;
        }
        await commit("SET_DOCS_TO_Profile_Page", result);
    },
};
