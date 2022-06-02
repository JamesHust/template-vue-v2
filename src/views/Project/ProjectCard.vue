<template>
    <div class="bot-item">
        <div class="bot-item-header d-flex align-start justify-space-between">
            <div class="d-flex align-center">
                <div class="bot-image">
                    {{ $ut.getImageName(data.name) }}
                </div>
                <div>
                    <div class="bot-name">{{ data.name }}</div>
                    <div class="bot-createat">{{$f.tc('createAt')}}: {{$f.formatDateTime(data.created_time)}}</div>
                </div>
            </div>
            <v-menu
                    bottom
                    left
                    v-if="getActionList(actionList, data.user_role).length > 0"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small class="ml-3" v-bind="attrs" v-on="on">
                        <img src="/img/kb/more.svg" alt="icon_more_action" style="transform: scale(0.9)">
                    </v-btn>
                </template>
                <div class="fci-list">
                    <div class="fci-list-item"
                         v-for="(action, i) in getActionList(actionList, data.user_role)"
                         :key="i"
                         @click="doContextAction(action.action, data)"
                    >
                        <div class="d-flex align-center item-action"
                             :style="[action.action === PROJECT_LIST_CMA.DELETE_PROJECT ? { 'color': '#F93030' } : '']">
                            <img :src="action.icon" alt="icon_action" style="margin-right: 6px">
                            {{ action.name }}
                        </div>
                    </div>
                </div>
            </v-menu>
        </div>
        <v-layout class="bot-item-row">
            <v-flex xs6>{{ $f.tc('language') }}</v-flex>
            <v-flex xs6>{{ $f.tc('vietnamese') }}</v-flex>
        </v-layout>
        <v-layout class="bot-item-row">
            <v-flex xs6>{{ $f.tc('lastUpdated') }}</v-flex>
            <v-flex xs6>{{ $f.formatDateTime(data.updated_time) }}</v-flex>
        </v-layout>
        <ConfirmDeleteProject ref="ConfirmDeleteProject"></ConfirmDeleteProject>
    </div>
</template>

<script>
import { ProjectService } from '@/services/project.service'
import { PROJECT_LIST_CMA } from '@/utils/const'
import ConfirmDeleteProject from '@/views/Project/ConfirmDeleteProject'
import { ProjectTemplateService } from '@/services/template.service'

export default {
    name: 'ProjectCard',
    components: { ConfirmDeleteProject },
    props: ['data'],
    data () {
        return {
            PROJECT_LIST_CMA
        }
    },
    computed: {
        actionList () {
            return [
                {
                    name: this.$f.tc('deleteProject'),
                    icon: '/img/kb/delete_red.svg',
                    action: PROJECT_LIST_CMA.DELETE_PROJECT
                }
            ]
        }
    },
    methods: {
        deleteProject (item) {
            this.$refs.ConfirmDeleteProject.open(item).then(() => {
                console.log(this.$route.path)
                switch (this.$route.path) {
                    case '/projects':
                        ProjectService.delete(item.id).then(() => {
                            this.$nextTick(() => {
                                this.$parent.refresh()
                            })
                        })
                        break
                    case '/project-templates':
                        ProjectTemplateService.delete(item.id).then(() => {
                            this.$nextTick(() => {
                                this.$parent.refresh()
                            })
                        })
                        break
                }
            })
        },
        doContextAction (action, item) {
            switch (action) {
                case PROJECT_LIST_CMA.DELETE_PROJECT: {
                    this.deleteProject(item)
                    break
                }
            }
        },
        getActionList (actions, role) {
            if (role !== 'owner') {
                return actions.filter(i => i.action !== PROJECT_LIST_CMA.DELETE_PROJECT)
            } else {
                return actions
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "src/modules/fptai/assets/css/fci-var";

.bot-item {
  margin: 0 20px 20px 0;
  background: $primary3;
  width: 350px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    box-shadow: $shadow;

    .bot-name {
      color: #0052cc;
    }
  }

  .bot-item-header {
    padding: 12px;
  }

  .bot-image {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #262626;
    font-weight: 600;
    font-size: 14px;
    background: #D0D0D0;
    margin-right: 12px;
  }

  .bot-name {
    font-weight: bold;
    font-size: 14px;
  }

  .bot-createat {
    font-weight: 400;
    font-size: 12px;
    color: #595959;
  }

  .bot-item-row {
    padding: 12px;
    font-size: 14px;
    border-top: 1px solid $borderColor3;
  }
}

.item-action {
  font-size: 14px;
}

.fci-list {
  background: #fff;
  min-width: 180px;

  .fci-list-item {
    padding: 8px 12px;
    font-size: 14px !important;
  }
}
</style>
