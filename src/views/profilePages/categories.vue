<template>
    <div dir="rtl" class="categoriesPage">
        <button class="btn btn-blue" @click="AddChild()">
            ایجاد دسته بندی جدید
            <i class="fas fa-plus"></i>
        </button>
        <button
            class="btn btn-green expandButton"
            @click="expandSituation ? expandAllCats(false) : expandAllCats()"
        >
            <i
                class="fas fa-angle-left"
                style="transition: 0.3s"
                :style="{
                    transform: `rotate(${expandSituation ? -90 : 0}deg)`,
                }"
            ></i>
        </button>
        <!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! level One !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
        <div
            v-for="(grandpa, index) in categories"
            :key="grandpa._id"
            class="tree"
        >
            <label :for="grandpa._id">
                <i class="fas fa-angle-left" v-if="grandpa.children.length"></i>
                {{ grandpa.name }}
            </label>
            <input
                type="checkbox"
                :id="grandpa._id"
                v-if="grandpa.children.length"
                hidden
            />
            <div class="item">
                <div class="options">
                    <i>{{ grandpa.documents.length }} سند</i>
                    <span
                        @click="AddChild(grandpa, index)"
                        v-if="grandpa.name !== uncategorized"
                    >
                        <i class="fas fa-plus"></i>
                    </span>
                    <span
                        @click="setToEditStage(index)"
                        v-if="grandpa.name !== uncategorized"
                    >
                        <i class="fas fa-edit"></i>
                    </span>
                    <span
                        @click="pasteCatlvl1(index)"
                        v-if="movecat._id && grandpa.name !== uncategorized"
                    >
                        <i class="fas fa-paste"></i>
                    </span>
                    <span
                        @click="cutCatlvl1(index)"
                        v-if="!movecat._id && grandpa.name !== uncategorized"
                    >
                        <i class="fas fa-cut"></i>
                    </span>
                </div>
            </div>
            <div v-if="grandpa.children.length" class="itemGroup">
                <!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! level TWO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
                <div
                    v-for="(parent, index) in grandpa.children"
                    :key="parent.id"
                    class="tree"
                >
                    <label :for="parent._id" v-if="parent.children.length">
                        <i class="fas fa-angle-left"></i>
                    </label>
                    <input
                        type="checkbox"
                        :id="parent._id"
                        hidden
                        v-if="parent.children.length"
                    />
                    <div class="item">
                        <div>{{ parent.name }}</div>
                        <div class="options">
                            <i>{{ parent.documents.length }} سند</i>
                            <span @click="AddChild(parent, index, grandpa)">
                                <i class="fas fa-plus"></i>
                            </span>
                            <span @click="setToEditStage(index, grandpa)">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span
                                @click="pasteCatlvl2(index, grandpa)"
                                v-if="movecat._id"
                            >
                                <i class="fas fa-paste"></i>
                            </span>
                            <span @click="cutCatlvl2(index, grandpa)" v-else>
                                <i class="fas fa-cut"></i>
                            </span>
                        </div>
                    </div>
                    <div v-if="parent.children.length" class="itemGroup">
                        <!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! level Three !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
                        <div
                            v-for="(child, index) in parent.children"
                            :key="child.id"
                            class="tree"
                        >
                            <label
                                :for="child._id"
                                v-if="child.children.length"
                            >
                                <i class="fas fa-angle-left"></i>
                            </label>
                            <input
                                type="checkbox"
                                :id="child._id"
                                hidden
                                v-if="child.children.length"
                            />
                            <div class="item">
                                <div>{{ child.name }}</div>
                                <div class="options">
                                    <i>{{ child.documents.length }} سند</i>
                                    <span
                                        @click="
                                            setToEditStage(
                                                index,
                                                parent,
                                                grandpa
                                            )
                                        "
                                    >
                                        <i class="fas fa-edit"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! level Three END!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
                    </div>
                </div>
                <!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! level Two END!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
            </div>
        </div>
        <!--  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! level One END!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->

        <button
            class="item pasteOnRoot"
            v-if="movecat._id"
            @click="pasteOnRoot()"
        >
            <i class="fas fa-paste"></i>
        </button>
        <div
            class="editStageclass"
            :class="editStage.show ? 'showEditStage' : ''"
        >
            <i class="fas fa-times" @click="editStage.show = false"></i>
            <input type="text" v-model="editStage.item.name" maxlength="28" />
            <button class="btn btn-green" @click="saveTheStage()">ذخیره</button>
            <hr v-if="editStage.item._id" />
            <button
                class="btn btn-red"
                v-if="editStage.item._id"
                @click="deleteCategory()"
            >
                حذف
            </button>
        </div>
    </div>
</template>

<script>
const url = "/taxonomies/";

export default {
    name: "editCategories",
    data() {
        return {
            categories: [],
            editStage: { item: {}, show: false },
            expandSituation: false,
            movecat: {},
            uncategorized: "بدون دسته بندی",
        };
    },
    methods: {
        getCategories() {
            const options = {
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
        AddChild(parent_obj, index, parent, gparent) {
            const emptyCat = {
                name: "",
                type: 1,
            };
            this.editStage = {
                show: true,
                item: emptyCat,
                relations: { index, parent, gparent },
                parent: parent_obj || null,
            };
        },
        setToEditStage(index, parent, gparent) {
            const item = this.find_Item(gparent, parent, index);
            this.editStage = {
                show: true,
                item: { ...item },
                relations: { index, parent, gparent },
            };
        },
        async AddNewCat() {
            const parent = this.editStage.parent;
            await this.$axios
                .post(url, this.editStage.item)
                .then(async ({ data }) => {
                    if (parent) {
                        const edited_data = {
                            childs: [...parent.childs, data._id],
                        };
                        await this.$axios.patch(url + parent._id, edited_data);
                    }
                    // * show the new cat if parent unexpanded
                    document.getElementById(parent._id).checked = true;
                    // * hide the editStage box
                    this.editStage.show = false;
                    setTimeout(() => {
                        this.editStage.item = {};
                    }, 1000);
                    // * refresh categories
                    this.getCategories();
                })
                .catch((error) =>
                    this.$store.dispatch("handleAxiosError", error)
                );
        },
        updateCat() {
            const new_item = this.editStage.item;
            this.$axios
                .put(url + new_item._id, new_item)
                .then(({ data, status }) => {
                    if (status == 200) {
                        const rel = this.editStage.relations;
                        const old_item = this.find_Item(
                            rel.gparent,
                            rel.parent,
                            rel.index
                        );
                        old_item.name = data.name;
                    }
                })
                .catch((error) =>
                    this.$store.dispatch("handleAxiosError", error)
                );
            // * hide the editStage box
            this.editStage.show = false;
            setTimeout(() => {
                this.editStage.item = {};
            }, 1000);
        },
        saveTheStage() {
            if (this.editStage.parent !== undefined) {
                this.AddNewCat();
                return;
            }
            this.updateCat();
        },
        deleteCategory() {
            const item = this.editStage.item;
            this.$axios
                .delete(url + item._id)
                .then(() => {
                    this.getCategories();
                })
                .catch((error) =>
                    this.$store.dispatch("handleAxiosError", error)
                );
            this.editStage.show = false;
            setTimeout(() => {
                this.editStage.item = {};
            }, 1000);
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
        cutCatlvl1(index) {
            this.movecat = this.categories[index];
            this.categories.splice(index, 1);
        },
        cutCatlvl2(index, parent) {
            this.movecat = this.find_Item(undefined, parent, index);
            const father_index = this.categories.findIndex(
                (el) => el._id == parent._id
            );
            this.categories[father_index].children.splice(index, 1);
        },
        pasteCatlvl1(index) {
            const newChild = this.movecat;
            if (findCounterDepth(newChild) < 2) {
                const father = this.categories[index];
                father.children.push(newChild);
                this.movecat = {};
                return;
            }
            this.$toasted.error(
                "جا به جایی امکان پذیر نیست، در صورت جا به جایی کتگوری از 3 سطح بیشترمیشود  ..."
            );
        },
        pasteCatlvl2(index, parent) {
            const newChild = this.movecat;
            if (findCounterDepth(newChild) < 1) {
                const father = this.find_Item(undefined, parent, index);
                father.children.push(newChild);
                this.movecat = {};
                return;
            }
            this.$toasted.error(
                "جا به جایی امکان پذیر نیست، در صورت جا به جایی کتگوری از 3 سطح بیشترمیشود  ..."
            );
        },
        pasteOnRoot() {
            const newChild = this.movecat;
            this.categories.push(newChild);
            this.movecat = {};
        },
        expandAllCats(situation = true) {
            const checkboxes = document.querySelectorAll("[type='checkbox']");
            checkboxes.forEach((el) => (el.checked = situation));
            this.expandSituation = !this.expandSituation;
        },
    },
    created() {
        this.getCategories();
    },
};

function findCounterDepth(counter) {
    var maxDepth = 0;
    var leafCount = 0; // add a leaf counter

    counter.children.forEach(function (algo) {
        leafCount = 0; // zero leaf count per algorithm object
        findParamListDepth(algo.children, 0);
        algo.dataLeafCount = leafCount; // store as "dataLeafCount" property
    });

    function findParamListDepth(children, depth) {
        ++depth;
        children.forEach(function (paramObj) {
            var child = paramObj.children;
            if (child) {
                findParamListDepth(child, depth);
                return;
            }
            ++leafCount; // it doesn't have children, increment leaf count;
        });
        maxDepth = Math.max(maxDepth, depth);
    }
    return maxDepth;
}
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
        font-size: 15px;
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
    min-height: 20px;

    .options {
        margin-right: 20px;
        position: absolute;
        left: 15px;

        span {
            transition: 0.3s linear;
            opacity: 0;
            margin: 10px;
            cursor: pointer;
        }

        i {
            position: absolute;
            left: 5px;
            width: 50px;
            text-align: left;
        }

        .fas {
            position: absolute;
            font-style: normal;
            left: unset;
            width: 16px;
            transition: 0.3s;

            &:hover {
                color: #4be179;
            }
        }
    }

    &:hover .options>i {
        display: none;
    }

    &:hover .options>span {
        opacity: 1;
    }
}

.categoriesPage {
    > button {
        margin: 15px;
    }

    .editStageclass {
        padding: 20px;
        background: white;
        border-radius: 10px;
        position: fixed;
        top: 60px;
        right: 30%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: -1;
        clip-path: circle(0% at 100% 3%);
        transition: all 0.5s ease-in-out;
        box-shadow: #747474ab 0px 2px 12px 0px;

        &.showEditStage {
            z-index: 99999;
            clip-path: circle(100%);
        }

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

        button:last-of-type {
            width: 50%;
            margin: 0 auto;
        }

        hr {
            margin: 5px 15px;
        }
    }

    .pasteOnRoot {
        width: 170px;
        padding: 8px 20px 8px 15px;
        background: #fff;
        margin: 3px 30px;
        cursor: pointer;

        i {
            margin: 0 auto;
        }
    }
}
</style>