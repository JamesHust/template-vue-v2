<template>
    <div class="IntentSlotEditor">
        Required Entity
        <v-layout wrap>
            <div v-for="(item, i) in requiredList" :key="i" class="item">
                {{ getSlotDisplayText(item) }}
                <v-icon small @click="deleteSlot(true, i)">mdi-close</v-icon>
            </div>
            <input
                id="IntentSlotEditorRequired"
                type="text"
                v-model="requiredNewEntity"
                class="new-item"
                @focus="focusOnRequired = true"
                @keypress.enter.prevent="addNewItem"
                @keydown="onAutoFillEntityType"
            >
            <v-menu
                activator="#IntentSlotEditorRequired"
                bottom
                nudge-bottom="25"
            >
                <v-card class="fci-list">
                    <div
                        v-for="item in requiredSuggestionList"
                        :key="item.id"
                        class="fci-list-item"
                        @click="selectSuggestion(item)"
                    >{{ item.name }}</div>
                </v-card>
            </v-menu>
        </v-layout>
        <div class="mt-1">Optional Entity</div>
        <v-layout wrap>
            <div v-for="(item, i) in optionalList" :key="i" class="item">
                {{ getSlotDisplayText(item) }}
                <v-icon small @click="deleteSlot(false, i)">mdi-close</v-icon>
            </div>
            <input
                id="IntentSlotEditorOptional"
                type="text"
                v-model="optionalNewEntity"
                class="new-item"
                @focus="focusOnRequired = false"
                @keypress.enter.prevent="addNewItem"
                @keydown="onAutoFillEntityType"
            >
            <v-menu
                activator="#IntentSlotEditorOptional"
                bottom
                nudge-bottom="25"
            >
                <v-card class="fci-list">
                    <div
                        v-for="item in optionalSuggestionList"
                        :key="item.id"
                        class="fci-list-item"
                        @click="selectSuggestion(item)"
                    >{{ item.name }}</div>
                </v-card>
            </v-menu>
        </v-layout>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { INTENT_SLOT_TYPE } from '@/utils/const'

export default {
    name: 'IntentSlotEditor',
    props: {
        items: Array
    },
    data () {
        return {
            focusOnRequired: true,
            requiredList: [],
            requiredNewEntity: '',
            optionalList: [],
            optionalNewEntity: ''
        }
    },
    computed: {
        ...mapState({
            entityTypeList: state => state.nlp.entityTypeList,
            mode: state => state.mode
        }),
        requiredSuggestionList () {
            let suggestionList = this.entityTypeList.filter(item => item.name.includes(this.requiredNewEntity))
            if (suggestionList.length > 5) {
                suggestionList = suggestionList.slice(0, 5)
            }
            return suggestionList
        },
        optionalSuggestionList () {
            let suggestionList = this.entityTypeList.filter(item => item.name.includes(this.optionalNewEntity))
            if (suggestionList.length > 5) {
                suggestionList = suggestionList.slice(0, 5)
            }
            return suggestionList
        }
    },
    mounted () {
        this.$store.dispatch(
            this.$at.nlp.GET_ENTITY_TYPE_LIST,
            { projectId: this.$route.params.projectId }
        )
    },
    methods: {
        addNewItem () {
            let dataList = null
            let newEntityList = null
            if (this.focusOnRequired) {
                dataList = this.requiredList
                newEntityList = this.requiredNewEntity
                this.requiredNewEntity = ''
            } else {
                dataList = this.optionalList
                newEntityList = this.optionalNewEntity
                this.optionalNewEntity = ''
            }
            newEntityList = newEntityList.split(';').map(entity => entity.trim()).filter(entity => !!entity)
            for (let entity in newEntityList) {
                if (this.checkEntityExist(dataList, entity)) {
                    return
                }
            }
            let slot = {
                id: null,
                type: this.focusOnRequired ? INTENT_SLOT_TYPE.REQUIRED : INTENT_SLOT_TYPE.OPTIONAL,
                options: []
            }
            for (let entity of newEntityList) {
                let item = {
                    id: null
                }
                item.entity_type_id = this.$store.state.nlp.mapNameToEntityType.get(entity).id
                item.entity_type_name = entity
                slot.options.push(item)
            }
            dataList.push(slot)
        },
        checkEntityExist (dataList, entity) {
            for (let slot of dataList) {
                for (let option of slot.options) {
                    if (option.entity_type_name === entity) {
                        return true
                    }
                }
            }
            return false
        },
        deleteSlot (isRequired, index) {
            let slotList = isRequired ? this.requiredList : this.optionalList
            slotList.splice(index, 1)
        },
        onAutoFillEntityType (e) {
            if (e.keyCode === 32 && e.ctrlKey) {
                if (this.focusOnRequired) {
                    if (this.requiredSuggestionList.length > 0) {
                        this.requiredNewEntity = this.requiredSuggestionList[0].name
                        this.addNewItem()
                    }
                } else {
                    if (this.optionalSuggestionList.length > 0) {
                        this.optionalNewEntity = this.optionalSuggestionList[0].name
                        this.addNewItem()
                    }
                }
            }
        },
        selectSuggestion (item) {
            if (this.focusOnRequired) {
                this.requiredNewEntity = item.name
                this.addNewItem()
            } else {
                this.optionalNewEntity = item.name
                this.addNewItem()
            }
        },
        getSlotDisplayText (slot) {
            return slot.options.map(option => option.entity_type_name).join('; ')
        },
        setData (items) {
            this.requiredList = []
            this.optionalList = []
            for (let item of items) {
                if (item.type === INTENT_SLOT_TYPE.REQUIRED) {
                    this.requiredList.push(item)
                } else {
                    this.optionalList.push(item)
                }
            }
        },
        getData () {
            return this.requiredList.concat(this.optionalList)
        },
        clearInput () {
            this.requiredNewEntity = ''
            this.optionalNewEntity = ''
        }
    }
}
</script>

<style scoped lang="scss">
.item {
    border: 1px solid #ccc;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 5px;
    margin: 0 5px 5px 0;
}

.new-item {
    border: 1px solid blue;
    height: 20px;
    border-radius: 10px;
    padding: 0 5px;
    width: 100px;

    &:focus {
        outline: none;
    }
}
</style>
