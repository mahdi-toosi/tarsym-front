import newDoc from "./mu-newDoc"

export default {
    ...newDoc,
    passToolsToMap(state, doc) {
        // doc.tools.forEach(tool => {
        //     state.mapTools.push(tool)
        // });
        state.mapTools = doc.tools
    },
    SET_USER(state, user) {
        state.user = user
    },
    SET_USER_ACCESS_TOKEN(state, token) {
        if (state.user) state.user.accessToken = token
    },
    SET_ALL_TAGS(state, tags) {
        if (tags.data.length)
            state.allTags = tags.data
    },
    UPDATE_THIS_DOC(state, doc) {
        state.newDocs = doc
    },
    SET_DOCS_TO(state, {
        docs,
        list,
        merge
    }) {
        const newData = []
        const Docs = docs.data || docs
        Docs.forEach(doc => {
            const junk = JSON.parse(doc.junk)
            delete doc.junk
            const d = {
                ...doc,
                ...junk
            }
            d.date = d.date - 2000000
            newData.push(d)
        });

        if (docs.data) docs.data = newData
        else docs = newData

        if (list == 'allDocs') {
            if (merge) {
                state[list].data = [...state[list].data, ...docs.data]
            } else state[list] = docs
        } else if (list == 'newDocs') {
            if (merge) {
                state[list] = [...state[list], ...docs.data]
            } else state[list] = docs
        }
    },
    mapCenterUpdated(state, center) {
        state.mapCenter = center;
    },
}