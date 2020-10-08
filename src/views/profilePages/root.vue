<template>
    <router-view></router-view>
</template>

<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState(["user"]),
    },
    mounted() {
        // console.log("root => user", this.user);
    },
};
</script>

<style>
</style>