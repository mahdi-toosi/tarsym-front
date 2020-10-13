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

// * END vue router animation
.registrationForm input, .registrationForm button {
    display: block;
    margin: 20px auto;
    text-align: left;
    border-radius: 3px;
    direction: ltr;
}

.auth {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    input, a, button {
        display: block;
        margin: 20px auto;
        text-align: left;
        border-radius: 3px;
        direction: ltr;
    }

    a {
        text-align: right;
    }

    input[type='text'], input[type='password'] {
        text-align: right;
        direction: rtl;
        border-radius: 0;
        background: transparent;
        border: none;
        border-bottom: 2px solid #cacaca;
        line-height: 1.5;
        padding: 3px 10px;
    }

    h1 {
        margin: 2.5rem;
    }
}
</style>