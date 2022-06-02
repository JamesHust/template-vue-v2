<template>
    <div class="FciButtonToggle" :style="{height: height + 'px'}">
        <div
                v-for="item in items"
                :key="item.value"
                class="FciButtonToggleItem"
                :class="{active: item.value === value}"
                :style="{minWidth: height + 'px'}"
                @click="updateValue(item.value)"
        >
            {{ item.text }}
            <Icon
                    v-if="item.icon"
                    :name="item.icon"
                    :color="item.value === value ? '#fff' : '#8b8fa3'"
            ></Icon>
        </div>
    </div>
</template>

<script>
import Icon from '@/components/icons/Icon'

export default {
    name: 'FciButtonToggle',
    components: { Icon },
    props: {
        items: Array,
        value: String,
        height: {
            type: Number,
            default: 32
        }
    },
    methods: {
        updateValue (value) {
            this.$emit('input', value)
        }
    }
}
</script>

<style scoped lang="scss">
.FciButtonToggle {
  border-radius: 5px;
  display: flex;
  overflow: hidden;

  .FciButtonToggleItem {
    border: 1px solid #D9D9D9;
    border-right: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    cursor: pointer;
    transition: all 0.5s ease;

    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      border-right: 1px solid #D9D9D9;
    }

    &:hover {
      background: #d1d2d5;
    }

    &.active {
      background: #0052CC;
      border-color: #0052CC;
      color: #fff;
    }
  }
}
</style>
