  <template>
    <div class="auth">
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
export default {};
</script>

<style lang="stylus">
// *  vue router animation
.fade-enter-active, .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
}

.fade-enter, .fade-leave-active {
    opacity: 0;
}
</style>