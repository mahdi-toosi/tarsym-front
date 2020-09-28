<template>
    <div dir="rtl" class="categoriesPage">
        <button
            class="btn btn-blue"
            @click="SET_TO_EDIT_STAGE(addNewProperties)"
        >
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

        <Category-row
            v-for="Cat in rootData.categories.tree"
            :key="Cat._id"
            :Cat="Cat"
            :father="null"
        />

        <button
            class="item pasteOnRoot"
            v-if="rootData.movecat._id"
            @click="pasteOnRoot()"
        >
            <i class="fas fa-paste"></i>
        </button>
        <div
            class="editStageclass"
            :class="rootData.editStage.show ? 'showEditStage' : ''"
        >
            <i
                class="fas fa-times"
                @click="rootData.editStage.show = false"
            ></i>
            <input
                type="text"
                v-model="rootData.editStage.item.name"
                maxlength="28"
            />
            <button class="btn btn-green" @click="saveTheStage()">ذخیره</button>
            <hr v-if="rootData.editStage.item._id" />
            <button
                class="btn btn-red"
                v-if="rootData.editStage.item._id"
                @click="deleteCategory()"
            >
                حذف
            </button>
        </div>
    </div>
</template>

<script>
import CategoryRow from "./CategoryRow";
import { mapMutations, mapActions } from "vuex";

const url = "/taxonomies/";

export default {
    name: "editCategories",
    components: { CategoryRow },
    data() {
        return {
            expandSituation: false,
            addNewProperties: {
                Cat: {
                    name: "",
                    type: 1,
                },
                father: null,
                update: false,
            },
        };
    },
    computed: {
        rootData() {
            return this.$store.state.profilePage.categoriesPage;
        },
    },
    methods: {
        ...mapMutations(["pasteCat", "cutCat"]),
        ...mapActions(["GetCategories", "AddNewCat", "UpdateCat"]),

        saveTheStage() {
            if (this.rootData.editStage.father !== undefined) {
                this.AddNewCat();
                return;
            }
            this.UpdateCat();
        },
        async deleteCategory() {
            const item = this.editStage.item;
            this.$axios
                .delete(url + item._id)
                .then(async () => {
                    await this.GetCategories();
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
    async created() {
        await this.GetCategories();
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

    .name {
        position: absolute;
        left: 8px;
        width: 50px;
        text-align: left;
    }

    &:hover .name {
        display: none;
    }

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
            font-style: normal;
            left: unset;
            width: 16px;
            transition: 0.3s;

            &:hover {
                color: #4be179;
            }
        }
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