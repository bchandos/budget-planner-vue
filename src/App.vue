<template>
    <div id="app">
        <InputForm 
            v-bind:editMode="editMode" 
            v-bind:date="date"
            v-bind:banks="banks" 
            v-bind:bank_select="bank_select" 
            v-bind:description="description"
            v-bind:categories="categories"
            v-bind:category_select="category_select"
            v-bind:debit="debit"
            v-on:exitEdit="exitEdit"
            v-on:postData="postData"
             />

        <TransactionList 
            v-bind:transactions="sortedTransactions" 
            v-bind:id="edit_id"
            v-bind:editMode="editMode"
            v-bind:edit_id="edit_id"
            @edit="editTrans($event)"
            @delete="deleteTrans($event)"
             />
    </div>
</template>

<script>
import TransactionList from './components/TransactionList.vue'
import InputForm from './components/InputForm.vue'

export default {
    name: 'app',
    components: {
        TransactionList,
        InputForm
    },
    data() {
        return {
            editMode: false,
            edit_id: -1,
            description: '',
            date: '',
            debit: null,
            bank_select: null,
            category_select: null,
            categories: [{text: 'dick butts', value: 1},            
                         {text: 'butt dicks', value: 2}, 
                         {text: 'boobies', value: 3}],
            banks: [],
            transactions: []
        }
    },
    created: async function () {
        // Fetch accounts from an API
        const response_accounts = await fetch('http://127.0.0.1:8080/api/v0.1/accounts');
        const json_accounts = await response_accounts.json();
        json_accounts.payload.forEach((e) => {
            this.banks.push({text: e.name, value: e.id});
            }
        );
        
        // Fetch transactions from an API
        const response_trans = await fetch('http://127.0.0.1:8080/api/v0.1/transactions');
        const json_trans = await response_trans.json();
        this.transactions = json_trans.payload;
        this._debugVals();
    },
    methods: {
        postData: async function() {
            if (!this.editMode) {
                let url = 'http://127.0.0.1:8080/api/v0.1/transaction';
                let form_data = {description: this.description,
                                account: this.bank_select,
                                debit: this.debit,
                                date: this.date};
                const response = await fetch(url, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form_data) // body data type must match "Content-Type" header
                });
                if (response.status == 201) {
                    let json = await response.json();
                    this.transactions.push(json.payload);
                    this._debugVals();
                }
            } else if (this.editMode) {
                let url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + this.edit_id;
                let form_data = {description: this.description,
                                account: this.bank_select,
                                debit: this.debit,
                                date: this.date};
                const response = await fetch(url, {
                    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form_data) // body data type must match "Content-Type" header
                });
                if (response.status == 201) {
                    let json = await response.json();
                    this.transactions = this.transactions.filter(function(o) {return o.id != json.payload.id});
                    this.transactions.push(json.payload);
                    this.exitEdit();
                }
            }
        },
        deleteTrans: async function(transaction) {
            this.exitEdit()
            let url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + transaction.id;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status == 200){
                // let json = await response.json();
                this.transactions = this.transactions.filter(function(o) {return o != transaction});
            }
            
        },
        editTrans: async function(transaction) {
            if (transaction) {
                this.date = transaction.date.slice(0,10);
                this.description = transaction.description;
                this.bank_select = transaction.account;
                this.debit = transaction.debit;
                this.edit_id = transaction.id;
                this.editMode = true;
            }
        },
        exitEdit: function() {
            this.editMode = false;
            this._debugVals();
        },
        _debugVals: function() {
            this.edit_id = -1;
            let dict = ['Williamsburg distillery', 'dreamcatcher', 'selfies', 'tumblr', 'palo santo', 'Edison bulb', 'roof party', 'copper mug'];
            this.description = dict[Math.floor(Math.random()*dict.length)] + ' ' + dict[Math.floor(Math.random()*dict.length)];
            let d = new Date(Math.random()*3000000000000);
            this.date = d.toISOString().slice(0, 10);
            this.debit = Math.floor(Math.random()*1000);
            this.bank_select = this.banks[Math.floor(Math.random()*this.banks.length)].value
            this.category_select = 1;
        },
        _defaultVals: function() {
            this.edit_id = -1;
            this.description = '';
            this.date = '';
            this.debit = null;
            this.bank_select = null;
            this.category_select = null;
        },
        bankName: function(id) {
            return this.banks.find((e) => {return e.value == id}).text;
            // return x.text;
        }
    },
    computed: {
        sortedTransactions: function() {
            const transactions_copy = [...this.transactions];
            return transactions_copy.sort(function(a, b) {return a.date > b.date});
            // return this.transactions.slice(0).sort(function(a, b) {return a.date > b.date});
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
        max-width: 50%;
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
