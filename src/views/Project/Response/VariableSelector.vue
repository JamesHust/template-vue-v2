<template>
    <div class="VariableSelector">
        <div class="d-flex align-center" style="margin-top: 12px">
            <div class="label align-self-start">{{ $f.tc('variable') }}</div>
            <img
                    @click="addVariable"
                    src="/img/kb/add_item.svg"
                    alt="icon_add_variable"
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
                    <v-text-field
                            dense outlined hide-details
                            v-model="variableName"
                            style="margin-right: 8px"
                            :placeholder="$f.tc('name')"
                    ></v-text-field>
                    =
                    <v-text-field
                            dense outlined hide-details
                            v-model="variableValue"
                            style="margin-left: 8px"
                            :placeholder="$f.tc('value')"
                    ></v-text-field>
                    <v-btn class="btn-custom" outlined @click="toggleMenu">{{ $f.tc('cancel') }}</v-btn>
                    <v-btn color="primary" class="btn-custom" @click="selectVariable">{{ $f.tc('save') }}</v-btn>
                </v-layout>
            </v-menu>
        </div>
        <div class="d-flex align-center flex-wrap">
            <div v-for="(item, i) in variableList" :key="i" class="item" @click="editVariable($event, i)">
                {{ item.variableName }} = {{ item.variableValue ? item.variableValue : 'null' }}
                <img
                        @click.stop="deleteVariable(item)"
                        src="/img/kb/delete_item_grey.svg"
                        alt="icon_delete_variable"
                        style="cursor: pointer; margin-left: 8px"
                >
            </div>
        </div>
    </div>
</template>

<script>

const DialogMode = {
    EDIT: 'EDIT',
    ADD: 'ADD'
}

export default {
    name: 'VariableSelector',
    data () {
        return {
            dialogMode: DialogMode.ADD,
            variableList: [],
            isMenuVisible: false,
            menuX: 0,
            menuY: 0,
            variableName: '',
            variableValue: '',
            editingVariableIndex: -1
        }
    },
    methods: {
        selectVariable () {
            if (!this.variableName) {
                return
            }
            for (let i in this.variableList) {
                if (Number(i) === this.editingVariableIndex) {
                    continue
                }
                let item = this.variableList[i]
                if (item.variableName === this.variableName) {
                    this.$appService.toastWarning(this.$f.tc('entityExisted') + ': ' + this.variableName)
                    return
                }
            }
            if (this.dialogMode === DialogMode.EDIT) {
                let item = this.variableList[this.editingVariableIndex]
                item.variableName = this.variableName
                item.variableValue = this.variableValue
            } else {
                this.variableList.push({
                    variableName: this.variableName,
                    variableValue: this.variableValue
                })
            }
            this.variableName = ''
            this.variableValue = ''
            this.editingVariableIndex = -1
            this.toggleMenu()
        },
        deleteVariable (item) {
            let index = this.variableList.findIndex(i => i.variableName === item.variableName)
            if (index >= 0) {
                this.variableList.splice(index, 1)
            } else {
                this.$appService.toastError(this.$f.tc('delete') + ' ' + this.$f.tc('failed'))
            }
        },
        toggleMenu () {
            this.isMenuVisible = !this.isMenuVisible
        },
        showMenu (event) {
            this.$emit('closeEntitySelector')
            this.isMenuVisible = true
            let rect = event.target.getBoundingClientRect()
            this.menuX = rect.x
            this.menuY = rect.y
        },
        getVariables () {
            let variables = {}
            for (let item of this.variableList) {
                variables[item.variableName] = item.variableValue
            }
            return variables
        },
        addVariable (event) {
            this.dialogMode = DialogMode.ADD
            this.variableName = ''
            this.variableValue = ''
            this.showMenu(event)
        },
        editVariable (event, idx) {
            this.dialogMode = DialogMode.EDIT
            this.showMenu(event)
            this.editingVariableIndex = idx
            this.variableName = this.variableList[idx].variableName
            this.variableValue = this.variableList[idx].variableValue
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
