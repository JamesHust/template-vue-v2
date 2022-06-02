<template>
    <div class="FciTabs" :style="tabListStyle">
        <div
                v-for="(item, i) in items"
                :key="i"
                :class="{active: item.value === value}"
                @click="onClickItem(item)"
                class="tab"
                :style="{flex: `0 0 ${itemWidth}px`}"
        >
            <template v-if="$scopedSlots.item">
                <slot name="item" :item="item"></slot>
            </template>
            <template v-else>
                {{ item.text }}
            </template>
            <img src="/img/graph/close-tab.svg" alt="icon_close_tab" @click.stop="closeTab(item)" class="icon-close" v-if="items.length > 1">
        </div>
    </div>
</template>

<script>
export default {
    name: 'FciTabs',
    props: {
        items: Array,
        value: String,
        itemWidth: {
            type: Number,
            default: 110
        }
    },
    computed: {
        tabListStyle () {
            return {
                width: this.itemWidth * this.items.length + 'px',
                flex: `0 0 ${this.itemWidth * this.items.length}px`
            }
        }
    },
    methods: {
        onClickItem (item) {
            this.$emit('input', item.value)
        },
        closeTab (item) {
            this.$emit('close-tab', item.value)
        }
    }
}
</script>

<style scoped lang="scss">
.FciTabs {
  display: flex;
  cursor: pointer;
  height: 30px;

  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5F5F5;
    border-right: 1px solid #D9D9D9;
    border-bottom: 1px solid #D9D9D9;

    &:hover {
      background: #f6f6f6;
    }

    &.active {
      background: #fff;
      color: #0052cc;
      border-bottom: 1px solid #0052cc;
    }
  }
}

.icon-close {
  margin-right: 9px;
  padding: 1px;
  border-radius: 50%;

  &:hover {
    background: #d1d2d5;
  }
}
</style>
