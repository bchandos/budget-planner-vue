<template>
    <form id="account_form" v-on:submit.prevent="postData" method="POST">
        <p class="form_els">
            
        </p>
        <p class="form_els">
            
        </p>
        <p class="form_els">
            
        </p>
    </form>
</template>
<script>
export default {
    data () {
        return {
            banks: [],
            bank_select: null
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