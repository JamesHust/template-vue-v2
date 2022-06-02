<template>
    <div class="GraphHyperEdgeEditor">
        <v-layout align-center class="pa-3">
            <h3>{{ this.activeNode._id }}</h3>
            <v-spacer></v-spacer>
            <v-btn icon small @click="deleteNode">
                <img src="/img/graph/delete.svg" alt="icon_delete_node">
            </v-btn>
        </v-layout>
<!--        <div class="block">-->
<!--            <v-layout align-center class="px-3 pb-3">-->
<!--                <h3>{{ $f.tc('relations') }}</h3>-->
<!--                <v-spacer></v-spacer>-->
<!--                <FciTabs :items="relationTabList" v-model="tab"></FciTabs>-->
<!--            </v-layout>-->
<!--            <table class="table-relation">-->
<!--                <tr v-if="shouldShowEmpty" class="group empty-item">-->
<!--                    <td colspan="2">{{ $t('empty') }}</td>-->
<!--                </tr>-->
<!--                <template v-if="tab === 'All' || tab === 'Out'">-->
<!--                    <tr v-for="relation in outRelationList" :key="relation._id" @click="goToRelation(relation)">-->
<!--                        <td class="relation-type">-->
<!--                            {{ relation.rel._type }}-->
<!--                            <span>-->
<!--                                <img-->
<!--                                        src="/img/graph/arrow-right.svg"-->
<!--                                        alt="icon_out_relation"-->
<!--                                >-->
<!--                            </span>-->
<!--                        </td>-->
<!--                        <td>-->
<!--                            {{ getNodeName(relation._to) }}-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                </template>-->
<!--                <template v-if="tab === 'All' || tab === 'In'">-->
<!--                    <tr v-for="relation in inRelationList" :key="relation._id" @click="goToRelation(relation)">-->
<!--                        <td class="relation-type">-->
<!--                             <span>-->
<!--                                <img-->
<!--                                        src="/img/graph/arrow-left.svg"-->
<!--                                        alt="icon_out_relation"-->
<!--                                >-->
<!--                            </span>-->
<!--                            {{ relation.rel._type }}-->
<!--                        </td>-->
<!--                        <td>-->
<!--                            {{ getNodeName(relation._from) }}-->
<!--                        </td>-->
<!--                    </tr>-->
<!--                </template>-->
<!--            </table>-->
<!--        </div>-->
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
import { AppEventBusType } from '@/eventbus/app.eventbus'
import { mapState } from 'vuex'
import { GraphNodeService, GraphRelationService } from '@/services/project.service'
import kbUtils from '@/utils/kbUtils'
// import FciTabs from '@/modules/fptai/components/fci/FciTabs'
import { GraphNodeTemplateService } from '@/services/template.service'

export default {
    name: 'GraphHyperEdgeEditor',
    // components: { FciTabs },
    data () {
        return {
            // relation
            inRelationList: [],
            outRelationList: [],
            tab: 'All',
            relationTabList: [
                {
                    text: 'All',
                    value: 'All'
                }, {
                    text: 'In',
                    value: 'In'
                }, {
                    text: 'Out',
                    value: 'Out'
                }
            ],
            nameTabs: ['All', 'In', 'Out'],
            tabs: null
        }
    },
    computed: {
        ...mapState({
            activeNode: state => state.kg.activeNode,
            shouldUpdateNodeRelation: state => state.kg.shouldUpdateActiveNodeRelation,
            mode: state => state.mode
        }),
        shouldShowEmpty () {
            if (this.tab === 'All') {
                return this.inRelationList.length < 1 && this.outRelationList.length < 1
            } else if (this.tab === 'In') {
                return this.inRelationList.length < 1
            } else {
                return this.outRelationList.length < 1
            }
        }
    },
    methods: {
        refreshNodeRelationships () {
            let graphNodeService = this.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService
            graphNodeService.getRelationships(
                this.$route.params.projectId,
                this.activeNode._key
            ).then(result => {
                this.inRelationList = result.data.in_relationships ? result.data.in_relationships : []
                this.outRelationList = result.data.out_relationships ? result.data.out_relationships : []
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
        deleteNode () {
            this.$appService.useEventBus(
                AppEventBusType.CONFIRM,
                this.$f.tc('confirmDelete', { item: this.activeNode._id })
            ).then(confirm => {
                if (confirm) {
                    this.$store.dispatch(this.$at.kg.DELETE_NODE, {
                        projectId: this.$route.params.projectId,
                        _key: this.activeNode._key
                    })
                }
            })
        }
    },
    watch: {
        shouldUpdateNodeRelation: 'refreshNodeRelationships',
        activeNode: {
            immediate: true,
            handler: function () {
                this.refreshNodeRelationships()
            }
        }
    }
}
</script>

<style scoped lang="scss">
.GraphHyperEdgeEditor {
  .block {
    padding: 12px 0;
    box-shadow: 0 1px 0 #F0F0F0;
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
