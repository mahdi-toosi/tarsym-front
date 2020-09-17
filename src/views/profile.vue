<template>
    <div>
        <div></div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState(["user"]),
    },
    mounted() {
        console.log("\n => user", this.user);
    },
};
</script>

<style>
</style>