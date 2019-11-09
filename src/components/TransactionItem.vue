<template>
    <tr>
        <td class="col col-1">{{ bankName(transaction.account) }}</td>
        <td class="col col-2">{{ transaction.date | neatDate }}</td> 
        <td class="col col-3">{{ transaction.description }}</td>
        <td class="col col-3-5">$</td>
        <td class="col col-4">{{ transaction.amount | neatNumber }}</td>
        <td class="col col-5">
            <input class="icon" type="image" src="icons/edit-icon.svg" v-if="!sharedState.transactionEdit.editMode || transaction.id != sharedState.transactionEdit.editId" href="" @click="toggleEdit">
            <input class="icon" type="image" src="icons/exit-edit-icon.svg" v-if="sharedState.transactionEdit.editMode && transaction.id == sharedState.transactionEdit.editId" href="" @click="toggleEdit">
        </td>
        <td class="col col-6">
            <input class="icon" type="image" src="icons/delete-icon.svg" href="" @click="deleteTrans">
        </td>
    </tr>
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
            if (this.sharedState.transactionEdit.editMode == true) {
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