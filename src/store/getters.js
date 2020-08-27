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
            editMode = routeName == 'update doc' || routeName == 'create doc' || routeName == 'read doc',
            showMode = routeName == 'my docs' || routeName == 'all docs',
            map_ZL = state.map.zoom,
            currentList = getters.docs_list;
        let tools = []
        if (showMode) {
            currentList.forEach(doc => {
                const doc_ZL = doc.zoom
                if (doc.root && doc_ZL <= map_ZL) {
                    let rootTools = doc.tools.filter(tool => tool.searchable)
                    rootTools.forEach(tool => tool._id = doc._id);
                    tools = tools.concat(rootTools);
                }
            });
            return tools
        } else if (editMode) {
            const docLayer = getters.DocLayer
            const doc_ZL = docLayer.zoom
            if (docLayer.root ? doc_ZL <= map_ZL : true) {
                let docTools = docLayer.tools
                docTools.forEach(tool => tool._id = docLayer._id);
                tools = tools.concat(docTools)
            }
            if (!docLayer.childs_id.length) return tools
            // * add childs tools to map
            getters.DocChilds.forEach(child => {
                child.tools.forEach(tool => tool._id = child._id);
                tools = tools.concat(child.tools)
            });
        }
        return tools
    },
    DocChilds: (state, getters) => {
        const childs_ID = getters.DocLayer.childs_id
        let All_childs = []
        childs_ID.forEach(_id => {
            const childs = getters.docs_list.filter(doc => {
                // console.log('doc => ', doc);
                if (!doc) return false
                return doc._id == _id
            });
            All_childs = All_childs.concat(childs)
        });
        return All_childs
    },
    validCategories: (state, getters) => {
        const DocLayerCats = getters.DocLayer.categories;
        const Cats = state.taxonomies.categories
        if (!DocLayerCats.length) return Cats
        const DocLastCat = DocLayerCats[DocLayerCats.length - 1];
        const validCats = Cats.filter(cat => cat.childs.includes(DocLastCat._id))
        return validCats
    },
    tooltipData: (state, getters) => index => getters.DocLayer.tools[index].tooltip,
    isAuthenticated: (state) => state.user.email,
    DocLayer: (state, getters) => getters.docs_list[state.DocProp.index],
}