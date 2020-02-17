<template>
    <form id="transaction_form" v-bind:class="{ editing: sharedState.transactionEdit.editMode, not_editing: !sharedState.transactionEdit.editMode }" v-on:submit.prevent="sendTrans" method="POST">
        <input type="hidden" v-model="sharedState.transactionEdit.editId">
        <p class="form-els">
            <label class="transaction_form_label" for="date">Date:</label>
            <input type="date" v-model="date" id="date">
        </p>
        <p class="form-els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank in sharedState.banks" v-bind:key="bank.id" v-bind:value="bank.id">
                    {{ bank.name }}
                </option>
            </select>
        </p>
        <p class="form-els">
            <label class="transaction_form_label" for="description">Description:</label>
            <input v-model="description" id="description" placeholder="description">
        </p>
        <p class="form-els">
            <label class="transaction_form_label" for="category_select">Category:</label>
            <select v-model="category_select" id="category_select">
                <option value=""> </option>
                <option v-for="category in sharedState.categories" v-bind:key="category.id" v-bind:value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <button class="btn small-btn" v-on:click.prevent="addNewCategory">
                {{ new_category_mode ? 'Cancel' : '+ New Category' }}
            </button>
        </p>
        <transition name="slide-fade">
            <p class="form-els hidden-form-el" v-show="new_category_mode">
                <label class="transaction_form_label" for="add_category">New Category:</label>
                <input v-model="new_category" id="add_category">
                <button class="btn small-btn" v-on:click.prevent="submitNewCategory" :disabled="!new_category">Submit</button>
            </p>
        </transition>
        <p class="form-els">
            <label class="transaction_form_label" for="amount">Amount:</label>
            <input v-model.number="amount" id="amount" placeholder="amount">
        </p>
        <p class="form-els" v-if="sharedState.transactionEdit.relatedTransactions.length">
            <label class="transaction_form_label" for="related-transactions">Related Transactions:</label>
            <select v-model="relatedSelect" id="related-transactions">
                <option v-for="t in sharedState.transactionEdit.relatedTransactions" v-bind:key="t.id" v-bind:value="t.id">
                    {{ t.date }} - {{ t.description }}, {{ t.amount }}
                </option>
            </select>
        </p>
        <p class="form-els">
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
            amount: null,
            bank_select: null,
            category_select: null,
            new_category_mode: false,
            new_category: '',
            relatedSelect: null,
        }
    },
    created: function() {
        if (this.sharedState.transactionEdit.editMode) {
            this.description = this.sharedState.transactionEdit.transaction.description;
            this.bank_select = this.sharedState.transactionEdit.transaction.account;
            this.date = this.sharedState.transactionEdit.transaction.date.slice(0, 10);
            this.amount = this.sharedState.transactionEdit.transaction.amount;
            this.category_select = this.sharedState.transactionEdit.transaction.category;
            this.relatedSelect = this.sharedState.transactionEdit.transaction.reconcile_to;
        }
    },
    methods: {
        sendTrans: function() {
            let transaction = {
                'description': this.description,
                'date': this.date,
                'amount': this.amount,
                'account': this.bank_select,
                'category': this.category_select,
                'reconcile_to': this.relatedSelect,                
            }
            if (this.sharedState.transactionEdit.editMode) {
                transaction.id = this.sharedState.transactionEdit.editId;
                store.editTransaction(transaction);
                this.$emit('close');
            } else {
                store.addTransaction(transaction);
            }
        },
        addNewCategory: function() {
            this.new_category_mode = !this.new_category_mode;
        },
        submitNewCategory: function() {
            if (this.new_category) {
                let category = {
                    'name': this.new_category
                }
                store.addCategory(category);
                this.new_category = '';
                this.new_category_mode = false;
            }
        },
        _debugVals: function() {
            let dict = ['Williamsburg distillery', 'dreamcatcher', 'selfies', 'tumblr', 'palo santo', 'Edison bulb', 'roof party', 'copper mug'];
            this.description = dict[Math.floor(Math.random()*dict.length)] + ' ' + dict[Math.floor(Math.random()*dict.length)];
            let d = new Date(Math.random()*3000000000000);
            this.date = d.toISOString().slice(0, 10);
            this.amount = Math.floor(Math.random()*-1000);
            this.bank_select = this.banks[Math.floor(Math.random()*this.banks.length)].value;
            this.category_select = 1;
        }
    }
}
</script>

<style>
    .slide-fade-enter-active, .slide-fade-leave-active {
        transition: opacity 500ms ease, transform 500ms ease;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        opacity: 0;
        transform: scaleY(0);
    }
    .slide-fade-enter-to, .slide-fade-leave {
        opacity: 1;
        transform: scaleY(1);
    }
</style>