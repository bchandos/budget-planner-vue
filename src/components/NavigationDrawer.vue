<template>
    <v-navigation-drawer v-model="sharedState.drawerOpen" app>
        <v-list dense>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Home</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-cog</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Settings</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link @click="sharedState.importDialog = true">
                <v-list-item-action>
                    <v-icon>mdi-upload</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Add New Transaction</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { store } from "../store";
export default {
    components: {},
    data: () => ({
        sharedState: store.state,
    }),
    methods: {

    },
    computed: {
        
    }
};
</script>