import axios from "axios";

export default {
    // !  setUserProfileAndGet_id
    async setUserProfileAndGet_id({ dispatch, commit, rootState }, username) {
        const currentUser = rootState.auth.user;
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
    async getUserDocs({ dispatch, commit }, user_id) {
        const options = {
            params: {
                root: true,
                vitrine: false,
                "user._id": user_id,
                "$sort[createdAt]": -1,
            },
        };
        const docs = await axios
            .get("/documents", options)
            .then((res) => res.data)
            .catch((error) => {
                if (error != "Error: Request failed with status code 404")
                    dispatch("handleAxiosError", error, { root: true });
            });
        if (!docs) return;

        const decoded_docs = await dispatch("decode_the_docs", { docs });
        docs.data = decoded_docs;
        await commit("SET_DOCS_TO_Profile_Page", docs);
    },
};
