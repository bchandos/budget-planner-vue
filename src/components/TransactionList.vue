<template>
    <div v-if="transactions.length">
        <TransactionItem 
            v-for="transaction in transactions" 
            v-bind:class="{ editing: transaction.id == id, not_editing: transaction.id != id }"
            :key="transaction.id"
            transaction="transaction"
            @edit="editTrans"
            @delete="deleteTrans" 
            />
    </div>
    <div v-else>
        <h2>No transactions to display</h2>
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
        }
    }
}
</script>
