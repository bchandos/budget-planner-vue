<template>
    <tr>
        <td class="col col-1">{{ bankName(transaction.account) }}</td>
        <td class="col col-2">{{ transaction.date | neatDate }}</td> 
        <td class="col col-3">{{ transaction.description }}</td>
        <td v-if="transaction.category" class="col col-4">{{ categoryName(transaction.category) }}</td>
        <td v-else class="col col-4">
            <select v-model="category_select" id="category_select" v-on:change="storeTransaction">
                <option 
                v-for="category in sharedState.categories" 
                v-bind:key="category.id" 
                v-bind:value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </td>
        <td class="col col-5">{{ transaction.amount | neatNumber }}</td>
        <td class="col col-6">
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
            category_select: null,
        }
    },
    props: {
        transaction: {
            type: Object,
            required: true
        },
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
        categoryName(category_id) {
            if (this.sharedState.categories.length && category_id) {
                return this.sharedState.categories.find(function(o) { return o.id == category_id }).name;
            } 
        },
        toggleEdit() {
            if (this.sharedState.transactionEdit.editMode == true) {
                store.exitTransactionEditMode();
            } else {
                store.enterTransactionEditMode(this.transaction);
            }
        },
        deleteTrans() {
            store.deleteTransaction(this.transaction.id);
        },
        storeTransaction() {
            this.transaction.category = this.category_select;
            store.editTransaction(this.transaction);
        },
    },
    computed: {
    },
    filters: {
        neatDate: function(value) {
            let d = value.split('T')[0];
            return d.slice(5,7) + '/' + d.slice(8,10) + '/' + d.slice(0,4);
        },
        neatNumber: function(value) {
            return (value).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        },
    },
}
</script>