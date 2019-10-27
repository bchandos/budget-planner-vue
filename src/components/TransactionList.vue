<template>
    <div>
        <h2>Transactions</h2>
            <div>
                <span class="transaction_account"><strong>Account</strong></span>
                <span class="transaction_date"><strong>Date</strong></span>
                <span class="transaction_desc"><strong>Description</strong></span>
                <span class="transaction_debit"><strong>Debit</strong></span>
                <span><strong>Edit</strong></span>
                <span><strong>Delete</strong></span>
            </div>
        <div v-if="transactions.length">
            <TransactionItem 
                v-for="transaction in sortedTransactions" 
                v-bind:class="{ editing: transaction.id == editId, not_editing: transaction.id != editId }"
                v-bind:key="transaction.id"
                v-bind:transaction="transaction"
                v-bind:editMode="editMode"
                v-bind:editId="editId"
                v-bind:bank="banks[transaction.account] || ''"
                @edit="sendToEdit"
                @delete="deleteTrans"
                @edit-off="$emit('exitEdit')"
                />
        </div>
        <div v-else>
            <h2>No transactions to display</h2>
        </div>
    </div>
</template>

<script>
import TransactionItem from './TransactionItem.vue'

export default {
    components: {
        TransactionItem
    },
    props: {
        editedTransaction: {
            // use a custom validator as empty objects are not falsy
            validator: prop => typeof prop === 'object' || prop === null,
            required: true
        },
        createdTransaction: {
            // use a custom validator as empty objects are not falsy
            validator: prop => typeof prop === 'object' || prop === null,
            required: true
        },
        gEditMode: {
            type: Boolean,
            required: true
        },
        editId: {
            type: Number,
            required: true
        },
    },
    data() {
        return {
            transactions: [],
            editMode: false,
            // banks is an object here so it can easily be passed via bracketed lookup
            // this also seemed to solve async issues, but I'm not sure why...
            banks: {}
        }
    },
    created: async function() {
        // Setup
        this.editMode = this.gEditMode;
        // Fetch transactions from an API
        const response_trans = await fetch('http://127.0.0.1:8080/api/v0.1/transactions');
        const json_trans = await response_trans.json();
        this.transactions = json_trans.payload;
        
        // Fetch accounts from an API
        const response_accounts = await fetch('http://127.0.0.1:8080/api/v0.1/accounts');
        const json_accounts = await response_accounts.json();
        json_accounts.payload.forEach((e) => {
            this.$set(this.banks, e.id, e.name);
            }
        );
    },
    watch: {
        editedTransaction: function() {
            if (this.editedTransaction) {
                let e = this.editedTransaction
                this.transactions = this.transactions.filter(function(o) {return o.id != e.id});
                this.transactions.push(this.editedTransaction);
            }
        },
        createdTransaction: function() {
            if (this.createdTransaction) {
                this.transactions.push(this.createdTransaction);
                this.transactions = this.transactions.flat(Infinity);
                }
        },
        gEditMode: function() {
            this.editMode = this.gEditMode;
        }
    },
    methods: {
        deleteTrans: async function(t) {
            this.$emit('exitEdit');
            let url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + t.id;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status == 200){
                // let json = await response.json();
                this.transactions = this.transactions.filter(function(o) {return o != t});
            }
        },
        sendToEdit: function(t) {
            this.editMode
            this.$emit('sendToEdit', t);
        },

    },
    computed: {
        sortedTransactions: function() {
            const transactions_copy = [...this.transactions];
            return transactions_copy.sort(function(a, b) {return a.date > b.date});
            // return this.transactions.slice(0).sort(function(a, b) {return a.date > b.date});
        },
    },
}
</script>
