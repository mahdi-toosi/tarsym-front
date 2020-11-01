import router from "../../router";
import newDoc from "./mu-newDoc";
import profilePage from "./profilePage";

export default {
    ...newDoc,
    ...profilePage,
    LOGOUT(state) {
        localStorage.removeItem("sjufNEbjDmE"); // sjufNEbjDmE = userData
        localStorage.removeItem("kemskDJobjgR"); // kemskDJobjgR = access key
        state.user = {};
        document.dispatchEvent(new CustomEvent("hideSidebarNav"));
        router.push("/Auth");
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
    UPDATE_THIS_DOC(state, doc) {
        state.newDocs = doc;
    },
    SET_DOCS_TO(state, { decoded_docs, list, merge }) {
        if (!merge) return (state[list] = decoded_docs);

        if (state[list].data) {
            state[list].data = state[list].data.concat(decoded_docs);
            return;
        } else state[list] = state[list].concat(decoded_docs);
    },
    SET_DOCS_TO_Profile_Page(state, docs) {
        state.profilePage.docs = docs;
    },
};
