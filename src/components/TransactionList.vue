<template>
    <div>
        <h2>Transactions</h2>
        <h3 class="filter-menu">
            <img class="image-icon" src="icons/filter-icon.svg" />
            <li class="filter-label" @click="openFilters('account')">
                Account
                <img v-if="currentFilterGroup == 'account' && showFilters" class="image-icon" src="icons/up-icon.svg" />
                <img v-else class="image-icon" src="icons/blank-icon.svg" />
            </li>
            <li class="filter-label" @click="openFilters('category')">
                Category
                <img v-if="currentFilterGroup == 'category' && showFilters" class="image-icon" src="icons/up-icon.svg" />
                <img v-else class="image-icon" src="icons/blank-icon.svg" />
            </li>
            <transition name="simple-fade">
                <li v-if="filtersSet" @click="clearFilters" class="filter-label filter-clear">
                    Clear All
                </li>
            </transition>
        </h3>
        <div v-show="showFilters" class="filter-menu" v-bind:key="currentFilterGroup">
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
                <th class="col col-1 col-sort" 
                    @click="setSort('account')"
                    v-bind:class="{ 'col-sort-active-asc': sortProperty=='account' && sortOrderAsc, 'col-sort-active-desc': sortProperty=='account' && !sortOrderAsc }"
                >Account </th>
                <th class="col col-2 col-sort" 
                    @click="setSort('date')"
                    v-bind:class="{ 'col-sort-active-asc': sortProperty=='date' && sortOrderAsc, 'col-sort-active-desc': sortProperty=='date' && !sortOrderAsc }"
                >Date </th>
                <th class="col col-3 col-sort" 
                    @click="setSort('description')"
                    v-bind:class="{ 'col-sort-active-asc': sortProperty=='description' && sortOrderAsc, 'col-sort-active-desc': sortProperty=='description' && !sortOrderAsc }"
                >Description </th>
                <th class="col col-4 col-sort" 
                    @click="setSort('category')"
                    v-bind:class="{ 'col-sort-active-asc': sortProperty=='category' && sortOrderAsc, 'col-sort-active-desc': sortProperty=='category' && !sortOrderAsc }"
                    >Category </th>
                <th class="col col-5 col-sort" 
                    @click="setSort('amount')"
                    v-bind:class="{ 'col-sort-active-asc': sortProperty=='amount' && sortOrderAsc, 'col-sort-active-desc': sortProperty=='amount' && !sortOrderAsc }"
                    >Amount </th>
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
            showFilters: false,
            filterOptions: [],
            sortProperty: 'date',
            sortOrderAsc: true,
            currentFilterGroup: '',
            activeAccountFilters: [],
            activeCategoryFilters: [],
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
            // open the filter section if not open
            // close if selecting the same filter group
            this.showFilters = !(this.currentFilterGroup == filter_type && this.showFilters);
            this.currentFilterGroup = filter_type;
            if (filter_type=='account') {
                this.filterOptions = this.sharedState.banks;
            } else if (filter_type=='category') {
                this.filterOptions = this.sharedState.categories;
            }
        },
        filterActive: function(id) {
            // is this item a current filter item?
            if (this.currentFilterGroup) {
                if (this.currentFilterGroup=='account') {
                    return this.activeAccountFilters.includes(id);
                } else if (this.currentFilterGroup=='category') {
                    return this.activeCategoryFilters.includes(id);
                }
            }
        },
        toggleActiveFilter: function(id) {
            // add or remove item from its respective filter group
            if (this.currentFilterGroup) {
                if (this.currentFilterGroup=='account') {
                    if (this.activeAccountFilters.includes(id)) {
                        const index = this.activeAccountFilters.indexOf(id);
                        this.activeAccountFilters.splice(index, 1);
                    } else {
                        this.activeAccountFilters.push(id)
                    }
                } else if (this.currentFilterGroup=='category') {
                    if (this.activeCategoryFilters.includes(id)) {
                        const index = this.activeCategoryFilters.indexOf(id);
                        this.activeCategoryFilters.splice(index, 1);
                    } else {
                        this.activeCategoryFilters.push(id)
                    }
                }
            }
        },
        clearFilters: function() {
            this.showFilters = false;
            this.filterOptions = [];
            this.currentFilterGroup = '';
            this.activeAccountFilters = [];
            this.activeCategoryFilters = [];
        },
        setSort: function(property) {
            if (this.sortProperty == property) {
                // if user clicked same property, reverse the sort order
                this.sortOrderAsc = !this.sortOrderAsc;
            } else {
                // otherwise set this as the sort property and default to Ascending
                this.sortProperty = property;
                this.sortOrderAsc = true;
            }
        }
    },
    computed: {
        sortedTransactions: function() {
            // return the transaction list with sorts and filters applied
            const transactions_copy = [...this.sharedState.transactions];
            // sorts
            transactions_copy.sort((a, b) => {
                    let x = (this.sortOrderAsc ? 1 : -1);
                    if (a[this.sortProperty] > b[this.sortProperty]) {
                        return x;
                    } else if (a[this.sortProperty] < b[this.sortProperty]) {
                        return -x;
                    }
                    return 0; 
                });
            // filters
            if (this.filtersSet) {
                if (this.activeAccountFilters.length && this.activeCategoryFilters.length) {
                    // if there are filters in both areas, apply them both
                    return transactions_copy.filter((t) => {
                        return (
                            this.activeAccountFilters.includes(t.account) &&
                            this.activeCategoryFilters.includes(t.category)
                        )
                    });
                } else {
                    // otherwise, apply only the relevant filter
                    return transactions_copy.filter((t) => {
                        return (
                            this.activeAccountFilters.includes(t.account) ||
                            this.activeCategoryFilters.includes(t.category)
                        )
                    });
                }
            } else {
                // if there are no filters, just return the sorted array
                return transactions_copy;
            }
        },
        filtersSet: function() {
            // are filters set?
            return this.currentFilterGroup && (this.activeAccountFilters.length || this.activeCategoryFilters.length);
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
    .col-sort {
        cursor: pointer;
    }
    .col-sort-active-asc::after {
        content: '\2193';
    }
    .col-sort-active-desc::after {
        content: '\2191';
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
        width: 6em;
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
        flex-wrap: wrap;
        width: 70%;
    }
    .filter-label {
        position: relative;
        margin-left: 2em;
        text-transform: capitalize;
        cursor: pointer;
    }
    .filter-item {
        /* position: relative; */
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
    /* Transitions */
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