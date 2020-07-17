// import router from "../router";

export default {
    docs_list: (state) => {
        const routeName = state.route.name
        if (routeName == 'update doc' || routeName == 'create doc') return state.newDocs || []
        // else if (routeName == 'all docs') return state.allDocs.data
        else if (routeName == 'my docs') return state.allDocs.data || []
        else return []
    },
    newDocLayer: (state, getters) => {
        return getters.docs_list[state.newDocProp.index]
    },
    lastAddedDocID: state => {
        const Docs = state.newDocs
        if (Docs.length > 0) {
            return Docs[Docs.length - 1].id
        }
        return false
    },
    newDocChilds: state => {
        const Docs = state.newDocs
        const childsID = Docs[state.newDocProp.index].childs_id
        const childs = []
        childsID.forEach(id => {
            const thisObject = (doc) => (doc._id ? doc._id : doc.id) == id
            const index = Docs.findIndex(thisObject);
            if (Docs[index]) childs.push(Docs[index])
        });
        return childs
    },
    chosenTags: (state, getters) => {
        const thisDoc = getters.newDocLayer
        return thisDoc.tags
    }
}