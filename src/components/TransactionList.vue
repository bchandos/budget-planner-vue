<template>
    <div>
        <h2>Existing Transactions</h2>
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
                v-for="transaction in transactions" 
                v-bind:class="{ editing: transaction.id == id, not_editing: transaction.id != id }"
                v-bind:key="transaction.id"
                v-bind:transaction="transaction"
                v-bind:editMode="editMode"
                @edit="$emit('edit', $event)"
                @delete="$emit('delete', $event)"
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
        transactions: {
            type: Array,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        editMode: {
            type: Boolean,
            required: true
        },
        edit_id: {
            type: Number,
            required: true
        }
    }
}
</script>
