<template>
    <div class="icons_box_wrapper" ref="iconpicker">
        <i
            :class="tool.iconName || 'fas fa-map-marker-alt'"
            :style="{
                color: tool.iconName
                    ? tool.secondaryColor.hex8 || tool.secondaryColor
                    : '#277696',
            }"
            @click="togglePicker()"
        />
        <div class="icons_box" :class="displayPicker ? 'show' : ''">
            <i
                class="fa fa-search"
                aria-hidden="true"
                style="position: relative; left: -16px"
            />
            <input
                type="text"
                v-model.lazy="search"
                placeholder="search in icons"
                v-debounce="500"
            />
            <ul>
                <li @click="REMOVE_ICON()">
                    <i class="fas fa-map-marker-alt" style="color: #277696"></i>
                </li>
                <!-- <transition-group name="flip-list"> -->
                <li
                    v-for="icon in filteredicons"
                    :key="icon"
                    @click="ADD_ICON(icon)"
                >
                    <i :class="icon" />
                </li>
                <!-- </transition-group> -->
            </ul>
        </div>
    </div>
</template>

<script>
import icons from "@/assets/icons.json";
import debounce from "v-debounce";
export default {
    props: ["index", "tool"],
    directives: { debounce },
    data() {
        return {
            displayPicker: false,
            icons,
            search: "",
        };
    },
    computed: {
        filteredicons() {
            const searchedCharacters = this.search.toLowerCase();
            const filteredIcons = this.icons.filter((iconName) =>
                iconName.includes(searchedCharacters)
            );
            return filteredIcons;
        },
    },
    methods: {
        ADD_ICON(name) {
            const data = {
                iconName: name,
                index: this.index,
            };
            this.$store.commit("ADD_ICON", data);
            this.hidePicker();
        },
        REMOVE_ICON() {
            this.$store.commit("REMOVE_ICON", this.index);
            this.hidePicker();
        },
        showPicker() {
            document.addEventListener("click", this.documentClick);
            this.displayPicker = true;
        },
        hidePicker() {
            document.removeEventListener("click", this.documentClick);
            this.displayPicker = false;
        },
        togglePicker() {
            this.displayPicker ? this.hidePicker() : this.showPicker();
        },
        documentClick(e) {
            var el = this.$refs.iconpicker,
                target = e.target;
            if (el !== target && !el.contains(target)) {
                this.hidePicker();
            }
        },
    },
};
</script>
