<template>
    <div>
        <span class="transaction_account">{{ bank }}</span>
        <span class="transaction_date">{{ transaction.date | neatDate }}</span> 
        <span class="transaction_desc">{{ transaction.description }}</span>
        <span class="transaction_debit">${{ transaction.debit | neatNumber }}</span>
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
        bank: {
            type: String,
            required: true
        }
    },
    filters: {
        neatDate: function(value) {
            let d = value.split('T')[0];
            return d.slice(5,7) + '/' + d.slice(8,10) + '/' + d.slice(0,4);
        },
        neatNumber: function(value) {
            return Number.parseFloat(value).toFixed(2);
        }
    },
}
</script>