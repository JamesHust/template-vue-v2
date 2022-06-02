<template>
    <v-dialog v-model="show" height="800" max-width="1000" no-click-animation>
        <v-card>
            <json-viewer
                :expand-depth="5"
                :value="data"
                boxed
                copyable
                sort
            ></json-viewer>
        </v-card>
    </v-dialog>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
import DialogMixin from "@/modules/fptai/mixins/DialogMixin";

export default {
    name: "JSONViewer",
    components: { JsonViewer },
    mixins: [DialogMixin],
    data () {
        return {
            data: {},
        }
    },
    methods: {
        open (item) {
            this.data = item
            this.show = true
        }
    }
}
</script>

<style scoped>
</style>
