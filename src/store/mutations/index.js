import newDoc from "./mu-newDoc"

export default {
    ...newDoc,
    SET_THIS_DOC_TOOLS_TO_MAP(state, doc) {
        // doc.tools.forEach(tool => {
        //     state.map.tools.push(tool)
        // });
        state.map.tools = doc.tools
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
        merge,
        deleteRoot
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
            if (deleteRoot && d.root) delete d.root
            newData.push(d)
        });

        if (docs.data) docs.data = newData
        else docs = newData

        if (list == 'allDocs') {
            if (merge) {
                state.allDocs.data = [...state.allDocs.data, ...docs.data]
            } else state.allDocs = docs
        } else if (list == 'newDocs') {
            if (merge) {
                state.newDocs = [...state.newDocs, ...docs.data]
            } else state.newDocs = docs
        }
    },
    mapCenterUpdated(state, coordinates) {
        state.map.center = coordinates;
    },
}