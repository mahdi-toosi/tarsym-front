import Vue from "vue";
import router from "../../router";

const thisDoc = (state) => state.newDocs[state.newDocProp.index]

export default {
    async setTool({
        commit
    }, type) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');
        await commit('SET_TOOL', type);
        await commit('UPDATE_ON_TOOL');
    },
    async addNewDoc({
        commit,
        // getters,
        state,
        dispatch
    }, root = true) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const fake_id = new Date().getTime();
        if (!root) {
            const thisDoc = state.newDocs[state.newDocProp.index];
            thisDoc.childs_id.push(fake_id);
        }
        await commit('SET_NEW_DOCUMENT', {
            fake_id,
            root
        })

        const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/doc/${fake_id}`;
        await router.push(path);

        if (root) await dispatch('setTool', 'Point')
    },
    async addExistingDoc({
        commit,
        state,
        dispatch
    }, _id) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const existingDoc = await dispatch('get_this_docs', [_id])
        if (!existingDoc) return false

        const thisDoc = state.newDocs[state.newDocProp.index];
        thisDoc.childs_id.push(_id);

        await commit('SET_DOCS_TO', {
            docs: existingDoc,
            list: 'newDocs',
            merge: true,
            deleteRoot: true
        })
        const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/doc/${_id}`;
        await router.push(path);
    },
    // async addNewDoc({
    //     commit,
    //     // getters,
    //     state,
    //     dispatch
    // }, {
    //     root,
    //     _id
    // }) {
    //     await commit('OFF_THE_ON_TOOL')
    //     await commit('UPDATE_ON_TOOL');

    //     const ID = (_id || new Date().getTime());
    //     if (!root) {
    //         const thisDoc = state.newDocs[state.newDocProp.index];
    //         thisDoc.childs_id.push(ID);
    //     }
    //     if (!_id) {

    //         await commit('SET_NEW_DOCUMENT', {
    //             ID,
    //             root
    //         })
    //     } else {
    //         const existingDoc = await dispatch('get_this_docs', [_id])
    //         if (!existingDoc) return false

    //         await commit('SET_DOCS_TO', {
    //             docs: existingDoc,
    //             list: 'newDocs',
    //             merge: true,
    //             deleteRoot: true
    //         })
    //     }
    //     const path = `/${state.route.name == 'update doc' ? 'update' : 'create'}/doc/${ID}`;
    //     await router.push(path);

    //     if (root) await dispatch('setTool', 'Point')
    // },
    async is_this_Doc_valid({
        commit
    }, thisDoc) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        let errors = []
        // validate conditions
        const title = thisDoc.title.length > 5,
            description = thisDoc.description.length > 20,
            tools = thisDoc.tools.length > 0,
            date = thisDoc.date_props.year && thisDoc.date_props.month && thisDoc.date_props.day,
            currentRoute = router.currentRoute;

        if (!title) errors.push('تیتر کافی نیست')
        if (!description) errors.push('توضیحات کافی نیست')
        if (!date) errors.push('تاریخ برای این داکیومنت انتخاب کنید')
        if (!tools) errors.push('حداقل از یک ابزار برای این داکیومنت استفاده کنید')
        if (thisDoc.root) {
            const tags = thisDoc.tags.length;
            if (!tags) errors.push('حداقل یک تگ برای این داکیومنت انتخاب کنید')
        }

        if (errors.length == 0) return true
        else {
            const action = [{
                text: 'داکیومنت',
                onClick: async (e, toastObject) => {
                    const routeName = currentRoute.name
                    const path = `/${ routeName == 'create doc' ? 'create' : 'update' }/doc/${ (thisDoc._id || thisDoc.id) }`;
                    await router.push(path);
                    toastObject.goAway(0);
                }
            }]
            errors.forEach(msg => {
                Vue.toasted.error(msg, {
                    position: "bottom-left",
                    duration: 5 * 1000,
                    keepOnHover: true,
                    iconPack: "fontawesome",
                    icon: "fa-times-circle",
                    action: currentRoute.params.id == (thisDoc._id || thisDoc.id) ? false : action
                });
            });
            return false
        }
    },
    async goBack({
        state,
        commit
    }) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const doc_id = state.newDocProp.id;
        const father = await state.newDocs.filter(el => el.childs_id.includes(doc_id))[0]
        const path = `/${ state.route.name == 'create doc' ? 'create' : 'update'}/doc/${ ( father._id || father.id ) }`;
        await router.push(path);
    },
    async goToChild({
        commit
    }, id) {
        await commit('OFF_THE_ON_TOOL')
        await commit('UPDATE_ON_TOOL');

        const routeName = router.currentRoute.name
        const path = `/${ routeName == 'create doc' ? 'create' : 'update' }/doc/${id}`;
        await router.push(path);
        return;

    },
    async deleteTool({
        commit
    }, index) {
        await commit('DELETE_TOOL', index)
        await commit('UPDATE_ON_TOOL')
    },
    async toolSwitch({
            state,
            commit,
            dispatch
        },
        index) {
        const thisTool = thisDoc(state).tools[index];
        if (thisTool.isOn) {
            // if is on turned off
            await commit('OFF_THE_ON_TOOL')
            await commit('UPDATE_ON_TOOL')
            return
        } else {
            await dispatch('makeToolOn', index)
        }
    },
    async makeToolOn({
        state,
        commit
    }, index) {
        await commit('OFF_THE_ON_TOOL')
        const thisTool = thisDoc(state).tools[index];
        thisTool.isOn = true;
        await commit('UPDATE_ON_TOOL')
    },
    handleAxiosError(store, error) {
        let msg;
        if (error == "Error: Network Error") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 409") msg = "ایمیل قبلا به ثبت رسیده است";
        else if (error == "Error: Request failed with status code 401") msg = "ایمیل یا رمز عبور اشتباه است";
        else if (error == "Error: Request failed with status code 503") msg = "مشکل در برقراری ارتباط با سرور";
        else if (error == "Error: Request failed with status code 400") msg = "درخواست شما معتبر نمیباشد"
        else {
            msg = error;
            // msg = "مشکلی در ارتباط با سرور بوجود آمده، لطفا چند دقیقه بعد دوباره امتحان کنید";
            console.log("request get error => ", msg);
        }
        Vue.toasted.error(msg, {
            position: "bottom-left",
            duration: 5 * 1000,
            keepOnHover: true,
            iconPack: "fontawesome",
            icon: "fa-times-circle",
        });
    },
}