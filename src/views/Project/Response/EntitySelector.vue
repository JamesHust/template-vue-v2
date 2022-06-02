<template>
    <div class="EntitySelector">
        <div class="d-flex align-center">
            <div class="label align-self-start">{{ $f.tc('entityType') }}</div>
            <img
                    @click="addEntity"
                    src="/img/kb/add_item.svg"
                    alt="icon_add_entity"
                    style="cursor: pointer"
            >
            <v-menu
                    v-model="isMenuVisible"
                    :close-on-click="false"
                    :close-on-content-click="false"
                    offset-y absolute
                    :position-x="menuX"
                    :position-y="menuY"
            >
                <v-layout align-center class="pa-3" style="background: #fff">
                    <v-autocomplete
                            dense outlined hide-details
                            :items="entities"
                            :placeholder="$f.tc('entityType')"
                            item-value="name"
                            item-text="name"
                            v-model="entityType"
                    ></v-autocomplete>
                    &nbsp;=&nbsp;
                    <v-text-field
                            dense outlined hide-details
                            v-model="entityValue"
                            :placeholder="$f.tc('value')"
                    ></v-text-field>
                    <v-btn class="btn-custom" outlined @click="toggleMenu">{{ $f.tc('cancel') }}</v-btn>
                    <v-btn color="primary" class="btn-custom" @click="selectEntity">{{ $f.tc('save') }}</v-btn>
                </v-layout>
            </v-menu>
        </div>
        <div class="d-flex align-center flex-wrap">
            <div v-for="(item, i) in entityList" :key="i" class="item" @click="editEntity($event, i)">
                {{ item.entityType }} = {{ item.entityValue ? item.entityValue : 'null' }}
                <img
                        @click.stop="deleteEntity(item)"
                        src="/img/kb/delete_item_grey.svg"
                        alt="icon_delete_entity"
                        style="cursor: pointer; margin-left: 8px"
                >
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

const DialogMode = {
    EDIT: 'EDIT',
    ADD: 'ADD'
}

export default {
    name: 'EntitySelector',
    data () {
        return {
            dialogMode: DialogMode.ADD,
            entityList: [],
            isMenuVisible: false,
            menuX: 0,
            menuY: 0,
            entityType: '',
            entityValue: '',
            editingEntityIndex: -1
        }
    },
    computed: {
        ...mapState({
            entityTypeList: state => state.nlp.entityTypeList
        }),
        entities () {
            let listNameEntity = this.entityList.map(i => i.entityType)
            if (this.isMenuVisible && this.dialogMode === DialogMode.ADD) {
                return this.entityTypeList.filter(i => !listNameEntity.includes(i.name))
            } else {
                return this.entityTypeList
            }
        }
    },
    mounted () {
        if (this.entityTypeList.length < 1) {
            this.$store.dispatch(
                this.$at.nlp.GET_ENTITY_TYPE_LIST,
                { projectId: this.$route.params.projectId }
            )
        }
    },
    methods: {
        selectEntity () {
            if (!this.entityType) {
                return
            }
            for (let i in this.entityList) {
                if (Number(i) === this.editingEntityIndex) {
                    continue
                }
                let item = this.entityList[i]
                if (item.entityType === this.entityType) {
                    this.$appService.inform(this.$f.tc('entityExisted') + ': ' + this.entityType)
                    return
                }
            }
            if (this.dialogMode === DialogMode.EDIT) {
                let item = this.entityList[this.editingEntityIndex]
                item.entityType = this.entityType
                item.entityValue = this.entityValue
            } else {
                this.entityList.push({
                    entityType: this.entityType,
                    entityValue: this.entityValue
                })
            }
            this.entityType = ''
            this.entityValue = ''
            this.editingEntityIndex = -1
            this.toggleMenu()
        },
        deleteEntity (item) {
            let index = this.entityList.findIndex(i => i.entityType === item.entityType)
            if (index >= 0) {
                this.entityList.splice(index, 1)
            } else {
                this.$appService.toastError(this.$f.tc('delete') + ' ' + this.$f.tc('failed'))
            }
        },
        toggleMenu () {
            this.isMenuVisible = !this.isMenuVisible
        },
        showMenu (event) {
            this.$emit('closeVariableSelector')
            this.isMenuVisible = true
            let rect = event.target.getBoundingClientRect()
            this.menuX = rect.x
            this.menuY = rect.y
        },
        getEntities () {
            let entities = []
            for (let item of this.entityList) {
                entities[item.entityType] = item.entityValue
                entities.push({
                    entity: item.entityType,
                    real_value: item.entityValue
                })
            }
            return entities
        },
        addEntity (event) {
            this.dialogMode = DialogMode.ADD
            this.entityType = ''
            this.entityValue = ''
            this.showMenu(event)
        },
        editEntity (event, entityIndex) {
            this.dialogMode = DialogMode.EDIT
            this.showMenu(event)
            this.editingEntityIndex = entityIndex
            this.entityType = this.entityList[entityIndex].entityType
            this.entityValue = this.entityList[entityIndex].entityValue
        }
    }
}
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 3px 12px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  margin: 3px 8px 3px 0;
  cursor: pointer;

  &:hover {
    background: #ccc;
  }
}

.label {
  font-weight: bold;
  font-size: 14px;
  margin-right: 6px;
}

.btn-custom {
  text-transform: inherit !important;
  font-weight: 400;
  padding: 5px 16px !important;
  font-size: 14px;
  height: 32px !important;
  margin-left: 8px;
}

::v-deep .v-input__slot {
  min-height: 32px !important;
  font-size: 14px;
  margin-bottom: 0 !important;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
  color: #D9D9D9 !important;
}

::v-deep .v-btn--outlined {
  border: 1px solid #D9D9D9 !important;
  font-size: 14px;
  font-weight: 400;
  color: #262626;
}
</style>
