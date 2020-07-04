<template>
	<div class="icons_box_wrapper" ref="iconpicker">
		<i class="fas fa-map-marker-alt" @click="togglePicker()"></i>
		<div class="icons_box" :class="displayPicker ? 'show' : '' ">
			<i class="fa fa-search" aria-hidden="true"></i>
			<input type="text" v-model.lazy="search" placeholder="search in icons" v-debounce="500" />
			<transition-group name="flip-list" tag="ul">
				<li v-for="icon in filteredicons" :key="icon" @click="ADD_ICON(icon)">
					<i :class="icon"></i>
				</li>
			</transition-group>
		</div>
	</div>
</template>

<script>
import icons from "@/assets/icons.json";
import debounce from "v-debounce";
export default {
	props: ["index"],
	directives: { debounce },
	data() {
		return {
			displayPicker: false,
			icons,
			search: ""
		};
	},
	computed: {
		filteredicons() {
			const filteredIcons = this.icons.filter(name => {
				const icon = name.toLowerCase();
				const char = this.search.toLowerCase();
				return icon.includes(char);
			});
			return filteredIcons;
		}
	},
	methods: {
		ADD_ICON(name) {
			const data = {
				iconName: name,
				index: this.index
			};
			this.$store.commit("ADD_ICON", data);
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
		}
	}
};
</script>
