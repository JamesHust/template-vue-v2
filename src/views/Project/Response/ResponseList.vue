<template>
    <div class="Response pa-3 fci-page fci-scrollbar">
        <div class="d-flex align-center " style="margin-bottom: 10px">
            <div style="font-weight: 600; font-size: 24px">{{ $f.tc('responses') }}</div>
            <FciTabs
                    v-if="2 < 1"
                    :items="viewTypeList"
                    v-model="viewType"
                    :item-width="60"
                    class="ml-3"
            ></FciTabs>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="manageGroup" class="btn-custom" style="margin: 0 10px 0 0 !important;">
                <img
                        src="/img/kb/manage_group.svg"
                        alt="icon_manage_group"
                        style="margin-right: 6px; transform: scale(0.9)"
                >
                {{ $f.tc('manageGroup') }}
            </v-btn>
            <v-btn color="primary" @click="createItem" class="btn-custom" style="margin: 0 !important;">
                <img
                        src="/img/kb/add_item_white.svg"
                        alt="icon_add_response"
                        style="margin-right: 6px; transform: scale(1.1)"
                >
                {{ $f.tc('addResponse') }}
            </v-btn>
        </div>
        <v-layout wrap>
            <div style="width: 350px; margin: 10px 10px 10px 0">
                <v-autocomplete
                        outlined dense hide-details clearable
                        :label="$f.tc('intent')"
                        v-model="filter.intent"
                        :items="intents"
                        item-text="name"
                        item-value="id"
                        @input="search"
                ></v-autocomplete>
            </div>
            <div style="width: 350px; margin: 10px 10px 10px 0">
                <v-text-field
                        outlined dense hide-details
                        :label="$f.tc('answerOrDescription')"
                        v-model="filter.search"
                ></v-text-field>
            </div>
            <v-btn color="primary" class="btn-custom" style="text-transform: capitalize !important;" @click="search">
                {{ $t('search') }}
            </v-btn>
        </v-layout>
        <v-data-table
                :headers="commonHeaders"
                :items="intentsResponse"
                :loading="loadingDataTable"
                :expanded.sync="expanded"
                :hide-default-footer="true"
                item-key="intent_name"
                @click:row="toggleRow"
                show-expand
                disable-pagination
                v-if="viewType === ViewType.TABLE"
        >
            <template v-slot:expanded-item="props">
                <td :colspan="props.headers.length"
                    style="padding: 0 !important; background: #F5F5F5;">
                    <v-data-table
                            :headers="innerHeaders"
                            :items="props.item.list_item"
                            :hide-default-footer="true"
                            @click:row="activeRowInnerTable"
                            :item-class="rowActivedClass"
                            disable-pagination
                            class="table-inner"
                            :style="[navigation ? {'width': 'calc(100vw - 292px)'} : {'width': 'calc(100vw - 36px)'}]"
                    >
                        <template v-slot:item.action="props">
                            <div class="d-flex align-center">
                                <div class="d-flex flex-column align-center fixed-column">
                                    <v-btn icon small @click="moveItem(props.item, true)" style="margin-bottom: 2px">
                                        <v-icon size="22" color="#595959">mdi-chevron-up</v-icon>
                                    </v-btn>
                                    <span class="order-text" style="padding: 2px 6px; background: #F0F0F0; border-radius: 3px;">{{
                                            props.index + 1
                                        }}</span>
                                    <v-btn icon small @click="moveItem(props.item, false)" style="margin-top: 2px">
                                        <v-icon size="22" color="#595959">mdi-chevron-down</v-icon>
                                    </v-btn>
                                </div>
                                <div class="d-flex flex-column align-center" style="margin-left: 10px">
                                    <v-btn icon small @click="editItem(props.item)">
                                        <img
                                                src="/img/kb/edit_grey.svg"
                                                alt="icon_edit_response"
                                        >
                                    </v-btn>
                                    <v-btn icon small @click="cloneItem(props.item)">
                                        <img
                                                src="/img/kb/copy.svg"
                                                alt="icon_copy_response"
                                        >
                                    </v-btn>
                                    <v-btn icon small @click="deleteItem(props.item)">
                                        <img
                                                src="/img/kb/delete_item_grey.svg"
                                                alt="icon_delete_response"
                                                style="transform: scale(1.1)"
                                        >
                                    </v-btn>
                                </div>
                            </div>
                        </template>
                        <template v-slot:item.description="props">
                            <div style="min-width: 300px">
                                {{ props.item.description }}
                            </div>
                        </template>
                        <template v-slot:item.condition_type="props">
                            <div class="inner-btn" :style="{'background': getColorType(props.item.condition_type)}">
                                {{ props.item.condition_type }}
                            </div>
                        </template>
                        <template v-slot:item.condition_text="props">
                            <div v-html="props.item.condition_text"></div>
                        </template>
                        <template v-slot:item.queryScript="props">
                            <div class="d-flex flex-column align-center justify-center">
                                <v-btn outlined color="primary" class="btn-table-custom"
                                       @click="showDetail('query', props.item.query)" v-if="props.item.query">
                                    {{ $f.tc('query') }}
                                </v-btn>
                                <v-btn outlined color="primary" class="btn-table-custom align-stretch"
                                       style="margin-top: 10px" @click="showDetail('script', props.item.script)"
                                       v-if="props.item.script">
                                    {{ $f.tc('script') }}
                                </v-btn>
                            </div>
                        </template>
                        <template v-slot:item.answer="props">
                            <div style="min-width: 400px">
                                {{ $ut.limitStr(props.item.answer, 180) }}
                                <strong v-if="props.item.answer.length > 180" class="see-more"
                                        @click="showDetail('answer', props.item.answer)">{{ $f.tc('seeMore') }}</strong>
                            </div>
                        </template>
                        <template v-for="(extraResponse,i) in extraResponseList" v-slot:[`item.extra_response_${extraResponse.name}`]="props">
                            <div style="min-width: 400px" :key="i">
                                {{ $ut.limitStr(props.item[`extra_response_${extraResponse.name}`], 180) }}
                                <strong v-if="props.item[`extra_response_${extraResponse.name}`].length > 180" class="see-more"
                                        @click="showDetail(`answer(${extraResponse.name})`, props.item[`extra_response_${extraResponse.name}`])">{{ $f.tc('seeMore') }}</strong>
                            </div>
                        </template>
                    </v-data-table>
                </td>
            </template>
        </v-data-table>
        <svg v-else :id="svgId" class="ResponseGraph"></svg>
        <ResponseItemEditor ref="ResponseItemEditor"></ResponseItemEditor>
        <GroupList ref="GroupList"></GroupList>
    </div>
</template>

<script>
import lodash from 'lodash'
import { EntityTypeService, IntentService, ResponseItemService } from '@/services/project.service'
import ResponseItemEditor from '@/views/Project/Response/ResponseItemEditor'
import FciTabs from '@/modules/fptai/components/fci/FciTabs'
import { drawResponseGraph } from './ResponseDraw'
import { mapState } from 'vuex'
import GroupList from '@/views/Project/Response/GroupList'
import { AppEventBusType } from '@/eventbus/app.eventbus'
import {
    EntityTypeTemplateService,
    IntentTemplateService,
    ResponseItemTemplateService
} from '@/services/template.service'

const ViewType = {
    TABLE: 'TABLE',
    GRAPH: 'GRAPH'
}

export default {
    name: 'ResponseList',
    components: {
        GroupList,
        FciTabs,
        ResponseItemEditor
    },
    data () {
        return {
            ViewType,
            svgId: 'ResponseGraph',
            viewType: ViewType.TABLE,
            items: [],
            intents: [],
            entityTypeList: [],
            conditionTypeList: [
                {
                    text: 'missing',
                    value: 'missing'
                }, {
                    text: 'fulfilled',
                    value: 'fulfilled'
                }, {
                    text: 'custom',
                    value: 'custom'
                }
            ],
            mapIntentIdToIntent: new Map(),
            mapIdToEntityType: new Map(),
            filter: {
                intent: '',
                search: ''
            },
            expanded: [],
            idItemActived: '',
            loadingDataTable: false,
            itemService: null
        }
    },
    computed: {
        ...mapState({
            extraResponseList: state => state.response.extraResponseList,
            navigation: state => state.navigation,
            mode: state => state.mode
        }),
        innerHeaders () {
            let headers = [
                {
                    text: this.$f.tc('action'),
                    value: 'action',
                    sortable: false,
                    align: 'top',
                    width: 90
                },
                {
                    text: this.$f.tc('description'),
                    value: 'description',
                    sortable: false
                },
                {
                    text: this.$f.tc('type'),
                    value: 'condition_type',
                    sortable: false,
                    align: 'center',
                    width: 65
                },
                {
                    text: this.$f.tc('condition'),
                    value: 'condition_text',
                    sortable: false,
                    width: 250
                },
                {
                    text: this.$f.tc('entitySuggestion'),
                    value: 'entity_type_name',
                    sortable: false,
                    width: 200
                },
                {
                    text: this.$f.tc('query') + '/' + this.$f.tc('script'),
                    value: 'queryScript',
                    sortable: false,
                    align: 'center',
                    width: 130
                },
                {
                    text: this.$f.tc('answer'),
                    value: 'answer',
                    sortable: false
                }
            ]
            for (let extraResponse of this.extraResponseList) {
                headers.push({
                    text: this.$f.tc('answer') + ` (${extraResponse.name})`,
                    value: `extra_response_${extraResponse.name}`,
                    sortable: false,
                    class: 'extra-response'
                })
            }
            return headers
        },
        commonHeaders () {
            return [
                {
                    text: this.$f.tc('intent'),
                    value: 'intent_name',
                    sortable: false
                },
                {
                    text: this.$f.tc('collapse'),
                    value: 'data-table-expand',
                    align: 'center',
                    width: 78
                }
            ]
        },
        viewTypeList () {
            return [
                {
                    text: this.$f.tc('table'),
                    value: ViewType.TABLE
                }, {
                    text: this.$f.tc('graph'),
                    value: ViewType.GRAPH
                }
            ]
        },
        intentsResponse () {
            let result = []
            if (this.items.length > 0) {
                [...new Set(this.items.map(item => item.intent_name))].forEach(i => {
                    result.push({
                        intent_name: i,
                        list_item: this.items.filter(a => a.intent_name === i)
                    })
                })
            }
            return result
        }
    },
    mounted () {
        this.itemService = this.mode === 'projects' ? ResponseItemService : ResponseItemTemplateService
        Promise.all([
            this.loadIntents(),
            this.loadEntityTypeList()
        ]).then(() => {
            this.refresh().then(() => {
                this.expanded.push(this.intentsResponse[0])
            })
        })
        this.$store.dispatch(this.$at.response.GET_EXTRA_RESPONSE_LIST, {
            projectId: this.$route.params.projectId
        })
    },
    methods: {
        search () {
            this.expanded = []
            this.refresh().then(() => {
                this.expanded.push(this.intentsResponse[0])
            })
        },
        loadIntents () {
            let itemService = this.mode === 'projects' ? IntentService : IntentTemplateService
            if (this.$route.params.projectId) {
                return itemService.search(this.$route.params.projectId).then(result => {
                    this.intents = result.data
                    this.intents.forEach(intent => {
                        this.mapIntentIdToIntent.set(intent.id, intent)
                    })
                })
            }
        },
        loadEntityTypeList () {
            let itemService = this.mode === 'projects' ? EntityTypeService : EntityTypeTemplateService
            if (this.$route.params.projectId) {
                itemService.search(this.$route.params.projectId).then(result => {
                    this.entityTypeList = result.data
                    this.entityTypeList.forEach(entityType => {
                        this.mapIdToEntityType.set(entityType.id, entityType)
                    })
                })
            }
        },
        parseConditions (conditions) {
            let str = '<span>'
            conditions.forEach(c => {
                let value = c.value || '\'\''
                if (c.value_type === 'query') {
                    // value = c.value
                    value = `'${this.$ut.limitStr(c.value, 20)}'`
                }
                str += `${c.variable}<strong style="color: #0052cc; margin: 0 5px">${c.operator}</strong>${value}</span><br>`
            })
            return str
        },
        refresh () {
            this.loadingDataTable = true
            let filter = {
                search: this.filter.search
            }
            filter.intent = this.filter.intent
            if (this.$route.params.projectId) {
                return this.itemService.search(this.$route.params.projectId, filter).then(result => {
                    this.loadingDataTable = false
                    this.items = result.data
                    this.items.forEach(item => {
                        const nameExtraResponses = Object.keys(item.extra_answers)
                        nameExtraResponses.forEach(name => {
                            item[`extra_response_${name}`] = item.extra_answers[name]
                        })
                        let entityType = this.mapIdToEntityType.get(item.entity_suggestion)
                        item.intent_name = this.mapIntentIdToIntent.get(item.intent) ? this.mapIntentIdToIntent.get(item.intent).name : ''
                        item.entity_type_name = entityType ? entityType.name : ''
                        item.condition_text = this.parseConditions(item.conditions)
                    })
                    this.items = lodash.orderBy(this.items, ['intent_name', 'position'])
                    this.drawGraph()
                })
            }
        },
        createItem () {
            this.$refs.ResponseItemEditor.open().then(model => {
                this.itemService.create(this.$route.params.projectId, model).then(() => {
                    this.refresh()
                })
            })
        },
        editItem (item) {
            this.$refs.ResponseItemEditor.open(item).then(model => {
                this.itemService.update(this.$route.params.projectId, item.id, model).then(() => {
                    this.refresh()
                })
            })
        },
        cloneItem (item) {
            this.$refs.ResponseItemEditor.open(item).then(model => {
                this.itemService.create(this.$route.params.projectId, model).then(() => {
                    this.refresh()
                })
            })
        },
        deleteItem (item) {
            this.$appService.confirm(this.$f.tc('confirmDeleteResponse')).then(confirm => {
                if (confirm) {
                    this.itemService.delete(this.$route.params.projectId, item.id).then(() => {
                        this.refresh()
                    })
                }
            })
        },
        drawGraph () {
            drawResponseGraph(this.svgId, {
                items: this.items,
                svgWidth: 1000,
                svgHeight: 500
            })
        },
        manageGroup () {
            this.$refs.GroupList.open()
        },
        moveItem (item, isUp) {
            ResponseItemService.changePosition(
                this.$route.params.projectId,
                item.id,
                {
                    direction: isUp ? 'up' : 'down'
                }
            ).then(() => {
                this.refresh()
            })
        },
        toggleRow (item) {
            const idx = this.expanded.findIndex(i => i.intent_name === item.intent_name)
            if (idx >= 0) {
                this.expanded = this.expanded.filter(i => i.intent_name !== item.intent_name)
            } else {
                this.expanded.push(item)
            }
        },
        rowActivedClass (item) {
            if (item.id === this.idItemActived) {
                return 'row-actived'
            }
        },
        activeRowInnerTable (item) {
            this.idItemActived = item.id
        },
        getColorType (type) {
            switch (type) {
                case 'missing':
                    return '#ff9800'
                case 'fulfilled':
                    return '#4caf50'
                case 'custom':
                    return '#5cbbf6'
            }
        },
        showDetail (title, content) {
            this.$appService.useEventBus(AppEventBusType.CODE_VIEWER, {
                title: this.$f.tc(title),
                content: content,
                width: 600
            })
        }
    },
    watch: {
        viewType () {
            if (this.viewType === ViewType.GRAPH) {
                this.$nextTick(() => {
                    this.drawGraph()
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
.Response {
  background: #fff;
  height: calc(100vh - 64px);
  overflow-y: auto;

  ::v-deep table {
    background: #fff !important;
    border: 1px solid #D9D9D9;
    margin-bottom: 12px !important;

    th {
      background: #F0F0F0;
      padding: 0 12px !important;
    }

    td {
      padding: 8px 12px !important;
    }
  }

  ::v-deep .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: transparent;
  }

  ::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    color: #262626 !important;
    font-size: 14px !important;
  }

  ::v-deep .v-data-table__expanded__row {
    cursor: pointer;
    background: #0052cc !important;
    color: #FFFFFF !important;
    font-weight: 600;

    .mdi-chevron-down::before {
      color: #FFFFFF;
    }
  }

  ::v-deep .table-inner {

    table {
      border-bottom: 1px solid #0052cc;
      border-top: 1px solid #0052cc;
      border-left: none;
      border-right: none;
      margin-bottom: 0 !important;
      overflow-x: auto;
    }

    th {
      background: #F0F0F0;
    }

    tr {
      td:first-child, th:first-child {
        z-index: 1;
        position: sticky;
        width: 52px;
        left: 0;
        top: auto;
        background: #FFFFFF;
        border-left: 1px solid #0052cc;
        border-top-width: 1px;
        margin-top: -1px;
        margin-left: 16px;
      }

      td:last-child, th:last-child {
        border-right: 1px solid #0052cc;
      }

      th:first-child {
        background: #F0F0F0;
        text-align: center;
      }
    }
  }

  .btn-table-custom {
    text-transform: inherit !important;
    font-weight: 400 !important;
    font-size: 14px;
    height: 25px !important;
    width: 90px;
    border-radius: 5px !important;
  }

  .see-more {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .btn-custom {
    text-transform: inherit !important;
    font-weight: 400;
    padding: 5px 16px !important;
    font-size: 14px;
    height: 32px !important;
    margin: 10px 10px 10px 0;
  }
}

::v-deep .row-actived {
  background: #E6F4FF !important;

  .text-top {
    background: #E6F4FF !important;
  }

  .order-text {
    color: #0052cc;
    font-weight: 600;
  }
}

::v-deep .v-list-item .v-list-item__title {
  font-size: 14px !important;
  font-weight: 400 !important;
}

::v-deep label {
  font-size: 14px !important;
}

::v-deep .v-text-field--outlined.v-input--dense .v-label {
  top: 6px !important;
}

::v-deep .v-input__slot {
  min-height: 32px !important;
  font-size: 14px;
  margin-bottom: 0 !important;

  .v-icon.v-icon {
    line-height: 0 !important;
  }

  .v-input__icon {
    min-width: 0 !important;
    width: 9px !important;
  }

  .mdi-close::before {
    color: #595959;
    transform: scale(0.9);
    margin-right: 18px;
  }
}

::v-deep .mdi-menu-down::before {
  content: url("/img/select.svg");
}

::v-deep .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin-top: 4px !important;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
  color: #D9D9D9 !important;
}
::v-deep .v-data-table>.v-data-table__wrapper tbody tr:last-child:hover td:first-child {
  border-radius: 0 !important;
}
::v-deep .v-data-table>.v-data-table__wrapper tbody tr:last-child:hover td:last-child {
  border-radius: 0 !important;
}
::v-deep .v-data-table>.v-data-table__wrapper tbody tr:first-child:hover td:first-child {
  border-radius: 0 !important;
}
::v-deep .v-data-table>.v-data-table__wrapper tbody tr:first-child:hover td:last-child {
  border-radius: 0 !important;
}

::v-deep .v-data-table__wrapper {
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: transparent;
    border: none;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    border: none;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    border: none;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
}

.inner-btn {
  padding: 2px 8px;
  border-radius: 15px;
  color: #FFFFFF;
}

.extra-response {
  max-width: 400px;
}
</style>
<style lang="scss">
@import "ResponseGraph";
</style>
