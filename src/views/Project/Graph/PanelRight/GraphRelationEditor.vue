<template>
    <div class="GraphRelationEditor fci-scrollbar">
        <v-layout align-center class="pa-3">
            <Icon name="FlowChartTo" style="margin-right: 5px"></Icon>
            <h3>{{ activeRelation._type }}</h3>
            <v-spacer></v-spacer>
            <v-btn icon small @click="deleteRelation">
                <v-icon small>mdi-delete</v-icon>
            </v-btn>
        </v-layout>
        <div class="block">
            <table class="table-relation">
                <tr>
                    <td>{{ $f.tc('type') }}</td>
                    <td>{{ activeRelation._type }}</td>
                </tr>
                <tr>
                    <td>Id</td>
                    <td>{{ activeRelation._id }}</td>
                </tr>
                <tr class="clickable" @click="goToNode(activeRelation._from)">
                    <td>{{ $f.tc('from') }}</td>
                    <td>{{ startNodeName }}</td>
                </tr>
                <tr class="clickable" @click="goToNode(activeRelation._to)">
                    <td>{{ $f.tc('to') }}</td>
                    <td>{{ endNodeName }}</td>
                </tr>
            </table>
        </div>
        <!--User property-->
        <div class="block user-property" v-for="(property, i) in userPropertyList" :key="i">
            <v-layout>
                <input
                    type="text"
                    class="fci-input spreadX mb-3"
                    v-model="property.name"
                    @blur="saveRelation"
                >
                <v-btn icon small @click="deleteUserProperty(i)">
                    <v-icon small>mdi-delete</v-icon>
                </v-btn>
            </v-layout>
            <textarea
                class="fci-input spreadX"
                v-model="property.value"
                @blur="saveRelation"
            ></textarea>
        </div>
        <div class="block">
            <v-btn small color="primary" @click="addUserProperty">
                <v-icon small class="mr-1">mdi-plus</v-icon>
                {{ $f.tc('property') }}
            </v-btn>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { AppEventBusType } from '@/eventbus/app.eventbus'
import Icon from '@/components/icons/Icon'
import kbUtils from '@/utils/kbUtils'

export default {
    name: 'GraphRelationEditor',
    components: {
        Icon
    },
    data () {
        return {
            startNodeName: '',
            endNodeName: '',
            userPropertyList: []
        }
    },
    computed: {
        ...mapState({
            activeRelation: state => state.kg.activeRelation
        })
    },
    methods: {
        getNewRelation () {
            let relation = {}
            for (let i in this.activeRelation) {
                if (i.startsWith('_')) {
                    relation[i] = this.activeRelation[i]
                }
            }
            for (let property of this.userPropertyList) {
                if (property.name.startsWith('_')) {
                    this.$appService.inform('You can not start a property with _: ' + property.name)
                    return
                }
                if (relation[property.name]) {
                    this.$appService.inform('Duplicate property name: ' + property.name)
                    return
                }
                if (property.name) {
                    relation[property.name] = property.value
                }
            }
            return relation
        },
        saveRelation () {
            let relation = this.getNewRelation()
            if (this.$ut.cov(this.activeRelation, relation)) {
                return
            }
            this.$store.dispatch(this.$at.kg.UPDATE_RELATION, {
                projectId: this.$route.params.projectId,
                id: this.activeRelation._key,
                data: relation
            })
        },
        deleteRelation () {
            let activeRelation = this.activeRelation
            let nodeList = this.$store.state.kg.nodeList
            let startNodeName = kbUtils.getNodeName(nodeList.find(node => node._id === activeRelation._from))
            let endNodeName = kbUtils.getNodeName(nodeList.find(node => node._id === activeRelation._to))
            this.$appService.useEventBus(
                AppEventBusType.CONFIRM,
                this.$f.tc('confirmDelete', {
                    item: `${startNodeName} ${activeRelation.type} ${endNodeName}`
                })
            ).then(confirm => {
                if (confirm) {
                    this.$store.dispatch(this.$at.kg.DELETE_RELATION, {
                        projectId: this.$route.params.projectId,
                        relation: activeRelation
                    })
                }
            })
        },
        goToNode (id) {
            let node = this.$store.state.kg.nodeList.find(node => node._id === id)
            if (node) {
                this.$store.dispatch(this.$at.kg.ACTIVE_ITEM, node)
            }
        },
        addUserProperty () {
            this.userPropertyList.push({
                name: '',
                value: ''
            })
        },
        deleteUserProperty (i) {
            this.userPropertyList.splice(i, 1)
            this.saveRelation()
        }
    },
    watch: {
        activeRelation: {
            immediate: true,
            handler: function (newVal, oldVal) {
                if (this.$ut.cov(newVal, oldVal)) {
                    return
                }
                let activeRelation = this.activeRelation
                let nodeList = this.$store.state.kg.nodeList
                this.startNodeName = kbUtils.getNodeName(nodeList.find(node => node._id === activeRelation._from))
                this.endNodeName = kbUtils.getNodeName(nodeList.find(node => node._id === activeRelation._to))
                let userPropertyList = []
                for (let i in activeRelation) {
                    if (!i.startsWith('_')) {
                        userPropertyList.push({
                            name: i,
                            value: activeRelation[i]
                        })
                    }
                }
                this.userPropertyList = userPropertyList
            }
        }
    }
}
</script>

<style scoped lang="scss">
$containerBackground: #FFF;

.GraphRelationEditor {
    background: $containerBackground;
    height: 100%;
    overflow: auto;
}

.block {
    padding: 5px 12px 12px 12px;
    border-top: 1px solid #F0F0F0;

    &.user-property input {
        font-weight: bold;
    }
}

.table-relation {
    width: 100%;
    border-collapse: collapse;

    tr td:first-child {
        padding-left: 5px;
    }
}

.table-property {
    width: 100%;
}

.system-property {
    color: #0052cc;
}

.clickable {
    cursor: pointer;

    &:hover {
        background: #f6f6f6;
    }
}
</style>
