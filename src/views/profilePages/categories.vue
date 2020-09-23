<template>
    <div dir="rtl" class="categoriesPage">
        <div class="editStageclass" v-if="editStage.item && editStage.item.name">
            <i class="fas fa-times" @click="editStage = {}"></i>
            <input type="text" v-model="editStage.item.name" maxlength="28" />
            <button class="btn btn-green" @click="editCategory()">ذخیره</button>
            <hr />
            <button class="btn btn-red" @click="deleteCategory()">حذف</button>
        </div>
        <div v-for="(grandpa , index) in categories" :key="grandpa._id" class="tree">
            <label :for="grandpa._id" v-if=" grandpa.children.length ">
                <i class="fas fa-angle-left"></i>
            </label>
            <input type="checkbox" :id="grandpa._id" v-if=" grandpa.children.length " hidden />
            <div class="item">
                <div>{{ grandpa.name }}</div>
                <div class="options">
                    <i>{{ grandpa.documents.length }} سند</i>
                    <span @click="AddChild(grandpa._id)">
                        <i class="fas fa-plus"></i>
                    </span>
                    <span @click="setToEditStage(index)">
                        <i class="fas fa-edit"></i>
                    </span>
                </div>
            </div>
            <div v-if=" grandpa.children.length " class="itemGroup">
                <div v-for="(parent, index ) in grandpa.children" :key="parent.id" class="tree">
                    <label :for="parent._id" v-if=" parent.children.length ">
                        <i class="fas fa-angle-left"></i>
                    </label>
                    <input type="checkbox" :id="parent._id" hidden v-if=" parent.children.length " />
                    <div class="item">
                        <div>{{ parent.name }}</div>
                        <div class="options">
                            <i>{{ parent.documents.length }} سند</i>
                            <span @click="AddChild(parent._id)">
                                <i class="fas fa-plus"></i>
                            </span>
                            <span @click="setToEditStage(index , grandpa)">
                                <i class="fas fa-edit"></i>
                            </span>
                        </div>
                    </div>
                    <div v-if="parent.children.length" class="itemGroup">
                        <div
                            v-for="(child , index) in parent.children"
                            :key="child.id"
                            class="tree"
                        >
                            <label :for="child._id" v-if=" child.children.length ">
                                <i class="fas fa-angle-left"></i>
                            </label>
                            <input
                                type="checkbox"
                                :id="child._id"
                                hidden
                                v-if=" child.children.length "
                            />
                            <div class="item">
                                <div>{{ child.name }}</div>
                                <div class="options">
                                    <i>{{ child.documents.length }} سند</i>
                                    <span @click="setToEditStage(index , parent, grandpa )">
                                        <i class="fas fa-edit"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "editCategories",
    data() {
        return {
            categories: [],
            editStage: {},
        };
    },
    methods: {
        getCategories() {
            const url = `/taxonomies`,
                options = {
                    params: {
                        type: 1, //* categories type = 1 / tags type = 2
                        $limit: 100,
                    },
                };
            this.$axios
                .get(url, options)
                .then((res) => {
                    const list = this.makeValidList(res.data.data);
                    this.categories = list;
                })
                .catch((error) =>
                    this.$store.dispatch("handleAxiosError", error)
                );
        },
        makeValidList(list) {
            // * set parent ID
            list.forEach((parent) => {
                parent.children = [];
                parent.childs.forEach((child_id) => {
                    const child_index = list.findIndex(
                        (el) => el._id == child_id
                    );
                    list[child_index].parent_id = parent._id;
                });
            });
            // * make valid tree
            const idMapping = list.reduce((acc, el, i) => {
                acc[el._id] = i;
                return acc;
            }, {});
            // *
            let roots = [];
            list.forEach((el) => {
                // Handle the root element
                if (el.parent_id === undefined) {
                    roots.push(el);
                    return;
                }
                // Use our mapping to locate the parent element in our list array
                const parentEl = list[idMapping[el.parent_id]];
                // Add our current el to its parent's `children` array
                parentEl.children = [...(parentEl.children || []), el];
            });
            return roots;
        },
        AddChild(_id) {
            const list = this.rawList;
            const index = list.findIndex((el) => el._id == _id);
            const fake_id = new Date().getTime();
            const emptyCat = {
                _id: fake_id,
                name: "",
                type: 1,
                documents: [],
                childs: [],
            };
            list[index].childs.push(fake_id);
            list.push(emptyCat);
            this.makeValidList(list);
        },
        setToEditStage(index, parent, gparent) {
            const item = this.find_Item(gparent, parent, index);
            this.editStage = {
                item: { ...item },
                relations: { index, parent, gparent },
            };
        },
        editCategory() {
            const new_item = this.editStage.item;
            const url = `/taxonomies/${new_item._id}`;
            this.$axios
                .put(url, new_item)
                .then(({ data, status }) => {
                    if (status == 200) {
                        const rel = this.editStage.relations;
                        const old_item = this.find_Item(
                            rel.gparent,
                            rel.parent,
                            rel.index
                        );
                        old_item.name = data.name;
                        this.editStage = {};
                    }
                })
                .catch((error) =>
                    this.$store.dispatch("handleAxiosError", error)
                );
        },
        deleteCategory() {
            const item = this.editStage.item;
            const url = `/taxonomies/${item._id}`;
            this.$axios
                .delete(url)
                .then(({ status }) => {
                    if (status == 200) {
                        this.getCategories();
                        this.editStage = {};
                    }
                })
                .catch((error) =>
                    this.$store.dispatch("handleAxiosError", error)
                );
        },
        find_Item(gparent, parent, index) {
            if (gparent) {
                return this.editCatLvL3(gparent, parent, index);
            } else if (parent) {
                return this.editCatLvL2(parent, index);
            } else {
                return this.categories[index];
            }
        },
        editCatLvL2(parent, index) {
            const parent_index = this.categories.findIndex(
                (el) => el._id == parent._id
            );
            const item = this.categories[parent_index].children[index];
            return item;
        },
        editCatLvL3(gparent, parent, index) {
            const gparent_index = this.categories.findIndex(
                (el) => el._id == gparent._id
            );
            const parent_index = this.categories[
                gparent_index
            ].children.findIndex((el) => el._id == parent._id);
            const item = this.categories[gparent_index].children[parent_index]
                .children[index];
            return item;
        },
    },
    created() {
        this.getCategories();
    },
};
</script>
<style lang="stylus">
.itemGroup {
    margin-top: 2px;
    margin-bottom: 2px;
    background-color: #f4f5f9aa;
    overflow: hidden;

    .item {
        background: #bff7fd;
    }

    .itemGroup {
        .item {
            background: #b4f3cd;
        }

        .itemGroup {
            .item {
                background: red;
            }

            .itemGroup {
                .item {
                    background: blue;
                }
            }
        }
    }
}

.tree {
    position: relative;

    .itemGroup {
        padding: 0px;
        max-height: 0;
        z-index: -9;
        transition: max-height 0.5s, padding 0.4s, z-index 0.1s;
    }

    label {
        margin-left: 5px;
        cursor: pointer;
        position: absolute;
        top: 11px;
        right: 10px;
        z-index: 999;
    }

    input:checked ~ .itemGroup {
        max-height: 100vh;
        z-index: 1;
        padding: 5px 15px 5px 0px;
    }
}

.item {
    display: flex;
    justify-content: space-between;
    max-width: 250px;
    padding: 8px 20px 8px 15px;
    background: white;
    font-size: 15px;
    border-radius: 5px;
    margin: 3px;
    overflow: hidden;
    position: relative;

    .options {
        margin-right: 20px;
        position: absolute;
        left: 15px;

        span {
            transition: 0.3s linear;
            opacity: 0;
            margin: 10px;
            cursor: pointer;

            &.m {
                color: red;
            }
        }

        i {
            position: absolute;
            font-style: normal;
        }
    }

    &:hover .options>i {
        opacity: 0;
    }

    &:hover .options>span {
        opacity: 1;
    }
}

.categoriesPage {
    .editStageclass {
        padding: 20px;
        background: white;
        border-radius: 10px;
        position: fixed;
        top: 60px;
        right: 30%;
        display: flex;
        flex-direction: column;
        z-index: 9999;

        i {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;

            &:hover {
                color: red;
            }
        }

        input {
            padding: 5px 10px;
            border: none;
            border-bottom: 1px solid gray;
            margin-bottom: 15px;
        }

        button {
            padding: 8px;
        }

        hr {
            margin: 5px 15px;
        }
    }
}
</style>