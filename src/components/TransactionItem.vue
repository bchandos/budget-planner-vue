<template>
    <div>
        <span class="transaction_date">{{ transaction.date }}</span> 
        <span class="transaction_desc">{{ transaction.description }}</span>
        <span class="transaction_debit">${{ transaction.debit }}</span>
        <span>
            <input class="icon" type="image" src="icons/edit-icon.svg" v-if="!editMode || transaction.id != edit_id" href="" @click="$emit('edit', transaction)">
            <input class="icon" type="image" src="icons/exit-edit-icon.svg" v-if="editMode && transaction.id == edit_id" href="" @click="$emit('edit', transaction)">
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
        edit_id: {
            type: Number,
            required: true
        }
    }
}
</script>