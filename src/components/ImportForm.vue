<template>
    <form id="import_form" v-on:submit.prevent="postData" method="POST">
        <p class="form_els">
            <label for="file_upload">Select File:</label>
            <input type="file" ref="fileUpload" @change="processFile">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank in banks" v-bind:key="bank.value" v-bind:value="bank.value">
                    {{ bank.text }}
                </option>
            </select>
        </p>
        <p class="form_els" style="text-align: center;">
            <input type="submit" value="Import" class="btn">
        </p>
    </form>
</template>
<script>
export default {
    data () {
        return {
            banks: [],
            bank_select: null,
            file: null,
        }
    },
    created: async function () {
        // Setup
        // Fetch accounts from an API
        const response_accounts = await fetch('http://127.0.0.1:8080/api/v0.1/accounts');
        const json_accounts = await response_accounts.json();
        json_accounts.payload.forEach((e) => {
            this.banks.push({text: e.name, value: e.id});
            }
        );
    },
    methods: {
        processFile: function () {
            this.file = this.$refs.fileUpload.files[0];
        },
        postData: async function() {
            let url = 'http://127.0.0.1:8080/api/v0.1/import_transactions';
            let form_data = new FormData();
            form_data.append('file_upload', this.file);
            form_data.append('bank_id', this.bank_select);
            const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                body: form_data // body data type must match "Content-Type" header
                });
            if (response.status==201) {
                let json = await response.json();
                this.$emit('transactionCreated', json.payload['new_transactions']);
                this.$emit('close');
            }
        }
    }
}
</script>