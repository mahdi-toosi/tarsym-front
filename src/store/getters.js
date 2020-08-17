export default {
    docs_list: (state) => {
        const routeName = state.route.name
        if (routeName == 'my docs' || routeName == 'all docs') return state.allDocs.data || []
        else if (routeName == 'read doc') return state.readDoc || []
        else if (routeName == 'update doc' || routeName == 'create doc') return state.newDocs || []
        else return []
    },
    DocWithChildsTools: (state, getters) => {
        const routeName = state.route.name,
            editMode = routeName == 'update doc' || routeName == 'create doc',
            showMode = routeName == 'my docs' || routeName == 'all docs',
            map_ZL = state.map.zoom;
        let tools = []
        if (showMode) {
            getters.docs_list.forEach(doc => {
                const doc_ZL = doc.zoom
                if (doc.root && doc_ZL <= map_ZL) {
                    doc.tools.forEach(tool => tools.push(tool));
                }
            });
            return tools
        } else if (editMode) {
            const docLayer = getters.DocLayer
            const doc_ZL = docLayer.zoom
            if (docLayer.root ? doc_ZL <= map_ZL : true)
                docLayer.tools.forEach(tool => tools.push(tool));
            if (!docLayer.childs_id.length) return tools
            // * add childs tools to map
            const newDocs = state.newDocs
            let childs_indexes = []
            docLayer.childs_id.forEach(child_id => {
                const thisObject = (doc) => (doc._id || doc.id) == child_id
                const index = newDocs.findIndex(thisObject);
                childs_indexes.push(index)
            });
            childs_indexes.forEach(child_index => {
                const child_doc = newDocs[child_index]
                if (child_doc)
                    child_doc.tools.forEach(tool => {
                        tools.push(tool)
                    });
            });
        }
        return tools
    },
    newDocChilds: state => {
        const Docs = state.newDocs
        const childsID = Docs[state.DocProp.index].childs_id
        const childs = []
        childsID.forEach(id => {
            const thisObject = (doc) => (doc._id || doc.id) == id
            const index = Docs.findIndex(thisObject);
            if (Docs[index]) childs.push(Docs[index])
        });
        return childs
    },
    tooltipData: (state, getters) => index => getters.DocLayer.tools[index].tooltip,
    isAuthenticated: (state) => state.user.email,
    DocLayer: (state, getters) => getters.docs_list[state.DocProp.index],
}