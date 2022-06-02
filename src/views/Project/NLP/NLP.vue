<template>
    <div class="NLP">
        <v-layout align-center>
            <v-tabs v-model="tab" style="flex: 0 0 550px">
                <v-tab>{{ $f.tc('intent') }}</v-tab>
                <v-tab>{{ $f.tc('entityType') }}</v-tab>
                <v-tab>{{ $f.tc('nlpSample') }}</v-tab>
                <v-tab v-if="mode === 'projects'">{{ $f.tc('cacheData') }}</v-tab>
            </v-tabs>
        </v-layout>
        <v-tabs-items v-model="tab">
            <v-tab-item>
                <IntentList></IntentList>
            </v-tab-item>
            <v-tab-item>
                <EntityTypeList></EntityTypeList>
            </v-tab-item>
            <v-tab-item>
                <SampleList></SampleList>
            </v-tab-item>
            <v-tab-item v-if="mode === 'projects'">
                <CacheData></CacheData>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
import IntentList from '@/views/Project/NLP/IntentList'
import EntityTypeList from '@/views/Project/NLP/EntityTypeList'
import SampleList from '@/views/Project/NLP/SampleList'
import CacheData from '@/views/Project/NLP/CacheData'
import { mapState } from 'vuex'

export default {
    name: 'NLP',
    components: {
        CacheData,
        SampleList,
        EntityTypeList,
        IntentList
    },
    computed: {
        ...mapState({
            mode: state => state.mode
        })
    },
    mounted () {
        let tab = Number(this.$route.query.tab)
        if (Number.isInteger(tab)) {
            this.tab = tab
        }
    },
    data () {
        return {
            tab: 0
        }
    },
    watch: {
        tab () {
            let tab = Number(this.$route.query.tab)
            if (this.tab !== tab) {
                this.$router.replace({
                    query: {
                        tab: this.tab
                    }
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
.NLP {
  background: #fff;
}

::v-deep .theme--light.v-tabs-items {
  height: calc(100vh - 112px);
  overflow-y: auto;
}
</style>
