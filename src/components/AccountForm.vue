<template>
    <form id="account_form" v-on:submit.prevent="postData" method="POST">
        <p class="form_els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank_ in sharedState.banks" v-bind:key="bank_.id" v-bind:value="bank_.id">
                    {{ bank_.name }}
                </option>
            </select>
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="name">Name:</label>
            <input name="name" v-model="bank.name">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="filename_re">Filename Regex:</label>
            <input name="filename_re" v-model="bank.filename_re">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="debit_positive">Debit is positive:</label>
            <input type="checkbox" name="debit_positive" v-model="bank.debit_positive">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="date_format">Date Format:</label>
            <input name="date_format" v-model="bank.date_format">
        </p>
        <p class="form_els">
            <input :disabled="!bank_select" type="submit" value="Save" class="btn">
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
        }
    },

    watch: {
        bank_select: function() {
            this.bank = this.sharedState.banks.find((e) => { return e.id == this.bank_select });
        }
    },
    methods: {
        postData: async function() {
            store.editBank(this.bank);
        },
        deleteAccount: async function() {
            store.deleteBank(this.bank_select);
        }
    }
}
</script>