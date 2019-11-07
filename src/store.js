export const store = {
    state: {
        banks: [],
        transactions: [],
        transactionEdit: {
            editMode: false,
            editId: -1,
            transaction: null,
        },
        toastMessage: '',
    },
    
    async loadTransactions() {
        // load all transactions from the API and update global state
        const response_trans = await fetch('http://127.0.0.1:8080/api/v0.1/transactions');
        const json_trans = await response_trans.json();
        // handle server errors here?
        if (json_trans.status == 'success') {
            this.state.transactions = json_trans.payload;
        } else {
            this.setToastMessage('Failed to retrieve transactions: ' + json_trans.payload.error_message);
            // should we clear transactions?
        }
    },
    async loadBanks() {
        // load all banks from the API and update global state
        const response_accounts = await fetch('http://127.0.0.1:8080/api/v0.1/accounts');
        const json_accounts = await response_accounts.json();
        // handle server errors here?
        if (json_accounts.status == 'success') {
            this.state.banks = json_accounts.payload;
        } else {
            this.setToastMessage('Failed to retrieve banks: ' + json_accounts.payload.error_message);
            // should we clear banks?
        }
    },
    async addTransaction(transaction) {
        // add transaction via API and push to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/transaction';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.transactions.push(json_response.payload);
        } else {
            this.setToastMessage('Failed to create transaction: ' + json_response.payload.error_message);
        }
    },
    async editTransaction(transaction) {
        // ...
        this.exitEditMode();
    },
    async importTransactions(file_obj, account_id) {
        // add multiple transactions via API and push to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/import_transactions';
        const form_data = new FormData();
        form_data.append('file_upload', file_obj);
        form_data.append('bank_id', account_id);
        const response = await fetch(url, {
            method: 'POST', 
            body: form_data 
            });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.transactions.push(json_response.payload);
            // flatten the array as the payload was an array
            this.state.transactions = this.state.transactions.flat(Infinity);
        } else {
            this.setToastMessage('Failed to import transactions: ' + json_response.payload.error_message);
        }
    },
    async deleteTransaction(transaction_id) {
        // delete transaction via API and remove from global state
        const url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + transaction_id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.transactions = this.state.transactions.filter(function(o) {return o.id != transaction_id});
        } else {
            this.setToastMessage('Failed to delete transaction: ' + json_response.payload.error_message);
        }
    },
    async addBank(bank) {
        // add bank via API and push to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/accounts/';
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bank)
        });
        const json_response = await response.json()
        if (json_response.status=='success') {
            this.state.banks.push(json_response.payload);
        } else {
            this.setToastMessage('Failed to add new bank: ' + json_response.payload.error_message);
        }
    },
    async editBank(bank) {
        // edit bank via API and edited bank to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/accounts/' + bank.id;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bank)
        });
        const json_response = await response.json()
        if (json_response.status=='success') {
            this.state.banks = this.state.banks.filter(function(o) { return o.id != bank.id });
            this.state.banks.push(json_response.payload);
        } else {
            this.setToastMessage('Failed to edit bank: ' + json_response.payload.error_message);
        }
    },
    async deleteBank(bank_id) {
        // delete bank via API and remove from global state
        const url = 'http://127.0.0.1:8080/api/v0.1/accounts/' + bank_id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.banks = this.state.banks.filter(function(o) {return o.id != bank_id});
        } else {
            this.setToastMessage('Failed to delete account: ' + json_response.payload.error_message);
        }
    },
    setToastMessage(message) {
        this.toastMessage = message;
    },
    clearToastMessage() {
        this.toastMessage = '';
    },
    enterEditMode(transaction) {
        this.state.transactionEdit.editMode = true;
        this.state.transactionEdit.editId = transaction.id;
        this.state.transactionEdit.transaction = transaction;
    },
    exitEditMode() {
        this.state.transactionEdit.editMode = false;
        this.state.transactionEdit.editId = -1;
        this.state.transactionEdit.transaction = null;
    },

};