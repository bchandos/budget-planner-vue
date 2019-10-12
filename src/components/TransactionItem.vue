<template>
    <div>
        <span class="transaction_account">{{ banks[transaction.account] }}</span>
        <span class="transaction_date">{{ transaction.date }}</span> 
        <span class="transaction_desc">{{ transaction.description }}</span>
        <span class="transaction_debit">${{ transaction.debit }}</span>
        <span>
            <input class="icon" type="image" src="icons/edit-icon.svg" v-if="!editMode || transaction.id != editId" href="" @click="$emit('edit', transaction)">
            <input class="icon" type="image" src="icons/exit-edit-icon.svg" v-if="editMode && transaction.id == editId" href="" @click="$emit('edit-off')">
        </span>
        <span>
            <input class="icon" type="image" src="icons/delete-icon.svg" href="" @click="$emit('delete', transaction)">
        </span>
    </div>
</template>

<script>
export default {
    props: {
        transaction: {
            type: Object,
            required: true
        },
        editMode: {
            type: Boolean,
            required: true
        },
        editId: {
            type: Number,
            required: true
        },
        banks: {
            type: Array,
            required: true
        }
    },

}
</script>