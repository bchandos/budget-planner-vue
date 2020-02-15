<template>
    <div>
        <h2>Transactions</h2>
        <h3 class="filter-menu">
            <img class="icon" src="icons/filter-icon.svg" />
            <li class="filter-label" @click="openFilters('account')">Account</li>
            <li class="filter-label" @click="openFilters('category')">Category</li>
            <transition name="simple-fade">
                <li v-if="filtersSet" @click="clearFilters" class="filter-label filter-clear">Clear All</li>
            </transition>
        </h3>
        <div v-if="filtered" class="filter-menu">
            <li 
                v-for="option in filterOptions" 
                v-bind:key="option.id" 
                v-bind:class="{ 'filter-clicked': filterActive(option.id) }"
                @click="toggleActiveFilter(option.id)"
                class="filter-item">
                    {{ option.name }}
            </li>
        </div>
        <table>
            <tr class="row-header">
                <th class="col col-1">Account</th>
                <th class="col col-2">Date</th>
                <th class="col col-3">Description</th>
                <th class="col col-4">Category</th>
                <th class="col col-4-5"> </th>
                <th class="col col-5">Amount</th>
                <th class="col col-6">Edit</th>
                <th class="col col-7">Delete</th>
            </tr>
            <template v-if="sharedState.transactions.length">
                <TransactionItem 
                    v-for="transaction in sortedTransactions" 
                    v-bind:class="{ editing: transaction.id == sharedState.transactionEdit.editId, not_editing: transaction.id != sharedState.transactionEdit.editId }"
                    v-bind:key="transaction.id"
                    v-bind:transaction="transaction"
                    />
            </template>
            <template v-else>
                <tr>
                    <td colspan="6">
                        <h2>No transactions to display</h2>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
import TransactionItem from './TransactionItem.vue'
import { store } from '../store.js';

export default {
    components: {
        TransactionItem
    },
    data() {
        return {
            sharedState: store.state,
            filtered: false,
            filterOptions: [],
            currentFilterGroup: '',
            activeFilters: {
                'account': [],
                'category': [],
            },
        }
    },
    methods: {
        deleteTrans: function(t) {
            store.deleteTransaction(t);
        },
        sendToEdit: function(t) {
            store.enterEditMode(t);
        },
        openFilters: function(filter_type) {
            this.filtered = true;
            this.currentFilterGroup = filter_type;
            if (filter_type=='account') {
                this.filterOptions = this.sharedState.banks;
            } else if (filter_type=='category') {
                this.filterOptions = this.sharedState.categories;
            }
        },
        filterActive: function(id) {
            if (this.filtered && this.currentFilterGroup) {
                return this.activeFilters[this.currentFilterGroup].includes(id);
            }
        },
        toggleActiveFilter: function(id) {
            if (this.filtered && this.currentFilterGroup) {
                if (this.activeFilters[this.currentFilterGroup].includes(id)) {
                    const index = this.activeFilters[this.currentFilterGroup].indexOf(id);
                    this.activeFilters[this.currentFilterGroup].splice(index, 1);
                } else {
                    this.activeFilters[this.currentFilterGroup].push(id)
                }
            }
        },
        clearFilters: function() {
            this.filtered = false;
            this.filterOptions = [];
            this.currentFilterGroup = '';
            this.activeFilters = {'account': [], 'category': []};
        }
    },
    computed: {
        sortedTransactions: function() {
            const transactions_copy = [...this.sharedState.transactions];
            return transactions_copy.sort(function(a, b) {return a.date > b.date});
        },
        filtersSet: function() {
            return this.filtered && (this.activeFilters['account'].length || this.activeFilters['category'].length);
        }
    },
}
</script>

<style>
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
        transition-delay: 250ms;
        transition-duration: 400ms;
    }
    table {
        border-collapse: collapse;
        overflow: hidden;
        border-radius: 10px 10px 0 0;
    }
    .row-header {
        color: white;
        background-color: rgb(71, 49, 49);
        height: 3em;
    }
    .col {
        padding: 0.5em;
    }
    .col-1 {
        padding-left: 1em;
        width: 7em;
    }
    .col-2 {
        width: 5em;
    }
    .col-3 {
        width: 12em;
    }
    .col-4 {
        width: 10em;
    }
    .col-4-5 {
        padding: 0;
    }
    .col-5 {
        width: 4em;
    }
    td.col-5 {
        text-align: right;
    }
    .col-6 {
        width: 3em;
        text-align: center;
    }
    .col-7 {
        width: 3em;
        text-align: center;
        padding-right: 1em;
    }
    .filter-menu {
        display: flex;
        list-style: none;
    }
    .filter-label {
        position: relative;
        margin-left: 2em;
        text-transform: capitalize;
        cursor: pointer;
    }
    .filter-item {
        position: relative;
        margin-left: 1em;
        margin-bottom: 1em;
        padding: 0.25em;
        cursor: pointer;
        border-width: 1px;
        border-color:rgba(133, 128, 128, 0.5);
        border-style: dotted;
        border-radius: 3px;
    }
    .filter-clicked {
        background-color:rgba(211, 211, 211, 0.5);
    }
    .filter-clear {
        color: brown;
    }
    .simple-fade-enter-active, .simple-fade-leave-active {
        transition: opacity 300ms;
    }
    .simple-fade-enter, .simple-fade-leave-to {
        opacity: 0;
    }

@media screen and (max-width:992px) {
    table {
        display:block
    }
    table>*,
    table tr,
    table td,
    table th {
        display:block
    }
    table thead {
        display:none
    }
}
</style>