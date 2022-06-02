<template>
    <div class="IntentList pa-3">
        <v-layout wrap align-center class="mb-3">
            <div style="width: 400px">
                <v-text-field
                    outlined dense hide-details clearable
                    :label="$f.tc('search')"
                    v-model="searchKey"
                    @keypress.enter="runFilter"
                ></v-text-field>
            </div>
            <v-btn class="ml-3" @click="runFilter">
                <v-icon>mdi-filter-outline</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="createItem" color="primary">{{ $t('createNew') }}</v-btn>
        </v-layout>
        <v-card>
            <FciDataTable
                :headers="headers"
                :items="items"
                :pagination.sync="pagination"
                :remote-page-size="remotePageSize"
            >
                <template v-slot:action="props">
                    <v-btn icon small @click="editItem(props.item)">
                        <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon small @click="deleteItem(props.item)">
                        <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </FciDataTable>
        </v-card>
        <ProjectConstantEditor ref="ItemEditor"></ProjectConstantEditor>
    </div>
</template>

<script>
import { ProjectConstantService } from '@/services/project.service'
import FciDataTable from '@/modules/fptai/components/fci/FciDataTable'
import ListViewMixin from '@/modules/fptai/mixins/ListViewMixin'
import ProjectConstantEditor from '@/views/Project/Setting/ProjectConstantEditor'
import { mapState } from 'vuex'
import { ConstantTemplateService } from '@/services/template.service'

export default {
    name: 'ProjectConstant',
    components: {
        ProjectConstantEditor,
        FciDataTable
    },
    mixins: [ListViewMixin],
    data () {
        return {
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
                    text: this.$f.tc('value'),
                    value: 'value'
                }, {
                    text: this.$f.tc('action'),
                    value: 'action'
                }
            ]
        }
    },
    mounted () {
        this.itemService = this.mode === 'projects' ? ProjectConstantService : ConstantTemplateService
        this.refresh()
    },
    methods: {
        createItem () {
            this.$refs.ItemEditor.open().then(model => {
                this.itemService.create(this.$route.params.projectId, model).then(() => {
                    this.refresh()
                })
            })
        },
        editItem (item) {
            this.$refs.ItemEditor.open(item).then(model => {
                this.itemService.update(this.$route.params.projectId, item.id, model).then(() => {
                    this.refresh()
                })
            })
        }
    }
}
</script>
