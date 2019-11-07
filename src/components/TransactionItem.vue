<template>
    <div>
        <span class="transaction_account">{{ bankName(transaction.account) }}</span>
        <span class="transaction_date">{{ transaction.date | neatDate }}</span> 
        <span class="transaction_desc">{{ transaction.description }}</span>
        <span class="transaction_debit">${{ transaction.debit | neatNumber }}</span>
        <span>
            <input class="icon" type="image" src="icons/edit-icon.svg" v-if="!sharedState.transactionEdit.transactionEditMode || transaction.id != sharedState.transactionEdit.transactionEditId" href="" @click="toggleEdit">
            <input class="icon" type="image" src="icons/exit-edit-icon.svg" v-if="sharedState.transactionEdit.transactionEditMode && transaction.id == sharedState.transactionEdit.transactionEditId" href="" @click="toggleEdit">
        </span>
        <span>
            <input class="icon" type="image" src="icons/delete-icon.svg" href="" @click="deleteTrans">
        </span>
    </div>
</template>

<script>

import { store } from '../store.js';

export default {
    data() {
        return {
            sharedState: store.state,
        }
    },
    props: {
        transaction: {
            type: Object,
            required: true
        }
    },
    methods: {
        bankName(bank_id) {
            // let bank_id = this.transaction.account;
            if (this.sharedState.banks.length) {
                return this.sharedState.banks.find(function(o) { return o.id == bank_id }).name;
            } else {
                return 'Loading...';
            }
        },
        toggleEdit() {
            if (this.sharedState.transactionEdit.transactionEditMode == true) {
                store.exitEditMode();
            } else {
                store.enterEditMode(this.transaction);
            }
        },
        deleteTrans() {
            store.deleteTransaction(this.transaction.id);
        }
    },
    computed: {
    },
    filters: {
        neatDate: function(value) {
            let d = value.split('T')[0];
            return d.slice(5,7) + '/' + d.slice(8,10) + '/' + d.slice(0,4);
        },
        neatNumber: function(value) {
            return Number.parseFloat(value).toFixed(2);
        },
    },
}
</script>