<template>
    <component
        :is="MapNameToIcon[name]"
        :color="color"
    ></component>
</template>

<script>
import IconFlowGraphStandard from '@/components/icons/IconFlowGraphStandard'
import IconFlowGraphContain from '@/components/icons/IconFlowGraphContain'
import IconFlowGraphFrom from '@/components/icons/IconFlowGraphFrom'
import IconFlowGraphTo from '@/components/icons/IconFlowGraphTo'
import IconEdit from '@/components/icons/IconEdit'
import IconDelete from '@/components/icons/IconDelete'
import IconCheckBoxCircle from '@/components/icons/IconCheckBoxCircle'
import IconGraph from '@/components/icons/IconGraph'
import IconTable from '@/components/icons/IconTable'

const MapNameToIcon = {
    FlowGraphStandard: IconFlowGraphStandard,
    FlowChartContain: IconFlowGraphContain,
    FlowChartFrom: IconFlowGraphFrom,
    FlowChartTo: IconFlowGraphTo,
    Edit: IconEdit,
    Delete: IconDelete,
    CheckBoxCircle: IconCheckBoxCircle,
    Graph: IconGraph,
    Table: IconTable
}
export default {
    name: 'Icon',
    props: {
        name: String,
        color: String
    },
    data () {
        return {
            MapNameToIcon
        }
    }
}
</script>

<style scoped lang="scss">

</style>
