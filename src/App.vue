<template>
    <div id="app">
        <div id="toast-message" v-show="sharedState.toastMessage">{{ sharedState.toastMessage }}</div>
        <button type="button" class="btn" @click="showTransModal">Add New Transaction</button>
        <button type="button" class="btn" @click="showImportModal">Import Transactions</button>
        <button type="button" class="btn" @click="showAccountModal">Account Settings</button>
        
        <modal v-if="modalType == 'transaction'" v-show="isModalVisible" @close="closeModal">
            <template v-slot:header>
                <p></p>
            </template>
            <template v-slot:body>        
                <TransactionForm 
                    @close="closeModal"
                    />
            </template>
        </modal>

        <modal v-else-if="modalType == 'import'" v-show="isModalVisible" @close="closeModal">
            <template v-slot:header>
                <p></p>
            </template>
            <template v-slot:body>        
                <ImportForm
                    @transactionCreated="transactionCreated"
                    @close="closeModal"
                />
            </template>
        </modal>

        <modal v-else-if="modalType == 'account'" v-show="isModalVisible" @close="closeModal">
            <template v-slot:header>
                <p></p>
            </template>
            <template v-slot:body>        
                <AccountForm />
            </template>
        </modal>

        <TransactionList />
    </div>
</template>

<script>
import { store } from './store.js';
import TransactionList from './components/TransactionList.vue';
import TransactionForm from './components/TransactionForm.vue';
import ImportForm from './components/ImportForm.vue';
import AccountForm from './components/AccountForm.vue';
import Modal from './components/Modal.vue';

export default {
    name: 'app',
    components: {
        TransactionList,
        TransactionForm,
        ImportForm,
        AccountForm,
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
            store.loadTransactions();
            store.loadBanks();
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
        closeModal: function() {
            if (this.modalType == 'transaction' && this.inEditMode) {
                store.exitEditMode();
            }
            this.isModalVisible = false;
            this.modalType = '';
        },
        
    },

}
</script>

<style>
    #app {
        width: 70%;
        margin: 0 auto;
        padding: 0 2em;
        background-color: #fdfdfd;
    }
    #toast-message {
        width: 70%;
        margin: 1em;
        padding: 1em;
        border: 1px solid rgba(255, 94, 94, 0.5);
        background-color:rgba(216, 130, 130, 0.5);
        border-radius: 5px;
    }
    .form_els {
        margin: 0.5em 0;
    }    
    .icon {
        width: 1.25em;
    }
    .btn {
        background-color: lightgray;
        border: 1px solid lightgray;
        color: black;
        font-size: 1.2em;
        padding: 0.5em 1em;
        margin: 0.5em 1em;
        border-radius: 4px;
        transition-duration: 200ms;
    }
    .btn:disabled {
        color: gray;
        opacity: 0.8;
    }
    .btn:hover:not([disabled]) {
        border: 1px solid gray;
        transition-duration: 400ms;
    }

    #transaction_form {
        max-width: 95%;
        border: 1px solid black;
        padding: 1em;
        background-color: rgba(250, 250, 210, 0.5);
        border-radius: 3px;
    }

    #transaction_form.editing {
        border: 1px solid green;
        background-color: rgba(255, 94, 94, 0.5);
    }
</style>
