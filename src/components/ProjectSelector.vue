<template>
    <div class="ProjectSelector" @click="openSelector">
        <v-layout row align-center ref="OpenProjectSelector">
            <template v-if="$ut.isMobile()">
                <div class="m-item" style="color: #fff">P</div>
            </template>
            <template v-else>
                <div class="project-name mr-1">
                    {{ activeProject ? activeProject.name : $f.tc('selectProject') }}
                </div>
            </template>
        </v-layout>
        <v-menu
                :close-on-content-click="false"
                absolute
                v-model="smallMenuShow"
                :position-x="smallMenuX"
                :position-y="smallMenuY"
                style="z-index: 10000 !important;"
        >
            <div class="fci-list">
                <v-layout
                        v-for="project in projectList"
                        :key="project.id"
                        class="fci-list-item"
                        :class="{active: project === activeProject}"
                        @click="goToProject(project)"
                >
                    {{ project.name }}
                </v-layout>
            </div>
        </v-menu>
        <ProjectSelectorDialog ref="ProjectSelectorDialog"></ProjectSelectorDialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ProjectSelectorDialog from './ProjectSelectorDialog'

export default {
    name: 'ProjectSelector',
    components: { ProjectSelectorDialog },
    data () {
        return {
            smallMenuShow: false,
            smallMenuX: 0,
            smallMenuY: 0,
            activeProject: null
        }
    },
    computed: {
        ...mapState({
            projectList: state => state.projectList,
            mode: state => state.mode
        })
    },
    mounted () {
        this.$store.dispatch(this.$at.GET_PROJECT_LIST)
    },
    methods: {
        goToProject (project) {
            if (project.id !== this.$route.params.projectId) {
                this.$store.dispatch(this.$at.kg.CLEAR_ALL_DATA).then(() => {
                    this.smallMenuShow = false
                    this.$router.push(`/projects/${project.id}/graph`)
                })
            }
        },
        updateActiveProject () {
            let projectId = this.$route.params.projectId
            if (!projectId || !this.projectList) {
                this.activeProject = null
                this.$store.dispatch(this.$actionTypes.PROJECT, this.activeProject)
                return
            }
            this.activeProject = this.projectList.find(project => project.id === projectId)
            if (!this.activeProject) {
                this.$router.push('/access-denied')
            } else {
                this.$store.dispatch(this.$actionTypes.PROJECT, this.activeProject)
            }
        },
        openSelector () {
            if (this.projectList.length > 15) {
                this.$refs.ProjectSelectorDialog.open(this.projectList).then(this.goToProject)
            } else {
                let rect = this.$refs.OpenProjectSelector.getBoundingClientRect()
                this.smallMenuShow = true
                this.smallMenuX = rect.x - 10
                this.smallMenuY = rect.y + rect.height + 4
            }
        }
    },
    watch: {
        $route: 'updateActiveProject',
        projectList: 'updateActiveProject'
    }
}
</script>

<style scoped lang="scss">
.ProjectSelector {
  padding: 14px 40px 11px 22px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;

  i {
    transition: none;
  }

  &:hover {
    background: rgb(255, 255, 255);
    transition: 0.5s;

    .project-name, i {
      color: #0052cc !important;
    }

    .m-item {
      color: #0052cc !important;
    }
  }

  &:after {
    position: absolute;
    content: url("/img/menu_down.svg");
    top: -2px;
    right: 12px;
  }

  &:hover:after {
    content: url("/img/menu_down_blue.svg");
    transition: 0.2s;
  }
}

.project-name {
  color: #fff;
  font-size: 14px;
}

.fci-list {
  background: #fff;
  min-width: 200px;

  .fci-list-item {
    padding: 8px 12px;
    font-size: 14px !important;
  }
}

.m-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
</style>
