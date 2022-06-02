<template>
    <div class="IntentList pa-3">
        <div class="d-flex align-center" style="margin-bottom: 2px">
            <div style="font-weight: 600; font-size: 24px">{{ $f.tc('intent') }}</div>
            <v-spacer></v-spacer>
            <v-btn @click="generateAllResponses" color="primary" class="btn-custom" style="margin: 0 10px 0 0 !important;">
                <img
                        src="/img/kb/refresh.svg"
                        alt="icon_generate_all"
                        style="margin-right: 6px;"
                >
                {{ $f.tc('generateAllResponses') }}
            </v-btn>
            <v-btn @click="createItem" color="primary" class="btn-custom" style="margin: 0 !important;">
                <img
                        src="/img/kb/add_item_white.svg"
                        alt="icon_add_intent"
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
                <v-btn icon small @click="generateIntentResponses(props.item)">
                    <img
                            src="/img/kb/generate_response.svg"
                            alt="icon_generate_responses"
                            style="transform: scale(1.1)"
                    >
                </v-btn>
            </template>
        </FciDataTable>
        <IntentEditor ref="ItemEditor"></IntentEditor>
    </div>
</template>

<script>
import { IntentService } from '@/services/project.service'
import FciDataTable from '@/modules/fptai/components/fci/FciDataTable'
import ListViewMixin from '@/modules/fptai/mixins/ListViewMixin'
import IntentEditor from '@/views/Project/NLP/IntentEditor'
import { mapState } from 'vuex'
import { IntentTemplateService } from '@/services/template.service'

export default {
    name: 'IntentList',
    components: {
        IntentEditor,
        FciDataTable
    },
    mixins: [ListViewMixin],
    data () {
        return {
            itemService: this.mode === 'projects' ? IntentService : IntentTemplateService,
            remotePageSize: 0
        }
    },
    computed: {
        ...mapState({
            mode: state => state.mode
        }),
        headers () {
            return [
                {
                    text: this.$f.tc('name'),
                    value: 'name'
                },
                {
                    text: this.$f.tc('description'),
                    value: 'description'
                },
                {
                    text: this.$f.tc('requiredEntityType'),
                    value: 'slots',
                    $value: intent => this.getIntentSlots(intent, 'REQUIRED')
                },
                {
                    text: this.$f.tc('optionalEntityType'),
                    value: 'slots',
                    $value: intent => this.getIntentSlots(intent, 'OPTIONAL')
                },
                {
                    text: this.$f.tc('action'),
                    value: 'action'
                }
            ]
        }
    },
    mounted () {
        this.itemService = this.mode === 'projects' ? IntentService : IntentTemplateService
        this.refresh()
    },
    methods: {
        createItem () {
            this.$refs.ItemEditor.open().then(model => {
                let data = { ...model }
                delete data.slots
                this.itemService.create(this.$route.params.projectId, data).then(result => {
                    return this.itemService.updateSlots(
                        this.$route.params.projectId,
                        result.data.id,
                        model.slots
                    )
                }).then(() => {
                    this.refresh()
                })
            })
        },
        editItem (item) {
            this.$refs.ItemEditor.open(item).then(model => {
                let data = { ...model }
                delete data.slots
                this.itemService.update(this.$route.params.projectId, item.id, data).then(result => {
                    return this.itemService.updateSlots(
                        this.$route.params.projectId,
                        result.data.id,
                        model.slots
                    )
                }).then(() => {
                    this.refresh()
                })
            })
        },
        deleteItem (item) {
            this.$appService.confirm(this.$f.tc('confirmDelete', { item: item.name }), this.$t('noticeDeleteIntent')).then(confirm => {
                if (confirm) {
                    this.itemService.delete(this.$route.params.projectId, item.id).then(() => {
                        this.refresh()
                    })
                }
            })
        },
        generateIntentResponses (item) {
            this.$appService.confirm(this.$f.tc('generateResponsesConfirm')).then(confirm => {
                if (confirm) {
                    this.itemService.generateResponses(
                        this.$route.params.projectId,
                        item.id
                    ).then(() => {
                        this.$ut.copyToClipboard(this.otp, this.$f.tc('generateResponses') + ' ' + this.$f.tc('successful'))
                    })
                }
            })
        },
        generateAllResponses () {
            this.$appService.confirm(this.$f.tc('generateAllResponsesConfirm')).then(confirm => {
                if (confirm) {
                    this.$appService.showLoading()
                    this.itemService.generateAllResponses(this.$route.params.projectId)
                }
            }).finally(this.$appService.hideLoading)
        },
        getIntentSlots (intent, type) {
            let text = ''
            for (let slot of intent.slots) {
                if (slot.type !== type) {
                    continue
                }
                if (slot.options.length > 1) {
                    text += '; ('
                    for (let option of slot.options) {
                        text += option.entity_type_name + '; '
                    }
                    text = text.substring(0, text.length - 2)
                    text += ')'
                } else if (slot.options.length > 0) {
                    text += '; ' + slot.options[0].entity_type_name
                }
            }
            return text.substring(2)
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

.btn-custom {
  text-transform: inherit !important;
  font-weight: 400;
  padding: 5px 16px !important;
  font-size: 14px;
  height: 32px !important;
  margin: 10px 10px 10px 0;
}
</style>
