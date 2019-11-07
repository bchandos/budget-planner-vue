<template>
    <div id="app">
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
            this.isModalVisible = false;
            this.modalType = '';
        },
        
    },

}
</script>

<style>
    .transaction_form_label {
        display:inline-block;
        width: 7em;
        margin-left: 1em;
    }
    .form_els {
        margin: 0.5em 0;
    }
    .transaction_account {
        display: inline-block;
        width: 11em; 
    }
    .transaction_date {
        display: inline-block;
        width: 6em;
    }
    .transaction_desc {
        display: inline-block;
        width: 22em;
    }
    .transaction_debit {
        display: inline-block;
        width: 4em;
    }
    .not_editing:nth-child(even) {
        background-color: rgba(211, 211, 211, 0.5);
    }
    .editing {
        background-color: rgba(255, 94, 94, 0.5);
        transition-property: all;
        transition-duration: 500ms;
    }
    .not_editing {
        background-color: inherit;
        transition-delay: 250ms;
        transition-duration: 400ms;
    }
    .icon {
        width: 1em;
        padding: 0 0.5em;
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
