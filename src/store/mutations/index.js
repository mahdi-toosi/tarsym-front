import router from "../../router";
import newDoc from "./mu-newDoc";
import profilePage from "./profilePage";

export default {
    ...newDoc,
    ...profilePage,
    LOGOUT(state, redirect) {
        localStorage.removeItem("sjufNEbjDmE"); // sjufNEbjDmE = userData
        localStorage.removeItem("kemskDJobjgR"); // kemskDJobjgR = access key
        state.user = {};
        router.push({ path: "/Auth", query: { redirect } });
        setTimeout(() => (state.showSidebarNav = false), 600);
    },
    CHANGE_SEARCH_POLYGON_SITUATION(state) {
        state.searchPolygon.isOn = !state.searchPolygon.isOn;
    },
    SET_USER(state, user) {
        state.user = user;
    },
    SET_USER_ACCESS_TOKEN(state, token) {
        if (state.user) state.user.accessToken = token;
    },
    SET_DOCS_TO(state, { decoded_docs, list, merge }) {
        if (!merge) {
            state[list] = decoded_docs;
            return;
        }

        if (state[list].data) {
            state[list].data = state[list].data.concat(decoded_docs);
            return;
        } else state[list] = state[list].concat(decoded_docs);
    },
    SET_DOCS_TO_Profile_Page(state, docs) {
        state.profilePage.docs = docs;
    },
    CLEAR_READ_DOC(state) {
        state.readDoc = [];
        state.DocProp = {
            index: 0,
            _id: 0,
            OnTool: {
                condition: false,
                index: -1,
            },
        };
    },
};
