import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

var vm = new Vue({

    data: {
        editMode: false,
        id: null,
        description: '',
        date: '',
        debit: null,
        bank_select: null,
        category_select: null,
        categories: [],
        banks: [],
        transactions: []
    },
    created: async function () {
        // Fetch accounts from an API
        const response_accounts = await fetch('http://127.0.0.1:8080/api/v0.1/accounts');
        const json_accounts = await response_accounts.json();
        json_accounts.payload.forEach((e) => {
            this.banks.push({text: e.name, value: e.id});
            }
        );
        
        // Fetch transactions from an API
        const response_trans = await fetch('http://127.0.0.1:8080/api/v0.1/transactions');
        const json_trans = await response_trans.json();
        this.transactions = json_trans.payload;
        this._debugVals();
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
                    json = await response.json();
                    this.transactions.push(json.payload);
                    this._debugVals();
                }
            } else if (this.editMode) {
                let url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + this.id;
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
                    json = await response.json();
                    this.transactions = this.transactions.filter(function(o) {return o.id != json.payload.id});
                    this.transactions.push(json.payload);
                    this.exitEdit();
                }
            }
        },
        deleteTrans: async function(transaction) {
            this.exitEdit()
            let url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + transaction.id;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status == 200){
                json = await response.json();
                this.transactions = this.transactions.filter(function(o) {return o != transaction});
            }
            
        },
        editTrans: async function(transaction) {
            if (transaction) {
                this.date = transaction.date.slice(0,10);
                this.description = transaction.description;
                this.bank_select = transaction.account;
                this.debit = transaction.debit;
                this.id = transaction.id;
                this.editMode = true;
            }
        },
        exitEdit: function() {
            this.editMode = false;
            this._debugVals();
        },
        _debugVals: function() {
            this.id = null;
            dict = ['Williamsburg distillery', 'dreamcatcher', 'selfies', 'tumblr', 'palo santo', 'Edison bulb', 'roof party', 'copper mug'];
            this.description = dict[Math.floor(Math.random()*dict.length)] + ' ' + dict[Math.floor(Math.random()*dict.length)];
            d = new Date(Math.random()*3000000000000);
            this.date = d.toISOString().slice(0, 10);
            this.debit = Math.floor(Math.random()*1000);
            this.bank_select = this.banks[Math.floor(Math.random()*this.banks.length)].value
            this.category_select = 1;
        },
        _defaultVals: function() {
            this.id = null;
            this.description = '';
            this.date = '';
            this.debit = null;
            this.bank_select = null;
            this.category_select = null;
        },
        bankName: function(id) {
            return this.banks.find((e) => {return e.value == id}).text;
            // return x.text;
        }
    },
    computed: {
        sortedTransactions: function() {
            return this.transactions.sort(function(a, b) {return a.date > b.date});
        }
    },
    render: h => h(App)
}).$mount('#app')
