<template>
    <form id="transaction_form" v-bind:class="{ editing: sharedState.transactionEdit.editMode, not_editing: !sharedState.transactionEdit.editMode }" v-on:submit.prevent="sendTrans" method="POST">
        <input type="hidden" v-model="sharedState.transactionEdit.editId">
        <p class="form_els">
            <label class="transaction_form_label" for="date">Date:</label>
            <input type="date" v-model="date" id="date">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank in sharedState.banks" v-bind:key="bank.id" v-bind:value="bank.id">
                    {{ bank.name }}
                </option>
            </select>
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="description">Description:</label>
            <input v-model="description" id="description" placeholder="description">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="category_select">Category:</label>
            <select v-model="category_select" id="category_select">
                <option v-for="category in categories" v-bind:key="category.value" v-bind:value="category.value">
                    {{ category.text }}
                </option>
            </select>
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="debit">Debit:</label>
            <input v-model.number="debit" id="debit" placeholder="debit">
        </p>
        <p class="form_els">
            <input class="btn" :disabled="sharedState.transactionEdit.editMode" type="submit" value="Submit">
            <input class="btn" :disabled="!sharedState.transactionEdit.editMode" type="submit" value="Save Edits">
        </p>
    </form>
</template>

<script>

import { store } from '../store.js';

export default {

    data() {
        return {
            sharedState: store.state,
            
            description: '',
            date: '',
            debit: null,
            bank_select: null,
            category_select: null,
            categories: [{text: 'dick butts', value: 1},            
                         {text: 'butt dicks', value: 2}, 
                         {text: 'boobies', value: 3}],
        }
    },
    created: function() {
        if (this.sharedState.transactionEdit.editMode) {
            this.description = this.sharedState.transactionEdit.transaction.description;
            this.bank_select = this.sharedState.transactionEdit.transaction.account;
            this.date = this.sharedState.transactionEdit.transaction.date.slice(0, 10);
            this.debit = this.sharedState.transactionEdit.transaction.debit;
        }
    },
    methods: {
        sendTrans: function() {
            let transaction = {
                'description': this.description,
                'date': this.date,
                'debit': this.debit,
                'account': this.bank_select,
            }
            if (this.sharedState.transactionEdit.editMode) {
                transaction.id = this.sharedState.transactionEdit.editId;
                store.editTransaction(transaction);
                this.$emit('close');
            } else {
                store.addTransaction(transaction);
            }
        },
        _debugVals: function() {
            let dict = ['Williamsburg distillery', 'dreamcatcher', 'selfies', 'tumblr', 'palo santo', 'Edison bulb', 'roof party', 'copper mug'];
            this.description = dict[Math.floor(Math.random()*dict.length)] + ' ' + dict[Math.floor(Math.random()*dict.length)];
            let d = new Date(Math.random()*3000000000000);
            this.date = d.toISOString().slice(0, 10);
            this.debit = Math.floor(Math.random()*1000);
            this.bank_select = this.banks[Math.floor(Math.random()*this.banks.length)].value;
            this.category_select = 1;
        }
    }
}
</script>