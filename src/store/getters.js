export default {
    newDocLayer: state => {
        return state.newDocs[state.newDocProp.index]
    },
    lastAddedDocID: state => {
        const Docs = state.newDocs
        if (Docs.length > 0) {
            return Docs[Docs.length - 1].id
        }
        return 0
    },
    newDocChilds: (state, getters) => {
        const childsID = getters.newDocLayer.childs_id
        const childs = []
        const Docs = state.newDocs
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