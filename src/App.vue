<template>
    <div id="app">
        <button type="button" class="btn" @click="showModal">Add New Transaction</button>
        <modal v-show="isModalVisible" @close="closeModal">
            <template v-slot:header>
                <p></p>
            </template>
            <template v-slot:body>        
                <InputForm 
                    v-bind:editTransaction="editTransaction"
                    @transactionCreated="transactionCreated"
                    @transactionEdited="transactionEdited"
                    @exitEdit="exitEdit"
                    />
            </template>

        </modal>

        <TransactionList 
            v-bind:editedTransaction="editedTransaction"
            v-bind:createdTransaction="createdTransaction"
            v-bind:gEditMode="editMode"
            v-bind:editId="editId"
            @sendToEdit="sendToEdit"
            @exitEdit="exitEdit"
             />
    </div>
</template>

<script>
import TransactionList from './components/TransactionList.vue';
import InputForm from './components/InputForm.vue';
import Modal from './components/Modal.vue';

export default {
    name: 'app',
    components: {
        TransactionList,
        InputForm,
        Modal
    },
    data() {
        return {
            editTransaction: null, // transaction to edit
            editedTransaction: null, // transaction that has been edited
            createdTransaction: null, // transaction that has been created
            editMode: false,
            editId: -1,
            isModalVisible: false
        }
    },
    
    methods: {
        exitEdit: function() {
            this.isModalVisible = false;
            this.editMode = false;
            this.editTransaction = null;
            this.editId = -1;
        },

        transactionCreated: function(t) {
            // console.log(t);
            this.createdTransaction = t;
        },
        transactionEdited: function(t) {
            // console.log(t);
            this.editedTransaction = t;
            this.editMode = false;
            this.editId = -1;
        },
        sendToEdit: function(t) {
            this.editTransaction = t;
            this.editMode = true;
            this.editId = t.id;
            this.isModalVisible = true;
        },
        showModal: function() {
            this.isModalVisible = true;
        },
        closeModal: function() {
            this.isModalVisible = false;
            this.exitEdit();
        }
        
    },

}
</script>

<style>
    .transaction_form_label {
        display:inline-block;
        min-width: 7em;
        margin-left: 1em;
    }
    .form_els {
        margin: 0.5em 0;
    }
    .transaction_account {
        display: inline-block;
        min-width: 11em;
    }
    .transaction_date {
        display: inline-block;
        min-width: 11em;
    }

    .transaction_desc {
        display: inline-block;
        min-width: 20em;
    }
    .transaction_debit {
        display: inline-block;
        min-width: 4em;
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
