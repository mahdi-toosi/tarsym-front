export default {
    docs_list: (state) => {
        const routeName = state.route.name;
        if (routeName == "all docs") return state.allDocs.data || [];
        else if (routeName == "read doc") return state.readDoc || [];
        else if (routeName == "profile") return state.profilePage.docs.data || [];
        else if (routeName == "update doc" || routeName == "create doc") return state.newDocs || [];
        else return [];
    },
    DocWithChildsTools: (state, getters) => {
        const routeName = state.route.name,
            EditRoutes = routeName == "update doc" || routeName == "create doc",
            ListRoutes = routeName == "all docs" || routeName == "profile",
            map_ZL = state.map.zoom;
        let tools = [];
        if (ListRoutes) {
            getters.docs_list.forEach((doc) => {
                const doc_ZL = doc.zoomLevel;
                if (doc.root && doc_ZL <= map_ZL) {
                    let rootTools = doc.tools.filter((tool) => tool.searchable);
                    rootTools.forEach((tool) => (tool._id = doc._id));
                    tools = tools.concat(rootTools);
                }
            });
            return tools;
        } else if (EditRoutes) {
            if (state.newDocs[0].zoomLevel <= map_ZL) {
                const invisibleDocs = state.DocProp.invisibleDocs;
                state.newDocs.forEach((doc) => {
                    if (invisibleDocs && invisibleDocs.includes(doc._id)) return;
                    let thisDocTools = doc.tools;
                    thisDocTools.forEach((tool) => (tool._id = doc._id));
                    tools = tools.concat(thisDocTools);
                });
            }
            return tools;
        } else if (routeName == "read doc") {
            const docLayer = getters.DocLayer;
            const doc_ZL = docLayer.zoomLevel;
            if (docLayer.root ? doc_ZL <= map_ZL : true) {
                let docTools = docLayer.tools;
                docTools.forEach((tool) => (tool._id = docLayer._id));
                tools = tools.concat(docTools);
            }
            if (!docLayer.childs_id.length) return tools;
            // * add childs tools to map
            getters.DocChilds(getters.DocLayer).forEach((child) => {
                // child.tools.forEach((tool) => (tool._id = child._id));
                // tools = tools.concat(child.tools);
                // * just add first Tool of Child
                const firstTool = child.tools[0];
                firstTool._id = child._id;
                tools = tools.concat(firstTool);
            });
        }
        return tools;
    },
    DocChilds: (state, getters) => (doc) => {
        if (!doc) return [];
        const childs_ID = doc.childs_id || [];
        let All_childs = [];
        childs_ID.forEach((child_id) => {
            const childs = getters.docs_list.filter((doc) => {
                if (!doc) return false;
                return doc._id == child_id;
            });
            All_childs = All_childs.concat(childs);
        });
        return All_childs;
    },
    validCategories: (state, getters) => {
        const DocLayerCats = getters.DocLayer.categories;
        const Cats = state.taxonomies.categories;
        if (!DocLayerCats.length) return Cats;
        const DocLastCat = DocLayerCats[DocLayerCats.length - 1];
        const validCats = Cats.filter((cat) => cat.childs.includes(DocLastCat._id));
        return validCats;
    },
    msgNotification: (state) => {
        const sidebar = document.querySelector(".sidebarNavigation");
        if (state.profilePage.unreadMessages) {
            sidebar.classList.add("haveMsg");
        } else {
            sidebar.classList.remove("haveMsg");
        }
    },
    tooltipData: (state, getters) => (index) => getters.DocLayer.tools[index].tooltip,
    visibility: (state, getters) => (index) => getters.DocLayer.tools[index].visible,
    isAuthenticated: (state) => state.user.username,
    DocLayer: (state, getters) => getters.docs_list[state.DocProp.index],
};
