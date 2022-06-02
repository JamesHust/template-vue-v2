<template>
    <div class="EntityTypeList pa-3">
        <div class="d-flex align-center" style="margin-bottom: 2px">
            <div style="font-weight: 600; font-size: 24px">{{ $f.tc('entityType') }}</div>
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
        <EntityTypeEditor ref="ItemEditor"></EntityTypeEditor>
    </div>
</template>

<script>
import { EntityTypeService } from '@/services/project.service'
import FciDataTable from '@/modules/fptai/components/fci/FciDataTable'
import ListViewMixin from '@/modules/fptai/mixins/ListViewMixin'
import EntityTypeEditor from '@/views/Project/NLP/EntityTypeEditor'
import { mapState } from 'vuex'
import { EntityTypeTemplateService } from '@/services/template.service'

const ExtractMethod = {
    1: 'both',
    2: 'exact',
    3: 'predictive'
}

export default {
    name: 'EntityTypeList',
    components: { EntityTypeEditor, FciDataTable },
    mixins: [ListViewMixin],
    data () {
        return {
            itemService: this.mode === 'projects' ? EntityTypeService : EntityTypeTemplateService,
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
                }, {
                    text: this.$f.tc('description'),
                    value: 'description'
                }, {
                    text: this.$f.tc('extractMethod'),
                    value: 'extract_method',
                    $value: item => this.$f.tc(ExtractMethod[item.extract_method])
                }, {
                    text: this.$f.tc('action'),
                    value: 'action'
                }
            ]
        }
    },
    mounted () {
        this.itemService = this.mode === 'projects' ? EntityTypeService : EntityTypeTemplateService
        this.refresh()
    },
    methods: {
        createItem () {
            this.$refs.ItemEditor.open().then(model => {
                this.itemService.create(this.$route.params.projectId, model).then(() => {
                    this.refresh()
                    this.$store.dispatch(
                        this.$at.nlp.GET_ENTITY_TYPE_LIST,
                        { projectId: this.$route.params.projectId }
                    )
                })
            })
        },
        editItem (item) {
            this.$refs.ItemEditor.open(item).then(model => {
                this.itemService.update(this.$route.params.projectId, item.id, model).then(() => {
                    this.refresh()
                    this.$store.dispatch(
                        this.$at.nlp.GET_ENTITY_TYPE_LIST,
                        { projectId: this.$route.params.projectId }
                    )
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

.btn-custom {
  text-transform: inherit !important;
  font-weight: 400;
  padding: 5px 16px !important;
  font-size: 14px;
  height: 32px !important;
  margin: 10px 10px 10px 0;
}
</style>
