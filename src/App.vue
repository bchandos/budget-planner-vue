<template>
    <v-app id="main-app">
        <NavigationDrawer />
        <ImportForm />
        <EditTransactionForm />
        <NewTransactionForm />
        <NewCategoryForm />
        <BalanceSheet />
        <EditAccountForm />
        <v-app-bar app color="teal">
            <v-app-bar-nav-icon @click.stop="sharedState.drawerOpen = !sharedState.drawerOpen" />
            <v-toolbar-title>Budget Planner</v-toolbar-title>
            <v-btn icon @click.native="sharedState.newTransactionDialog = true">
                <v-icon>mdi-cash-plus</v-icon>
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-row justify="center">
                <v-alert
                    dense
                    width="40em"
                    type="warning"
                    transition="slide-y-transition"
                    dismissible
                    v-show="sharedState.toastMessage"
                >{{ sharedState.toastMessage }}</v-alert>
            </v-row>
            
            <TransactionList />
        </v-main>
    </v-app>
</template>

<script>
import { store } from './store.js';
import TransactionList from './components/TransactionList.vue';
import EditTransactionForm from './components/EditTransactionForm.vue';
import ImportForm from './components/ImportForm.vue';
import EditAccountForm from './components/EditAccountForm.vue';
import BalanceSheet from './components/BalanceSheet.vue';
import NavigationDrawer from './components/NavigationDrawer.vue';
import NewTransactionForm from './components/NewTransactionForm.vue';
import NewCategoryForm from './components/NewCategoryForm.vue';

export default {
    name: 'app',
    components: {
        TransactionList,
        EditTransactionForm,
        ImportForm,
        EditAccountForm,
        BalanceSheet,
        NavigationDrawer,
        NewTransactionForm,
        NewCategoryForm,
    },
    data() {
        return {
            sharedState: store.state,
        }
    },

    created: function() {
            // store.getApiKey();
            store.loadTransactions();
            store.loadBanks();
            store.loadCategories();
            // debug
            store.setToastMessage('Welcome to the Budget Planner example app. Feel free to edit data; changes do not persist.');
    },
    computed: {
    },
    watch: {
    },
    methods: {
        clearToast: function() {
            store.clearToastMessage();
        }
        
    },

}
</script>

<style>

</style>
