<template>
    <form id="transaction_form" v-bind:class="{ editing: editMode, not_editing: !editMode }" v-on:submit.prevent="postData" method="POST">
        <input type="hidden" v-model="editId">
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
        </p>
    </form>
</template>

<script>
export default {
    props: {
        editTransaction: {
            type: Object,
            required: false
        },

    },
    data() {
        return {
            editMode: false,
            editId: -1,
            description: '',
            date: '',
            debit: null,
            bank_select: null,
            category_select: null,
            categories: [{text: 'dick butts', value: 1},            
                         {text: 'butt dicks', value: 2}, 
                         {text: 'boobies', value: 3}],
            // banks is an array here, because that works better for select option loops
            // does this have async issues?
            banks: [],
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
        if (this.editTransaction) {
            this.editMode = true;
            this.editId = this.editTransaction.id;
            this.description = this.editTransaction.description;
            this.date = this.editTransaction.date.slice(0, 10);
            this.debit = this.editTransaction.debit;
            this.bank_select = this.editTransaction.account;
        } else {
            this.exitEdit();
        }
        
    },
    watch: {
        editTransaction: function() {
            if (this.editTransaction) {
                this.editMode = true;
                this.editId = this.editTransaction.id;
                this.description = this.editTransaction.description;
                this.date = this.editTransaction.date;
                this.debit = this.editTransaction.debit;
                this.bank_select = this.editTransaction.account;
            } else {
                this.exitEdit();
            }
        }
    },
    methods: {
        postData: async function() {
            if (!this.editMode) {
                let url = 'http://127.0.0.1:8080/api/v0.1/transaction';
                let form_data = {description: this.description,
                                account: this.bank_select,
                                debit: this.debit,
                                date: this.date};
                const response = await fetch(url, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form_data) // body data type must match "Content-Type" header
                });
                if (response.status == 201) {
                    let json = await response.json();
                    // emit the new transaction
                    this.$emit('transactionCreated', json.payload);
                    this._debugVals();
                }
            } else if (this.editMode) {
                let url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + this.editId;
                let form_data = {description: this.description,
                                account: this.bank_select,
                                debit: this.debit,
                                date: this.date};
                const response = await fetch(url, {
                    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form_data) // body data type must match "Content-Type" header
                });
                if (response.status == 201) {
                    let json = await response.json();
                    // emit the deleted transaction
                    this.$emit('transactionEdited', json.payload);
                    this.$emit('close');
                    this.exitEdit();
                }
            }
        },
        exitEdit: function() {
            this.$emit('exitEdit');
            this.editMode = false;
            this.editId = -1;
            this._debugVals();
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