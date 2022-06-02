<template>
    <div class="not-found display-1">
        <div>
            Page not found <br>
            <v-btn color="primary" to="/">Back to home</v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>

<style scoped>
    .not-found {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
