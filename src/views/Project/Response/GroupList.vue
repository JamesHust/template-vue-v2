<template>
    <FciDialog :title="$f.tc('manageGroup')" :width="650" v-model="show" class="ScenarioItemEditor">
        <div class="pa-3">
            <div class="d-flex align-center justify-space-between" style="margin-bottom: 12px">
                <div style="width: 50%" class="d-flex align-center">
                    <v-text-field
                        outlined dense hide-details
                        :placeholder="$f.tc('search')"
                        v-model="search"
                    ></v-text-field>
                    <div class="filter" @click="filter">
                        <img
                            src="/img/kb/filter.svg"
                            alt="icon_filter"
                            style="transform: scale(0.8)"
                        >
                    </div>
                </div>
                <v-btn small color="primary" class="btn-custom" @click="addItem">
                    <img
                        src="/img/kb/add_item_white.svg"
                        alt="icon_add_item"
                        style="margin-right: 6px"
                    >
                    {{ $f.tc('addGroup') }}
                </v-btn>
            </div>
            <v-simple-table
                fixed-header
                height="250px"
            >
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th class="text-left">{{$f.tc('group')}}</th>
                        <th class="text-left">{{$f.tc('description')}}</th>
                        <th class="text-center" style="width: 80px">{{$f.tc('action')}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in extraResponses"
                        :key="item.name"
                    >
                        <td>{{ item.name }}</td>
                        <td>{{ item.description }}</td>
                        <td class="d-flex align-center justify-center" style="width: 80px">
                            <img
                                @click="editItem(item)"
                                src="/img/kb/edit.svg"
                                alt="icon_edit_group"
                                style="cursor: pointer"
                            >
                            <img
                                @click="deleteItem(item)"
                                src="/img/kb/delete.svg"
                                alt="icon_delete_group"
                                style="cursor: pointer; margin-left: 12px; transform: scale(1.1)"
                            >
                        </td>
                    </tr>
                    <tr class="notice-empty" v-if="extraResponses.length <= 0">
                        <td :colspan="3">{{$f.tc('noDataAvailable')}}</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <GroupItemEditor ref="GroupItemEditor"></GroupItemEditor>
    </FciDialog>
</template>

<script>
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import { mapState } from 'vuex'
import { ExtraResponseService } from '@/services/project.service'
import GroupItemEditor from '@/views/Project/Response/GroupItemEditor'
import { ExtraResponseTemplateService } from '@/services/template.service'

export default {
    name: 'GroupList',
    components: { GroupItemEditor, FciDialog },
    mixins: [DialogEditorMixin],
    props: ['root'],
    data () {
        return {
            search: '',
            extraResponses: [],
            itemService: this.mode === 'projects' ? ExtraResponseService : ExtraResponseTemplateService
        }
    },
    computed: {
        ...mapState({
            extraResponseList: state => state.response.extraResponseList,
            mode: state => state.mode
        })
    },
    mounted () {
        this.$store.dispatch(this.$at.response.GET_EXTRA_RESPONSE_LIST, {
            projectId: this.$route.params.projectId
        }).then(() => {
            this.extraResponses = this.extraResponseList
        })
    },
    methods: {
        onOpen () {
            this.search = ''
            this.newGroup = ''
            this.clearFormValidation()
        },
        filter () {
            if (this.search) {
                this.extraResponses = this.extraResponseList.filter(i => i.name.includes(this.search))
            }
        },
        addItem () {
            this.$refs.GroupItemEditor.open().then(model => {
                this.itemService.create(this.$route.params.projectId, {
                    name: model.name,
                    description: model.description
                }).then(() => {
                    return this.$store.dispatch(this.$at.response.GET_EXTRA_RESPONSE_LIST, {
                        projectId: this.$route.params.projectId
                    })
                }).then(() => {
                    this.$parent.refresh()
                    this.$appService.toastSuccess(this.$f.tc('addGroup') + ' ' + this.$t('successful'))
                })
            })
        },
        editItem (item) {
            this.$refs.GroupItemEditor.open(item).then(model => {
                return this.itemService.update(this.$route.params.projectId, item.id, {
                    name: model.name,
                    description: model.description
                })
            }).then(() => {
                return this.$store.dispatch(this.$at.response.GET_EXTRA_RESPONSE_LIST, {
                    projectId: this.$route.params.projectId
                })
            }).then(() => {
                this.$parent.refresh()
                this.extraResponses = this.extraResponseList
            })
        },
        deleteItem (item) {
            this.$appService.confirm(this.$f.tc('confirmDelete', { item: item.name })).then(confirm => {
                if (confirm) {
                    this.itemService.delete(this.$route.params.projectId, item.id).then(() => {
                        return this.$store.dispatch(this.$at.response.GET_EXTRA_RESPONSE_LIST, {
                            projectId: this.$route.params.projectId
                        })
                    })
                }
            }).then(() => {
                this.$parent.refresh()
                this.extraResponses = this.extraResponseList
            })
        }
    },
    watch: {
        search () {
            if (!this.search) {
                this.extraResponses = this.extraResponseList
            }
        },
        extraResponseList () {
            this.extraResponses = this.extraResponseList
        }
    }
}
</script>

<style scoped lang="scss">
.v-select {
    ::v-deep .v-input__slot {
        height: 32px !important;
    }

    ::v-deep .v-text-field__details {
        right: 20px;
    }
}

::v-deep .v-input__slot {
    min-height: 32px !important;
    font-size: 14px;
    margin-bottom: 0 !important;
    border-radius: 5px 0 0 5px;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
    color: #D9D9D9 !important;
}

.filter {
    background: #fff;
    border: 1px solid #D9D9D9;
    border-left: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        user-select: none;
    }
    &:hover {
        background: #e5e5e5;
    }
}

.notice-empty {
    color: #888A9A;
    text-align: center;
}

.list-group {
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    max-height: 270px;
}

.btn-custom {
    padding: 5px 16px !important;
    height: 32px !important;
    margin-left: 8px;
    text-transform: inherit;
    font-size: 14px;
    font-weight: 400;
}

::v-deep table {
    border: 1px solid #D9D9D9;
    border-top: none;

    th {
        background: #F0F0F0 !important;
        border-color: #F0F0F0;
        border-top: 1px solid #D9D9D9;
    }

    td, th {
        height: 40px !important;
        font-size: 14px !important;
    }
}

::v-deep .theme--light.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: #FFFFFF !important;
}

::v-deep .theme--light.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper):is(.notice-empty) {
    background: #fff !important;
}
</style>
