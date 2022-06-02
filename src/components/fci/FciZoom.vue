<template>
    <v-layout align-center class="zoom" :style="{height: height + 'px'}">
        <div @click="zoomOut" class="minus" :style="{width: height + 'px'}">
            <img src="/img/graph/zoom-out.svg"/>
        </div>
        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <div class="level" v-on="on">{{ percentage }}%</div>
            </template>
            <div class="fci-list">
                <div class="fci-list-item" @click="zoom(0.2)">20%</div>
                <div class="fci-list-item" @click="zoom(0.5)">50%</div>
                <div class="fci-list-item" @click="zoom(1.0)">100%</div>
                <div class="fci-list-item" @click="zoom(1.5)">150%</div>
                <div class="fci-list-item" @click="zoom(2.0)">200%</div>
            </div>
        </v-menu>
        <div @click="zoomIn" class="plus" :style="{width: height + 'px'}">
            <img src="/img/graph/zoom-in.svg"/>
        </div>
    </v-layout>
</template>

<script>

export default {
    name: 'FciZoom',
    props: {
        value: Number,
        height: {
            type: Number,
            default: 38
        }
    },
    data () {
        return {
            valueInner: 100
        }
    },
    computed: {
        percentage () {
            return Math.round(this.valueInner * 100)
        }
    },
    methods: {
        zoomIn () {
            this.zoom(this.valueInner + 0.25)
        },
        zoomOut () {
            this.zoom(this.valueInner - 0.25)
        },
        zoom (zoom) {
            if (zoom > 0) {
                this.$emit('input', zoom)
            }
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function () {
                this.valueInner = this.value
            }
        }
    }
}
</script>

<style scoped lang="scss">
.zoom {
  background: #fff;
  flex-grow: 0;
  border: 1px solid #D9D9D9;
  border-radius: 5px;
  height: 38px;

  .minus {
    border-right: 1px solid #D9D9D9;
    width: 38px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: #e5e5e5;
    }
  }

  .plus {
    border-left: 1px solid #D9D9D9;
    width: 38px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: #e5e5e5;
    }
  }

  .level {
    height: 100%;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    font-size: 14px;

    &:hover {
      background: #d1d2d5;
    }
  }

  img {
    width: 16px;
    height: 16px;
    user-select: none;
  }

  i {
    user-select: none;
  }
}
</style>
