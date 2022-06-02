<template>
    <div class="GraphNodeEditor fci-scrollbar">
        <v-layout align-center class="pa-3">
            <template v-if="editName">
                <input class="fci-input" type="text" v-model="model._name" @blur="editName=false; saveNode()">
            </template>
            <template v-else>
                <h3>{{ model._name }}</h3>
                <v-btn icon small @click="editName=true">
                    <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <span class="ml-3">{{ activeNode._key }}</span>
            </template>
            <v-spacer></v-spacer>
            <v-btn icon small @click="deleteNode">
                <img
                        src="/img/graph/delete.svg"
                        alt="icon_delete_node"
                >
            </v-btn>
        </v-layout>
        <!--Entity Type-->
        <div class="block">
            <div class="block-title">{{ $f.tc('entityType') }}</div>
            <input class="fci-input spreadX" v-model="model._entity_type" @blur="saveNode">
        </div>
        <!--Labels-->
        <div class="block">
            <v-layout align-center>
                <span class="block-title">{{ $f.tc('labels') }}</span>
                <v-tooltip left>
                    <template v-slot:activator="props">
                        <img
                                src="/img/graph/info.svg"
                                alt="icon_info_list_label"
                                style="margin-left: 6px"
                                v-on="props.on"
                        >
                    </template>
                    <div>
                        <span class="system-property">{{ $t('tipSystemLabel') }}</span>
                    </div>
                </v-tooltip>
            </v-layout>
            <GraphLabelEditor
                    v-model="model._labels"
                    @save="saveNode"
            ></GraphLabelEditor>
        </div>
        <!--Synonyms-->
        <div class="block">
            <div class="block-title">{{ $f.tc('synonyms') }}</div>
            <GraphLabelEditor
                    v-model="model._synonyms"
                    @save="saveNode"
                    :validate-label="false"
            ></GraphLabelEditor>
        </div>
        <!--User property-->
        <div class="block user-property" v-for="(property, i) in userPropertyList" :key="i">
            <v-layout>
                <input
                        type="text"
                        class="fci-input spreadX mb-3"
                        v-model="property.name"
                        @blur="saveNode"
                >
                <v-btn icon small @click="deleteUserProperty(i)">
                    <v-icon small>mdi-delete</v-icon>
                </v-btn>
            </v-layout>
            <textarea
                    class="fci-input spreadX"
                    v-model="property.value"
                    @blur="saveNode"
            ></textarea>
        </div>
        <div class="block">
            <v-btn small color="primary" @click="addUserProperty">
                <v-icon small class="mr-1">mdi-plus</v-icon>
                {{ $f.tc('property') }}
            </v-btn>
        </div>
        <!--Relationships-->
        <div class="block">
            <div class="d-flex align-center justify-space-between">
                <span class="block-title">{{ $f.tc('relations') }}</span>
                <!--List name tab-->
                <div>
                    <v-tabs
                            class="list-name-tab"
                            v-model="tabs"
                            :hide-slider="true"
                            height="22px"
                            color="white"
                    >
                        <v-tab
                                v-for="item in nameTabs"
                                :key="item"
                        >
                            {{ item }}
                        </v-tab>
                    </v-tabs>
                </div>
            </div>
            <!--Content of tabs-->
            <v-tabs-items v-model="tabs" style="margin-top: 12px">
                <v-tab-item key="All">
                    <table class="table-relation">
                        <tr v-if="outRelationList.length < 1 && inRelationList.length < 1" class="group empty-item">
                            <td>{{ $t('empty') }}</td>
                            <td></td>
                        </tr>
                        <tr v-for="relation in outRelationList" :key="relation._id" @click="goToRelation(relation)">
                            <td class="relation-type">
                                {{ relation.rel._type }}
                                <span>
                                    <img
                                            src="/img/graph/arrow-right.svg"
                                            alt="icon_out_relation"
                                    >
                                </span>
                            </td>
                            <td>
                                {{ getNodeName(relation._to) }}
                            </td>
                        </tr>
                        <tr v-for="relation in inRelationList" :key="relation._id" @click="goToRelation(relation)">
                            <td class="relation-type">
                                 <span>
                                    <img
                                            src="/img/graph/arrow-left.svg"
                                            alt="icon_out_relation"
                                    >
                                </span>
                                {{ relation.rel._type }}
                            </td>
                            <td>
                                {{ getNodeName(relation._from) }}
                            </td>
                        </tr>
                    </table>
                </v-tab-item>
                <v-tab-item key="In">
                    <table class="table-relation">
                        <tr v-if="inRelationList.length < 1" class="group empty-item">
                            <td>{{ $t('empty') }}</td>
                            <td></td>
                        </tr>
                        <tr v-for="relation in inRelationList" :key="relation.id" @click="goToRelation(relation)">
                            <td class="relation-type">
                                <span>
                                    <img
                                            src="/img/graph/arrow-left.svg"
                                            alt="icon_out_relation"
                                    >
                                </span>
                                {{ relation.rel._type }}
                            </td>
                            <td>
                                {{ getNodeName(relation._from) }}
                            </td>
                        </tr>
                    </table>
                </v-tab-item>
                <v-tab-item key="Out">
                    <table class="table-relation">
                        <tr v-if="outRelationList.length < 1" class="group empty-item">
                            <td>{{ $t('empty') }}</td>
                            <td></td>
                        </tr>
                        <tr v-for="relation in outRelationList" :key="relation.id" @click="goToRelation(relation)">
                            <td class="relation-type">
                                {{ relation.rel._type }}
                                <span>
                                    <img
                                            src="/img/graph/arrow-right.svg"
                                            alt="icon_out_relation"
                                    >
                                </span>
                            </td>
                            <td>
                                {{ getNodeName(relation._to) }}
                            </td>
                        </tr>
                    </table>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { GraphNodeService, GraphRelationService } from '@/services/project.service.js'
import { AppEventBusType } from '@/eventbus/app.eventbus'
import GraphLabelEditor from '@/views/Project/Graph/Editor/GraphLabelEditor'
import kbUtils from '@/utils/kbUtils'
import { GraphNodeTemplateService } from '@/services/template.service'

export default {
    name: 'GraphNodeEditor',
    components: {
        GraphLabelEditor
    },
    data () {
        return {
            editName: false,
            model: {
                _name: '',
                _entity_type: '',
                _synonyms: [],
                _labels: []
            },
            userPropertyList: [],
            // relation
            inRelationList: [],
            outRelationList: [],
            nameTabs: ['All', 'In', 'Out'],
            tabs: null
        }
    },
    computed: {
        ...mapState({
            activeNode: state => state.kg.activeNode,
            shouldUpdateNodeRelation: state => state.kg.shouldUpdateActiveNodeRelation,
            mode: state => state.mode
        })
    },
    methods: {
        getNewNode () {
            let node = {}
            for (let i in this.activeNode) {
                if (i.startsWith('_')) {
                    node[i] = this.activeNode[i]
                }
            }
            for (let i in this.model) {
                node[i] = this.model[i]
            }
            for (let property of this.userPropertyList) {
                if (property.name.startsWith('_')) {
                    this.$appService.inform('You can not start a property with _: ' + property.name)
                    return
                }
                if (node[property.name]) {
                    this.$appService.inform('Duplicate property name: ' + property.name)
                    return
                }
                if (property.name) {
                    node[property.name] = property.value
                }
            }
            return node
        },
        saveNode () {
            let node = this.getNewNode()
            if (this.$ut.cov(node, this.activeNode)) {
                return
            }
            this.$store.dispatch(this.$at.kg.UPDATE_NODE, {
                projectId: this.$route.params.projectId,
                id: this.activeNode._key,
                data: node
            })
        },
        deleteNode () {
            let node = this.activeNode
            this.$appService.useEventBus(
                AppEventBusType.CONFIRM,
                this.$f.tc('confirmDelete', { item: node._name })
            ).then(confirm => {
                if (confirm) {
                    this.$store.dispatch(this.$at.kg.DELETE_NODE, {
                        projectId: this.$route.params.projectId,
                        _key: node._key
                    })
                }
            })
        },
        refreshNodeRelationships () {
            let graphNodeService = this.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService
            graphNodeService.getRelationships(
                this.$route.params.projectId,
                this.activeNode._key
            ).then(result => {
                this.inRelationList = result.data.in_relationships
                this.outRelationList = result.data.out_relationships
            })
        },
        goToRelation (relation) {
            GraphRelationService.read(this.$route.params.projectId, relation.rel._key).then(result => {
                this.$store.dispatch(this.$at.kg.ACTIVE_ITEM, result.data)
            })
        },
        getNodeName (node) {
            return kbUtils.getNodeName(node)
        },
        addUserProperty () {
            this.userPropertyList.push({
                name: '',
                value: ''
            })
        },
        deleteUserProperty (i) {
            this.userPropertyList.splice(i, 1)
            this.saveNode()
        }
    },
    watch: {
        activeNode: {
            immediate: true,
            handler: function (newVal, oldVal) {
                if (this.$ut.cov(newVal, oldVal)) {
                    return
                }
                if (this.activeNode) {
                    let activeNode = this.activeNode
                    let systemPropertyList = []
                    let userPropertyList = []
                    for (let i in activeNode) {
                        if (this.model[i] !== undefined) {
                            this.model[i] = activeNode[i]
                        }
                        if (i.startsWith('_')) {
                            systemPropertyList.push({
                                name: i,
                                value: activeNode[i]
                            })
                        } else {
                            userPropertyList.push({
                                name: i,
                                value: activeNode[i]
                            })
                        }
                    }
                    this.userPropertyList = userPropertyList
                    this.refreshNodeRelationships()
                }
            }
        },
        shouldUpdateNodeRelation: 'refreshNodeRelationships'
    }
}
</script>

<style scoped lang="scss">
$containerBackground: #FFF;

.GraphNodeEditor {
  background: $containerBackground;
  height: 100%;
  overflow: auto;

  .block {
    padding: 5px 12px 12px 12px;
    border-top: 1px solid #F0F0F0;

    &.user-property input {
      font-weight: bold;
    }
  }

  .table-property {
    width: 100%;
  }

  .system-property {
    color: #0052cc;
  }

  .v-tab {
    padding: 0 16px;
    text-transform: none;
    font-size: 14px;
    border: 1px solid #D9D9D9;
    text-align: center;
    min-width: 10px !important;
    font-weight: 400;

    &:first-child {
      border-radius: 5px 0px 0px 5px;
    }

    &:nth-child(2) {
      border-left: none;
      border-right: none;
    }
    &:last-child {
      border-radius: 0px 5px 5px 0px;
    }
  }

  .v-tab--active {
    background-color: #0052CC;
    border: 1px solid #0052CC;
  }

  .v-tab:not(.v-tab--active) {
    color: #262626 !important;
  }

  table {
    border-spacing: 0;
    font-size: 12px;
  }
}

.table-relation {
  border-collapse: collapse;
  width: 100%;

  tr:not(.group) {
    cursor: pointer;

    &:hover {
      background: #E6F4FF;
    }
  }

  tr td {
    width: 33%;
    padding: 5px 12px;

    &:last-child {
      text-align: right;
    }
  }

  tr.empty-item td {
    color: rgba(0, 0, 0, 0.2);
    user-select: none;
  }
}

.block-title {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
}
</style>
