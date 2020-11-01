import axios from "axios";

export default {
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
                console.log({ res });
                return res.data;
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
    async getUserDocs({ dispatch, commit }, user_id) {
        const url = "/documents";
        const options = {
            params: {
                root: true,
                "user._id": user_id,
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
