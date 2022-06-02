<template>
    <div>
        <div class="header">
            <div class="name">{{ $f.tc(mode === 'projects' ? 'projectList' : 'projectTemplateList') }}</div>
            <v-spacer></v-spacer>
            <div class="d-flex align-center" style="width: 600px">
                <v-text-field
                        outlined dense hide-details
                        :placeholder="$f.tc('search')"
                        v-model="searchKey"
                        @keypress.enter="filterProjectList"
                ></v-text-field>
                <div small class="btn-search" @click="filterProjectList">
                    <img
                            src="/img/search.svg"
                            alt="icon_search_project"
                    >
                </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="btn-custom" @click="createProject">
                <img src="/img/kb/add_item_white.svg" style="transform: scale(1.05); margin-right: 6px"/>
                {{ $f.tc('createNew') }}
            </v-btn>
        </div>
        <div class="body">
            <div v-for="type in projectTypes" :key="type.name" class="type-project">
                <div v-if="projects.filter(i => i.user_role === type.name).length > 0">
                    <div class="title-project">
                        <div class="name-type">{{type.value}}</div>
                        <div class="horizontal-line"></div>
                    </div>
                    <div class="bot-list">
                        <div
                                v-for="project in projects.filter(i => i.user_role === type.name)"
                                :key="project.id"
                                class=""
                                @click="goToProject(project)"
                        >
                            <ProjectCard :data="project"></ProjectCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import lodash from 'lodash'
import { ProjectService } from '@/services/project.service'
import { AppEventBusType } from '@/eventbus/app.eventbus'
import { mapState } from 'vuex'
import formRules from '@/modules/fptai/utils/FormRules'
import { PROJECT_LIST_CMA, ROLE_PERMISSION } from '@/utils/const'
import ProjectCard from '@/views/Project/ProjectCard'
import { ProjectTemplateService } from '@/services/template.service'

export default {
    name: 'Dashboard',
    components: { ProjectCard },
    data () {
        return {
            PROJECT_LIST_CMA,
            searchKey: '',
            projects: [],
            itemService: null
        }
    },
    computed: {
        ...mapState({
            projectList: state => lodash.orderBy(state.projectList, 'name'),
            mode: state => state.mode
        }),
        projectTypes () {
            return [
                {
                    name: 'owner',
                    value: this.$f.tc('projectOwner')
                },
                {
                    name: ROLE_PERMISSION.ADMIN,
                    value: this.$f.tc('projectAdmin')
                },
                {
                    name: ROLE_PERMISSION.DATA_EDITOR,
                    value: this.$f.tc('projectEditor')
                },
                {
                    name: ROLE_PERMISSION.TESTER,
                    value: this.$f.tc('projectTester')
                },
                {
                    name: ROLE_PERMISSION.VIEWER,
                    value: this.$f.tc('projectViewer')
                }
            ]
        }
    },
    mounted () {
        this.$store.dispatch(this.$at.kg.CLEAR_ALL_DATA)
        this.itemService = this.mode === 'projects' ? ProjectService : ProjectTemplateService
        this.refresh()
    },
    methods: {
        refresh () {
            this.$store.dispatch(this.$at.GET_PROJECT_LIST).then(() => {
                this.projects = this.projectList
            })
        },
        filterProjectList () {
            let searchKey = this.searchKey.trim()
            if (!searchKey) {
                return this.searchKey
            }
            this.projects = this.projectList.filter(project => project.name.toLowerCase().includes(searchKey.toLowerCase()))
        },
        createProject () {
            this.itemService = this.mode === 'projects' ? ProjectService : ProjectTemplateService
            this.$appService.useEventBus(AppEventBusType.OPEN_TEXT_EDITOR, {
                title: this.$f.tc(this.mode === 'projects' ? 'project' : 'projectTemplateList'),
                rules: [formRules.ruleRequired, this.ruleDuplicate],
                width: 500
            }).then(text => {
                this.itemService.create({
                    name: text
                }).then(() => {
                    this.refresh()
                })
            })
        },
        ruleDuplicate (value) {
            let result = true
            if (value) {
                let val = value.trim()
                for (let project of this.projectList) {
                    if (project.name === val) {
                        result = false
                        break
                    }
                }
            }
            return result || window.vueapp.$t('formRules.fieldDuplicate')
        },
        goToProject (project) {
            if (this.mode) {
                this.$router.push(`/${this.mode}/${project.id}/${this.mode === 'projects' ? 'graph' : 'ontology'}`)
            }
        }
    },
    watch: {
        searchKey () {
            if (!this.searchKey) {
                this.projects = this.projectList
            }
        },
        mode () {
            this.refresh()
        }
    }
}
</script>

<style scoped lang="scss">
@import "src/modules/fptai/assets/css/fci-var";

::v-deep .v-input__slot {
  min-height: 32px !important;
  font-size: 14px;
  margin-bottom: 0 !important;
  border-radius: 5px 0 0 5px !important;
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

.btn-search {
  height: 32px !important;
  padding: 8px 12px !important;
  border: 1px solid #D9D9D9;
  border-left: none;
  border-radius: 0px 5px 5px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
  cursor: pointer;

  &:hover {
    background: #D0D0D0;
  }
}

.header {
  height: 72px;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 0 20px;

  .name {
    font-size: 24px;
    font-weight: bold;
  }

  input {
    border: 1px solid $borderColor3;
    height: 42px;
    min-width: 700px;
    border-radius: 5px;
    padding: 0 10px;

    &:focus {
      outline: none;
      border-color: $primary1;
    }
  }
}

.body {
  padding: 20px;

  .role {
    text-transform: uppercase;
    font-weight: bold;
    color: #888A9A;
  }
}

.bot-list {
  display: flex;
  flex-wrap: wrap;
}

.type-project {
  .title-project {
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 100%;

    .name-type {
      font-weight: 600;
      font-size: 14px;
      color: #8C8C8C;
      margin-bottom: 10px;
      text-transform: capitalize;
    }

    .horizontal-line {
      flex: 1;
      height: 1px;
      background: #D9D9D9;
      margin-bottom: 10px;
      margin-left: 10px;
    }
  }

  &:first-child {
    .title-project {
      margin-top: 0;
    }
  }
}
</style>
