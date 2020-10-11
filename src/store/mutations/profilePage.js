export default {

    HIDE_THE_EDIT_STAGE(state) {
        const editStage = state.profilePage.categoriesPage.editStage
        editStage.show = false;
        setTimeout(() => {
            editStage.item = {};
        }, 1000);
    },
    UPDATE_CATEGORY(state, {
        _id,
        name
    }) {
        const rawList = state.profilePage.categoriesPage.categories.rawList
        const item_index = rawList.findIndex(el => el._id == _id)
        rawList[item_index].name = name
    },
    SET_TO_EDIT_STAGE(state, {
        Cat,
        father,
        update
    }) {
        const editStage = state.profilePage.categoriesPage.editStage
        editStage.item = {
            ...Cat
        }
        editStage.father = father
        editStage.update = update
        editStage.show = true
    },
    ADD_CHILD(state, father) {
        const emptyCat = {
            name: "",
            type: 1,
        };
        state.profilePage.categoriesPage.editStage = {
            show: true,
            item: emptyCat,
            father
            // : parent || null
        };
    },
    SET_User_to_Profile(state, user){
        state.profilePage.user = user
    }
}