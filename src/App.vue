<template>
    <v-app id="main-app">
        <TransactionForm />
        <TransactionList />
    </v-app>
</template>

<script>
import { store } from './store.js';
import TransactionList from './components/TransactionList.vue';
import TransactionForm from './components/TransactionForm.vue';
import ImportForm from './components/ImportForm.vue';
import AccountForm from './components/AccountForm.vue';
import BalanceSheet from './components/BalanceSheet.vue'
import Modal from './components/Modal.vue';

export default {
    name: 'app',
    components: {
        TransactionList,
        TransactionForm,
        ImportForm,
        AccountForm,
        BalanceSheet,
        Modal,
    },
    data() {
        return {
            sharedState: store.state,
            isModalVisible: false,
            modalType: '',
        }
    },

    created: function() {
            // store.getApiKey();
            store.loadTransactions();
            store.loadBanks();
            store.loadCategories();
            // debug
            // store.setToastMessage('Test message');
    },
    computed: {
        inEditMode: function() {
            return this.sharedState.transactionEdit.editMode;
        }
    },
    watch: {
        inEditMode() {
            if (this.sharedState.transactionEdit.editMode) {
                this.showTransModal();
            }
        }
    },
    methods: {
        showTransModal: function() {
            this.modalType = 'transaction';
            this.isModalVisible = true;
        },
        showImportModal: function() {
            this.modalType = 'import';
            this.isModalVisible = true;
        },
        showAccountModal: function() {
            this.modalType = 'account';
            this.isModalVisible = true;
        },
        showBalanceModal: function() {
            this.modalType = 'balance';
            this.isModalVisible = true;
        },
        closeModal: function() {
            if (this.modalType == 'transaction' && this.inEditMode) {
                store.exitEditMode();
            }
            this.isModalVisible = false;
            this.modalType = '';
        },
        clearToast: function() {
            store.clearToastMessage();
        }
        
    },

}
</script>

<style>
    #main-app {
        width: 70%;
        margin: 0 auto;
        padding: 0 2em;
        background-color: #fdfdfd;
    }
</style>
