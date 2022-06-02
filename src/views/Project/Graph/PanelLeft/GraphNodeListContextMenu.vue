<template>
    <v-menu
        v-model="show"
        :position-x="x"
        :position-y="y"
        absolute
        max-width="160"
    >
        <div class="fci-list">
            <div class="fci-list-item" v-for="(action, idx) in actionList" :key="idx" @click="onAction(action.action)">
                <v-icon small class="mr-2">{{ action.icon }}</v-icon>
                {{ action.name }}
            </div>
        </div>
    </v-menu>
</template>

<script>
import { GRAPH_NODE_LIST_CMA } from '@/utils/const'

export default {
    name: 'GraphNodeListContextMenu',
    data () {
        return {
            GRAPH_NODE_LIST_CMA,
            show: false,
            x: 0,
            y: 0,
            item: null
        }
    },
    computed: {
        actionList () {
            return [
                {
                    name: this.$f.tc('activeNode'),
                    icon: 'mdi-pencil',
                    action: GRAPH_NODE_LIST_CMA.ACTIVE_NODE
                },
                {
                    name: this.$f.tc('createGraphQuery'),
                    icon: 'mdi-database-search',
                    action: GRAPH_NODE_LIST_CMA.CREATE_QUERY
                }
            ]
        }
    },
    methods: {
        open (event, item) {
            this.x = event.x
            this.y = event.y
            this.show = true
            this.item = item
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

<style scoped lang="scss">
@import "src/modules/fptai/assets/css/fci-var";

.fci-list {
    min-width: 180px;
}

.fci-list-group {
    background: $borderColor2;
    color: $textColor3;
    font-size: 12px;
}

.fci-list-item {
    padding: 5px;

    &.active {
        background: $primary3;
        color: $primary1;

        &::v-deep path {
            fill: $primary1;
        }
    }
}
</style>
