import router from "../router";

export default {
    docs_list: (state) => {
        const routeName = state.route.name
        if (routeName == 'create doc with prop' || routeName == 'create doc') return state.newDocs
        else if (routeName == 'my docs') return state.allDocs.data
        else return router.push('/create/doc/forward')
    },
    newDocLayer: state => {
        return state.newDocs[state.newDocProp.index]
    },
    lastAddedDocID: state => {
        const Docs = state.newDocs
        if (Docs.length > 0) {
            return Docs[Docs.length - 1].id
        }
        return false
    },
    newDocChilds: (state, getters) => {
        const childsID = getters.newDocLayer.childs_id
        const childs = []
        const Docs = getters.docs_list
        childsID.forEach(id => {
            const thisObject = (obj) => obj.id == id
            const index = Docs.findIndex(thisObject);
            childs.push(Docs[index])
        });
        return childs
    },
    chosenTags: (state, getters) => {
        const thisDoc = getters.newDocLayer
        return thisDoc.tags
    }
}