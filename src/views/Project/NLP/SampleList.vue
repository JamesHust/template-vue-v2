<template>
    <div class="SampleList pa-3">
        <div class="d-flex align-center" style="margin-bottom: 2px">
            <div style="font-weight: 600; font-size: 24px">{{ $f.tc('nlpSample') }}</div>
            <v-spacer></v-spacer>
            <v-btn @click="createItem" color="primary" class="btn-custom" style="margin: 0 !important;">
                <img
                        src="/img/kb/add_item_white.svg"
                        alt="icon_add_entity"
                        style="margin-right: 6px; transform: scale(1.1)"
                >
                {{ $f.tc('createNew') }}
            </v-btn>
        </div>
        <div class="d-flex align-center">
            <div style="width: 400px; margin-right: 10px">
                <v-text-field
                        outlined dense hide-details clearable
                        :placeholder="$f.tc('search')"
                        v-model="searchKey"
                        @keypress.enter="runFilter"
                ></v-text-field>
            </div>
            <div style="width: 400px; margin-right: 10px">
                <v-autocomplete
                        outlined dense hide-details clearable
                        :placeholder="$f.tc('intent')"
                        :items="intentList"
                        item-text="name"
                        item-value="id"
                        v-model="filter.intent"
                        @input="runFilter"
                ></v-autocomplete>
            </div>
            <v-btn color="primary" class="btn-custom" style="text-transform: capitalize !important;" @click="runFilter">
                {{ $t('search') }}
            </v-btn>
        </div>
        <FciDataTable
            :headers="headers"
            :items="items"
            :pagination.sync="pagination"
            :remote-page-size="remotePageSize"
        >
            <template v-slot:action="props">
                <v-btn icon small @click="editItem(props.item)">
                    <img
                            src="/img/kb/edit_grey.svg"
                            alt="icon_edit_sample"
                    >
                </v-btn>
                <v-btn icon small @click="deleteItem(props.item)">
                    <img
                            src="/img/kb/delete_item_grey.svg"
                            alt="icon_delete_sample"
                            style="transform: scale(1.1)"
                    >
                </v-btn>
            </template>
        </FciDataTable>
        <SampleEditor ref="ItemEditor"></SampleEditor>
    </div>
</template>

<script>
import { SampleService } from '@/services/project.service'
import FciDataTable from '@/modules/fptai/components/fci/FciDataTable'
import ListViewMixin from '@/modules/fptai/mixins/ListViewMixin'
import SampleEditor from '@/views/Project/NLP/SampleEditor'
import { mapState } from 'vuex'
import { SampleTemplateService } from '@/services/template.service'

export default {
    name: 'SampleList',
    components: {
        SampleEditor,
        FciDataTable
    },
    extends: ListViewMixin,
    data () {
        return {
            itemService: SampleService,
            remotePageSize: 0,
            filter: {
                intent: ''
            }
        }
    },
    computed: {
        ...mapState({
            intentList: state => state.nlp.intentList,
            mode: state => state.mode
        }),
        headers () {
            return [
                {
                    text: this.$f.tc('content'),
                    value: 'content'
                }, {
                    text: this.$f.tc('intent'),
                    value: 'intent_name'
                }, {
                    text: this.$f.tc('action'),
                    value: 'action'
                }
            ]
        }
    },
    mounted () {
        this.itemService = this.mode === 'projects' ? SampleService : SampleTemplateService
        this.$store.dispatch(
            this.$at.nlp.GET_INTENT_LIST,
            { projectId: this.$route.params.projectId }
        ).then(() => {
            this.refresh()
        })
    },
    methods: {
        refresh () {
            let mapIdToIntent = this.$store.state.nlp.mapIdToIntent
            if (mapIdToIntent.size < 1) {
                return
            }
            if (this.$route.params.projectId) {
                this.itemService.search(this.$route.params.projectId, {
                    ...this.pagination,
                    ...this.filter,
                    search: this.searchKey
                }).then(result => {
                    this.items = result.data.data
                    this.remotePageSize = result.data.count
                    this.items.forEach(item => {
                        item.intent_name = mapIdToIntent.get(item.intent).name
                    })
                })
            }
        },
        createItem () {
            this.$refs.ItemEditor.open().then(model => {
                let data = {}
                data.content = model.content
                data.intent = model.intent
                this.itemService.create(this.$route.params.projectId, data).then(() => {
                    this.refresh()
                })
            })
        },
        editItem (item) {
            if (this.mode === 'project-templates') {
                item.intent = item.intent_template
            }
            this.$refs.ItemEditor.open(item).then(model => {
                this.itemService.update(this.$route.params.projectId, item.id, model).then(() => {
                    this.refresh()
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .v-input__slot {
  min-height: 32px !important;
  font-size: 14px !important;
  margin-bottom: 0 !important;
}

::v-deep .v-input__append-inner {
  margin-bottom: 4px !important;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
  color: #D9D9D9 !important;
}

::v-deep .mdi-menu-down::before {
  content: url("/img/select.svg");
  height: 32px !important;
}

.v-select {
  ::v-deep .v-input__slot {
    height: 32px !important;
  }

  ::v-deep .v-text-field__details {
    right: 20px;
  }
}

::v-deep .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin-top: 4px !important;
}

::v-deep .v-list-item .v-list-item__title {
  font-size: 14px !important;
  font-weight: 400 !important;
}

.btn-custom {
  text-transform: inherit !important;
  font-weight: 400;
  padding: 5px 16px !important;
  font-size: 14px;
  height: 32px !important;
  margin: 10px 10px 10px 0;
}

</style>
