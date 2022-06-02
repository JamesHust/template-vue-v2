<template>
    <div class="ConditionEditor">
        <div class="d-flex align-center">
            <div style="font-size: 14px; font-weight: bold; margin-right: 8px">{{ $f.tc('condition') }}</div>
            <img
                    @click="addItem"
                    src="/img/kb/add_item.svg"
                    alt="icon_add_condition"
                    style="cursor: pointer"
            >
        </div>
        <table style="width: 100%">
            <tr v-for="(condition, i) in conditionList" :key="i">
                <td style="width: 230px">
                    <v-radio-group dense hide-details row v-model="condition.variable_type">
                        <v-radio :value="VariableType.ENTITY" label="entity"></v-radio>
                        <v-radio :value="VariableType.QUERY_LENGTH" label="# query results"></v-radio>
                    </v-radio-group>
                    <v-textarea hide-details outlined rows="1" v-model="condition.variable"></v-textarea>
                </td>
                <td style="width: 72px; padding-left: 4px; padding-right: 4px">
                    <v-select
                            outlined dense
                            :items="operatorList"
                            v-model="condition.operator"
                            class="operator"
                            :style="[i === 0 ? {'padding-top': '33px', 'text-align': 'center'} : {'padding-top': '44px'}]"
                    ></v-select>
                </td>
                <td style="width: 230px">
                    <v-radio-group dense hide-details row v-model="condition.value_type">
                        <v-radio :value="ValueType.TEXT" label="text"></v-radio>
                        <v-radio :value="ValueType.NUMBER" label="number"></v-radio>
                        <v-radio :value="ValueType.QUERY" label="query"></v-radio>
                    </v-radio-group>
                    <v-textarea hide-details outlined rows="1" v-model="condition.value"></v-textarea>
                </td>
                <td style="text-align: end; margin-left: 3px"
                    :style="[i === 0 ? {'padding-top': '31px'} : {'padding-top': '41px'}]">
                    <v-btn icon @click="deleteItem(i)" style="width: 30px; height: 30px">
                        <v-icon size="19">mdi-delete</v-icon>
                    </v-btn>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>

const operatorList = ['=', '!=', '>', '<', '>=', '<=', 'in', '!in']
const VariableType = {
    ENTITY: 'entity',
    QUERY_LENGTH: 'query_length'
}
const ValueType = {
    TEXT: 'text',
    NUMBER: 'number',
    QUERY: 'query'
}

export default {
    name: 'ConditionEditor',
    props: {
        value: Array
    },
    data () {
        return {
            VariableType,
            ValueType,
            operatorList,
            conditionList: []
        }
    },
    methods: {
        save () {
            let conditionList = this.$ut.cloneObject(this.conditionList)
            if (!this.$ut.cov(this.conditionList, this.value)) {
                this.$emit('input', conditionList)
            }
        },
        addItem () {
            this.conditionList.unshift({
                variable: '',
                variable_type: VariableType.ENTITY,
                operator: '=',
                value: '',
                value_type: ValueType.TEXT
            })
        },
        deleteItem (index) {
            this.conditionList.splice(index, 1)
        },
        getConditions () {
            return this.$ut.cloneObject(this.conditionList)
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function () {
                this.conditionList = this.$ut.cloneObject(this.value)
                this.conditionList.forEach(condition => {
                    if (!condition.variable_type) {
                        condition.variable_type = VariableType.ENTITY
                    }
                    if (!condition.value_type) {
                        condition.value_type = ValueType.TEXT
                    }
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep textarea {
  margin-top: 8px !important;
}

::v-deep .v-input--selection-controls__input {
  margin-right: 5px !important;
}

::v-deep .operator {
  .mdi-menu-down::before {
    height: 30px !important;
  }

  .v-icon.v-icon {
    font-size: 22px !important;
    margin-top: 7px;
  }
}

::v-deep .v-icon.v-icon {
  font-size: 18px !important;
}

::v-deep .v-select__selections {
  display: flex;
  justify-content: center;
}

::v-deep .v-radio {
  margin-right: 12px !important;
}

::v-deep .v-label {
  font-size: 14px;
  color: #262626;
}

::v-deep .v-input--selection-controls {
  margin-top: 12px;
  padding-top: 0;
}

::v-deep .v-input__slot {
  border-radius: 5px !important;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
  color: #D9D9D9 !important;
}

.v-select {
  ::v-deep .v-input__slot {
    height: 40px !important;
    text-align: center !important;
    padding: 0 12px !important;
    font-size: 16px;
  }
}

::v-deep .v-select__selection--comma {
  margin: 0 !important;
}

tr:first-child {
  ::v-deep .v-input--selection-controls {
    margin-top: 0px;
  }
}

::v-deep .v-list-item .v-list-item__title {
  font-size: 14px !important;
  font-weight: 400 !important;
}

table {
  border: none;
  border-collapse: collapse;
}
</style>
