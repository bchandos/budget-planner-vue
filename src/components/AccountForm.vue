<template>
    <form id="account_form" v-on:submit.prevent="postData" method="POST">
        <p class="form_els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank_ in banks" v-bind:key="bank_.id" v-bind:value="bank_.id">
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
export default {
    data () {
        return {
            banks: [],
            bank: {},
            bank_select: null,
            
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
            this.bank = this.banks.find((e) => { return e.id == this.bank_select });
        }
    },
    methods: {
        postData: async function() {
            let url = 'http://127.0.0.1:8080/api/v0.1/accounts/' + this.bank_select;
            let form_data = {
                'name': this.bank.name,
                'filename_re': this.bank.filename_re,
                'debit_positive': this.bank.debit_positive,
                'date_format': this.bank.date_format,
            }
            const response = await fetch(url, {
                method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form_data) // body data type must match "Content-Type" header
                });
            if (response.status==201) {
                // refresh our account
                const json_account = await response.json();
                this.bank = json_account.payload;
            }
        },
        deleteAccount: async function() {
            if (this.bank_select) {
                let url = 'http://127.0.0.1:8080/api/v0.1/accounts/' + this.bank_select;
                const response = await fetch(url, {
                    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                    });
                if (response.status == 200) {
                    let json = await response.json();
                    this.banks = this.banks.filter((e) => { return e.id != json.payload.id});
                    this.bank = {};
                    this.$emit('deleted');
                }
            }
        }
    }
}
</script>