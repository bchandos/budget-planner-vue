export var store = {
    state: {
        banks: [],
        transactions: [],
        transactionEditMode: false,
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
            this.state.toastMessage = 'Failed to retrieve transactions: ' + json_trans.payload.error_message;
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
            this.state.toastMessage = 'Failed to retrieve banks: ' + json_accounts.payload.error_message;
            // should we clear banks?
        }
    },
    async addTransaction(transaction) {
        // add transaction via API and push to global state
    },
    async addTransactions(transactions) {
        // add multiple transactions via API and push to global state
    },
    async deleteTransaction(transaction_id) {
        // delete transaction via API and remove from global state
    },
    async addBank(bank) {
        // add bank via API and push to global state
    },
    async deleteBank(bank_id) {
        // delete bank via API and remove from global state
    },
    setToastMessage(message) {
        this.toastMessage = message;
    },
    clearToastMessage() {
        this.toastMessage = '';
    },
    enterEditMode() {
        this.state.transactionEditMode = true;
    },
    exitEditMode() {
        this.state.transactionEditMode = false;
    }

};