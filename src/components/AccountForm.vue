<template>
    <form id="account-form" v-on:submit.prevent="postData" method="POST" v-bind:class="{ editing: newAccountMode }">
        <input class="btn" type="button" name="add-account" @click="newAccount" v-bind:value="accountButtonText">
        <p class="form_els">
            <label class="form-label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select" :disabled="newAccountMode">
                <option v-for="bank_ in sharedState.banks" v-bind:key="bank_.id" v-bind:value="bank_.id">
                    {{ bank_.name }}
                </option>
            </select>
        </p>
        <p class="form_els">
            <label class="form-label" for="name">Name:</label>
            <input name="name" v-model="bank.name">
        </p>
        <p class="form_els">
            <label class="form-label" for="filename_re">Filename Regex:</label>
            <input name="filename_re" v-model="bank.filename_re">
        </p>
        <p class="form_els">
            <label class="form-label" for="debit_positive">Debit is positive:</label>
            <input type="checkbox" name="debit_positive" v-model="bank.debit_positive">
        </p>
        <p class="form_els">
            <label class="form-label" for="date_format">Date Format:</label>
            <input name="date_format" v-model="bank.date_format">
        </p>
        <p class="form_els">
            <input :disabled="!bank_select && !newAccountMode" type="submit" value="Save" class="btn">
            <input :disabled="!bank_select" type="button" value="Delete" class="btn" @click="deleteAccount">
        </p>
    </form>
</template>
<script>

import { store } from '../store.js';

export default {
    data () {
        return {
            sharedState: store.state,
            bank: {},
            bank_select: null,
            bank_selectRestore: null,
            newAccountMode: false,
            accountButtonText: 'Add New Account',
        }
    },

    watch: {
        bank_select: function() {
            if (this.bank_select) {
                this.bank = this.sharedState.banks.find((e) => { return e.id == this.bank_select });
            } else {
                this.bank = {};
            }
            
        }
    },
    methods: {
        postData: async function() {
            if (this.newAccountMode) {
                // get list of bank ids before transaction
                const old_ids = this.sharedState.banks.map(e => e.id);
                // wait for the transaction to complete
                await store.addBank(this.bank);
                // get the new list of ids
                const new_ids = this.sharedState.banks.map(e => e.id);
                // find the (hopefully) one that's different, assume it's the new bank
                const diff_id = new_ids.filter(e => !old_ids.includes(e));
                // just to be sure
                if (diff_id.length == 1) {
                    this.bank_selectRestore = diff_id[0];
                }
                // flip out of edit mode
                this.newAccount();
            } else {
                store.editBank(this.bank);
            }
        },
        deleteAccount: function() {
            store.deleteBank(this.bank_select);
            this.bank_select = null;
        },
        newAccount: function() {
            this.newAccountMode = !this.newAccountMode;
            if (this.newAccountMode) {
                // Store the original bank select so we can return to this account if cancel
                this.bank_selectRestore = this.bank_select;
                this.bank_select = null;
                this.accountButtonText = 'Cancel';
            } else {
                this.bank_select = this.bank_selectRestore;
                this.accountButtonText = 'Add New Account';
            }
        }
    }
}
</script>

<style>
    #account-form {
        padding: 1em;
        margin: 1em;
    }
    .form-label {
        padding-right: 1em;
        display: inline-block;
        width: 7em;
        text-align: right;
    }
</style>