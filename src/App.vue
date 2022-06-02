<template>
    <v-app>
        <router-view/>
        <AppServiceView></AppServiceView>
    </v-app>
</template>

<style lang="scss">
    html {
        overflow: auto !important;
    }
</style>
<script>
import AppServiceView from '@/components/AppServiceView'

export default {
    components: { AppServiceView }
}
</script>
