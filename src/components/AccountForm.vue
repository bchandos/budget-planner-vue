<template>
    <form id="account_form" v-on:submit.prevent="postData" method="POST">
        <p class="form_els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank in banks" v-bind:key="bank.id" v-bind:value="bank.id">
                    {{ bank.name }}
                </option>
            </select>
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="filename_re">Filename Regex:</label>
            <input name="filename_re" v-model="bank_settings.filename_re">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="date_format">Date Format:</label>
            <input name="date_format" v-model="bank_settings.date_format">
        </p>
    </form>
</template>
<script>
export default {
    data () {
        return {
            banks: [],
            bank_select: null,
            bank_settings: {}
        }
    },
    created: async function () {
        // Setup
        // Fetch accounts from an API
        const response_accounts = await fetch('http://127.0.0.1:8080/api/v0.1/accounts');
        const json_accounts = await response_accounts.json();
        json_accounts.payload.forEach((e) => {
            this.banks.push(e);
            }
        );
    },
    watch: {
        bank_select: function() {
            this.bank_settings = this.banks.find((e) => { return e.id == this.bank_select }).settings;
        }
    },
    methods: {
        postData: async function() {
            let url = 'http://127.0.0.1:8080/api/v0.1/accounts';
            let form_data = new FormData();
            const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                
                body: form_data // body data type must match "Content-Type" header
                });
        }
    }
}
</script>