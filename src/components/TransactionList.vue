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
        <div v-if="sharedState.transactions.length">
            <TransactionItem 
                v-for="transaction in sortedTransactions" 
                v-bind:class="{ editing: transaction.id == sharedState.transactionEdit.transactionEditId, not_editing: transaction.id != sharedState.transactionEdit.transactionEditId }"
                v-bind:key="transaction.id"
                v-bind:transaction="transaction"
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
import { store } from '../store.js';

export default {
    components: {
        TransactionItem
    },
    data() {
        return {
            sharedState: store.state,
        }
    },
    methods: {
        deleteTrans: function(t) {
            store.deleteTransaction(t);
        },
        sendToEdit: function(t) {
            store.enterEditMode(t);
        },
    },
    computed: {
        sortedTransactions: function() {
            const transactions_copy = [...this.sharedState.transactions];
            return transactions_copy.sort(function(a, b) {return a.date > b.date});
        },
    },
}
</script>
