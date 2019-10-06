<template>
    <div id="app">
        <form id="transaction_form" v-bind:class="{ editing: editMode }" v-on:submit.prevent="postData" method="POST">
            <input type="hidden" v-model="id">
            <p class="form_els">
                <label class="transaction_form_label" for="date">Date:</label>
                <input type="date" v-model="date" id="date">
            </p>
            <p class="form_els">
                <label class="transaction_form_label" for="bank_select">Bank:</label>
                <select v-model="bank_select" id="bank_select">
                    <option v-for="bank in banks" v-bind:key="bank.value" v-bind:value="bank.value">
                        {{ bank.text }}
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
                <input class="btn" :disabled="editMode" type="submit" value="Submit">
                <input class="btn" :disabled="!editMode" type="submit" value="Save Edits">
                <a v-if="editMode" href="" @click.prevent="exitEdit">
                    <img class="icon" src="static/icons/exit-edit-icon.svg" alt="exit edit transaction mode" />
                </a>
            </p>
        </form>
        <h2>Existing Transactions</h2>
        <div>
            <span class="transaction_account"><strong>Account</strong></span>
            <span class="transaction_date"><strong>Date</strong></span>
            <span class="transaction_desc"><strong>Description</strong></span>
            <span class="transaction_debit"><strong>Debit</strong></span>
            <span><strong>Edit</strong></span>
            <span><strong>Delete</strong></span>
        </div>
        <TransactionList transactions="sortedTransactions" id="id" />
    </div>
</template>

<script>
import TransactionList from './components/TransactionList.vue'

export default {
    name: 'app',
    components: {
        TransactionList
    },
}
</script>

<style>
    .transaction_form_label {
        display:inline-block;
        min-width: 7em;
        margin-left: 1em;
    }
    .form_els {
        margin: 0.5em 0;
    }
    .transaction_account {
        display: inline-block;
        min-width: 11em;
    }
    .transaction_date {
        display: inline-block;
        min-width: 11em;
    }

    .transaction_desc {
        display: inline-block;
        min-width: 20em;
    }
    .transaction_debit {
        display: inline-block;
        min-width: 4em;
    }
    .not_editing:nth-child(even) {
        background-color: rgba(211, 211, 211, 0.5);
    }
    .editing {
        background-color: rgba(255, 94, 94, 0.5);
        transition-property: all;
        transition-duration: 500ms;
    }
    .not_editing {
        background-color: inherit;
        transition-duration: 400ms;
    }
    .icon {
        width: 1em;
        padding: 0 0.5em;
    }
    .btn {
        background-color: lightgray;
        border: 1px solid lightgray;
        color: black;
        font-size: 1.2em;
        padding: 0.5em 1em;
        margin: 0.5em 1em;
        border-radius: 4px;
        transition-duration: 200ms;
    }
    .btn:disabled {
        color: gray;
        opacity: 0.8;
    }
    .btn:hover:not([disabled]) {
        border: 1px solid gray;
        transition-duration: 400ms;
    }

    #transaction_form {
        max-width: 50%;
        border: 1px solid black;
        padding: 1em;
        background-color: rgba(250, 250, 210, 0.5);
        border-radius: 3px;
    }

    #transaction_form.editing {
        border: 1px solid green;
        background-color: rgba(255, 94, 94, 0.5);
    }
</style>
