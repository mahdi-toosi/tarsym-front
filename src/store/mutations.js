export default {
    // CHANGE_SEARCH_POLYGON_SITUATION(state) {
    //     state.searchPolygon.isOn = !state.searchPolygon.isOn;
    // },
    SET_USER(state, user) {
        state.user = user;
    },
    SET_USER_ACCESS_TOKEN(state, token) {
        if (state.user) state.user.accessToken = token;
    },
    CLEAR_USER(state) {
        state.user = {};
    },
    UPDATE_USER(state, data) {
        state.user = { ...state.user, ...data };
        // * add to localStorage
        const userData = JSON.parse(localStorage.getItem("sjufNEbjDmE")); // sjufNEbjDmE = userData
        userData.user = { ...userData.user, ...data };
        localStorage.setItem("sjufNEbjDmE", JSON.stringify(userData));
    },
};
