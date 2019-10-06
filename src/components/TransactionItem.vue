<template>
    <div>
        <span class="transaction_date">{{ transaction.date }}</span> 
        <span class="transaction_desc">{{ transaction.description }}</span>
        <span class="transaction_debit">${{ transaction.debit }}</span>
        <span>
            <input class="icon" type="image" src="icons/edit-icon.svg" v-if="!editMode || transaction.id != id" href="" @click="$emit('edit', transaction.id)">
            <input class="icon" type="image" src="icons/exit-edit-icon.svg" v-if="editMode && transaction.id == id" href="" @click="$emit('edit', transaction.id)">
        </span>
        <span>
            <input class="icon" type="image" src="icons/delete-icon.svg" href="" @click="$emit('delete', transaction.id)">
        </span>
    </div>
</template>

<script>
export default {
    props: {
        transaction: {
            type: Object,
            required: true
        }
    }
}
</script>