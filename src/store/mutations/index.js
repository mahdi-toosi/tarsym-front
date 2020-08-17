import newDoc from "./mu-newDoc"

export default {
    ...newDoc,
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
        deleteRoot,
        whitoutDecode
    }) {
        const Docs = docs.data || docs
        if (whitoutDecode) {
            state[list] = Docs
            return
        }
        const newData = []
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

        if (merge) {
            if (state[list].data) {
                state[list].data = [...state[list].data, ...docs.data]
            } else state[list] = [...state[list], ...docs.data]
        } else state[list] = docs
    },
    mapCenterUpdated(state, coordinates) {
        state.map.center = coordinates;
    },
}