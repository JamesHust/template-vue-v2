<template>
    <v-menu
        v-model="show"
        :position-x="x"
        :position-y="y"
        absolute
    >
        <div class="fci-list">
            <div
                v-for="action in actionList"
                :key="action.name"
                class="fci-list-item"
                @click="onAction(action.action)"
            >
                <v-icon small class="mr-2">{{ action.icon }}</v-icon>
                {{ action.name }}
            </div>
        </div>
    </v-menu>
</template>

<script>
import { GRAPH_VISUAL_CMA } from '@/utils/const'

export default {
    name: 'GraphVisualContextMenu',
    data () {
        return {
            show: false,
            x: 0,
            y: 0,
            item: null,
            graphType: null
        }
    },
    computed: {
        actionList () {
            let actions = [
                {
                    name: this.$f.tc('expand'),
                    icon: 'mdi-arrow-expand-up',
                    action: GRAPH_VISUAL_CMA.EXPAND
                },
                {
                    name: this.$f.tc('activeNode'),
                    icon: 'mdi-pencil',
                    action: GRAPH_VISUAL_CMA.EDIT_NODE
                },
                {
                    name: this.$f.tc('relation'),
                    icon: 'mdi-plus',
                    action: GRAPH_VISUAL_CMA.ADD_RELATION_TO
                },
                {
                    name: this.$f.tc('hyperedge'),
                    icon: 'mdi-plus',
                    action: GRAPH_VISUAL_CMA.ADD_HYPEREDGE
                },
                {
                    name: this.$f.tc('clone'),
                    icon: 'mdi-content-copy',
                    action: GRAPH_VISUAL_CMA.CLONE_NODE
                },
                {
                    name: this.$f.tc('delete'),
                    icon: 'mdi-delete-outline',
                    action: GRAPH_VISUAL_CMA.DELETE
                }
            ]
            if (this.item) {
                actions = this.item.data._hyperedge ? actions.filter(i => i.action !== GRAPH_VISUAL_CMA.ADD_HYPEREDGE) : actions
            }
            return actions
        }
    },
    methods: {
        open (event, item, graphType) {
            this.x = event.x
            this.y = event.y
            this.show = true
            this.item = item
            this.graphType = graphType
        },
        close () {
            this.show = false
        },
        onAction (actionName) {
            this.$emit('action', {
                name: actionName,
                item: this.item
            })
        }
    }
}
</script>

<style scoped>

</style>
