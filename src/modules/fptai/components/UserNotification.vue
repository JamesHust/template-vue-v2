<template>
    <div class="ml-3 mr-4">
        <v-menu offset-y :nudge-width="200" nudge-bottom="21">
            <template v-slot:activator="{ on }">
                <v-badge>
                    <template v-slot:badge>0</template>
                    <v-icon style="color: #fff" v-on="on">mdi-bell</v-icon>
                </v-badge>
            </template>
            <v-list>
                <v-list-tile
                    v-for="item in notificationList"
                    :key="item.id"
                >
                    <v-list-tile-title>{{item.title}}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>
<script>
export default {
    name: 'UserNotification',
    data () {
        return {
            notificationList: [
                {
                    title: 'Welcome to Console',
                    id: 'id1'
                },
                {
                    title: 'New project created',
                    id: 'id2'
                },
                {
                    title: 'New API enabled',
                    id: 'id3'
                }
            ]
        }
    }
}
</script>
<style scoped>
    /deep/ .v-badge__badge {
        right: -16px;
    }

    /deep/ .v-list__tile {
        border-bottom: 1px solid #ccc;
        cursor: pointer;
    }
</style>
