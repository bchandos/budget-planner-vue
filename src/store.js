export const store = {
    state: {
        banks: [],
        transactions: [],
        transactionEdit: {
            editMode: false,
            editId: -1,
            transaction: null,
            relatedTransactions: null,
        },
        accountEdit: {
            editMode: false,
            editId: -1,
            account: {},
        },
        categories: [],
        toastMessage: '',
        APIKey: '',
        drawerOpen: false,
        importDialog: false,
        newTransactionDialog: false,
        balanceDialog: false,
    },
    async getApiKey() {
        const response = await fetch('http://127.0.0.1:8080/api/v0.1/authentication', {
            // credentials: 'include',
            // need to figure out how to set cookies here, this should allow them
            // but it causes a big hangup and also doesn't actually set the cookies.
            // then how do we send the cookie with all subsequent requests...
            method: 'GET',
            headers: {
                'Authorization': 'Basic dGVzdHVzZXI6dGVzdHBhc3N3b3Jk'
            },
        });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.APIKey = json_response.payload;
        } else {
            this.setToastMessage('Failed to retrieve API Key.');
        }
    },
    async loadTransactions() {
        // load all transactions from the API and update global state
        const url = 'http://127.0.0.1:8080/api/v0.1/transactions';
        const response_trans = await fetch(url);
        const json_trans = await response_trans.json();
        // handle server errors here?
        if (json_trans.status == 'success') {
            this.state.transactions = json_trans.payload;
        } else {
            this.setToastMessage('Failed to retrieve transactions: ' + json_trans.payload.error_message);
            // should we clear transactions?
        }
    },
    async loadAccountTransactions(account_id) {
        // load all of an account's transactions from the API and update global state
        const url = `http://127.0.0.1:8080/api/v0.1/transactions/account/${parseInt(account_id)}`;
        const response_trans = await fetch(url);
        const json_trans = await response_trans.json();
        // handle server errors here?
        if (json_trans.status == 'success') {
            this.state.transactions = json_trans.payload;
        } else {
            this.setToastMessage('Failed to retrieve account transactions: ' + json_trans.payload.error_message);
            // should we clear transactions?
        }
    },
    async loadCategoryTransactions(category_id) {
        // load all of a category's transactions from the API and update global state
        const url = `http://127.0.0.1:8080/api/v0.1/transactions/category/${parseInt(category_id)}`;
        const response_trans = await fetch(url);
        const json_trans = await response_trans.json();
        // handle server errors here?
        if (json_trans.status == 'success') {
            this.state.transactions = json_trans.payload;
        } else {
            this.setToastMessage('Failed to retrieve category transactions: ' + json_trans.payload.error_message);
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
    async loadCategories() {
        // load all categories from the API and update global state
        const response_accounts = await fetch('http://127.0.0.1:8080/api/v0.1/categories');
        const json_categories = await response_accounts.json();
        // handle server errors here?
        if (json_categories.status == 'success') {
            this.state.categories = json_categories.payload;
        } else {
            this.setToastMessage('Failed to retrieve categories: ' + json_categories.payload.error_message);
            // should we clear banks?
        }
    },
    async addTransaction(transaction) {
        // add transaction via API and push to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/transaction';
        const response = await fetch(url, {
            // credentials: 'include',
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
        // send edited transaction to API and then update global state
        const url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + transaction.id;
        const response = await fetch(url, {
            // credentials: 'include',
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(transaction)
        });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.transactions = this.state.transactions.filter(function(o) { return o.id != transaction.id });
            this.state.transactions.push(json_response.payload);
        } else {
            this.setToastMessage('Failed to edit transaction: ' + json_response.payload.error_message);
        }
        this.exitTransactionEditMode();
    },
    async importTransactions(file_obj, account_id) {
        // add multiple transactions via API and push to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/import_transactions';
        const form_data = new FormData();
        form_data.append('file_upload', file_obj);
        form_data.append('bank_id', account_id);
        const response = await fetch(url, {
            // credentials: 'include',
            method: 'POST', 
            body: form_data 
            });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.transactions.push(json_response.payload.new_transactions);
            // flatten the array as the payload was an array
            this.state.transactions = this.state.transactions.flat(Infinity);
            this.loadCategories(); // Transaction import can create new categories
            this.setToastMessage(`${json_response.payload.total} transactions processed: ${json_response.payload.added} transactions added; ${json_response.payload.skipped} transactions skipped.`);
        } else {
            this.setToastMessage('Failed to import transactions: ' + json_response.payload.error_message);
        }
    },
    async deleteTransaction(transaction_id) {
        // delete transaction via API and remove from global state
        const url = 'http://127.0.0.1:8080/api/v0.1/transaction/' + transaction_id;
        const response = await fetch(url, {
            // credentials: 'include',
            method: 'DELETE'
        });
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.transactions = this.state.transactions.filter(function(o) {return o.id != transaction_id});
        } else {
            this.setToastMessage('Failed to delete transaction: ' + json_response.payload.error_message);
        }
    },
    async relatedTransactions(transaction_id) {
        // get possibly related transactions from API and add to global state
        const url = `http://127.0.0.1:8080/api/v0.1/transaction/${transaction_id}/related`;
        const response = await fetch(url);
        const json_response = await response.json();
        if (json_response.status == 'success') {
            this.state.transactionEdit.relatedTransactions = json_response.payload;
        } else {
            this.setToastMessage('Failed to retrieve related transactions: ' + json_response.payload.error_message);
        }
    },
    async addBank(bank) {
        // add bank via API and push to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/accounts';
        const response = await fetch(url, {
            // credentials: 'include',
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
            // credentials: 'include',
            method: 'PUT',
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
            // credentials: 'include',
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
    async addCategory(category) {
        // add category via API and push to global state
        const url = 'http://127.0.0.1:8080/api/v0.1/categories';
        const response = await fetch(url, {
            // credentials: 'include',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(category)
        });
        const json_response = await response.json()
        if (json_response.status=='success') {
            this.state.categories.push(json_response.payload);
            this.setToastMessage('Added category "' + category.name +'".');
        } else {
            this.setToastMessage('Failed to add new category: ' + json_response.payload.error_message);
        }
    },
    setToastMessage(message, timeout=5000) {
        this.state.toastMessage = message;
        setTimeout(()=>{ this.clearToastMessage(); }, timeout);
    },
    clearToastMessage() {
        this.state.toastMessage = '';
    },
    enterTransactionEditMode(transaction) {
        this.state.transactionEdit.editMode = true;
        this.state.transactionEdit.editId = transaction.id;
        this.state.transactionEdit.transaction = {...transaction};
        this.relatedTransactions(transaction.id);
    },
    exitTransactionEditMode() {
        this.state.transactionEdit.editMode = false;
        this.state.transactionEdit.editId = -1;
        this.state.transactionEdit.transaction = null;
        this.state.transactionEdit.relatedTransactions = null;
    },
    enterAccountEditMode(account) {
        this.state.accountEdit.editMode = true;
        this.state.accountEdit.editId = account.id;
        this.state.accountEdit.account = {...account};
    },
    exitAccountEditMode() {
        this.state.accountEdit.editMode = false;
        this.state.accountEdit.editId = -1;
        this.state.accountEdit.account = {};
    }

};