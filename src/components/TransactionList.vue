<template>
    <v-card>
        <v-card-title>
            Transactions
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
            sort-by="date"
            :search="search"
            :headers="headers"
            :items="sharedState.transactions"
            :items-per-page="15"
        >
            <template v-slot:item.account="{item}">{{ bankName(item.account) }}</template>
            <template v-slot:item.date="{item}">{{ item.date | neatDate }}</template>
            <template v-slot:item.amount="{item}">{{ item.amount | neatNumber }}</template>
            <template v-slot:item.actions="{item}">
                <v-icon small class="mr-2" @click="sendToEdit(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteTrans(item.id)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { store } from "../store.js";

export default {
    components: {},
    data() {
        return {
            sharedState: store.state,
            search: "",
            headers: [
                {
                    text: "Account",
                    value: "account",
                    sortable: true,
                    filterable: true,
                    width: "4em"
                },
                {
                    text: "Date",
                    value: "date",
                    sortable: true,
                    filterable: true,
                    width: "3em"
                },
                {
                    text: "Description",
                    value: "description",
                    sortable: true,
                    filterable: true,
                    width: "10em"
                },
                {
                    text: "Amount",
                    value: "amount",
                    sortable: true,
                    filterable: true,
                    width: "5em"
                },
                {
                    text: "Actions",
                    value: "actions",
                    width: "3em"
                }
            ],
            showFilters: false,
            filterOptions: [],
            sortProperty: "date",
            sortOrderAsc: false,
            currentFilterGroup: "",
            activeAccountFilters: [],
            activeCategoryFilters: []
        };
    },
    methods: {
        bankName(bank_id) {
            // let bank_id = this.transaction.account;
            if (this.sharedState.banks.length) {
                return this.sharedState.banks.find(function(o) {
                    return o.id == bank_id;
                }).name;
            } else {
                return "Loading...";
            }
        },
        deleteTrans: function(t_id) {
            store.deleteTransaction(t_id);
        },
        sendToEdit: function(t) {
            store.enterEditMode(t);
        },
        openFilters: function(filter_type) {
            // open the filter section if not open
            // close if selecting the same filter group
            this.showFilters = !(
                this.currentFilterGroup == filter_type && this.showFilters
            );
            this.currentFilterGroup = filter_type;
            if (filter_type == "account") {
                this.filterOptions = this.sharedState.banks;
            } else if (filter_type == "category") {
                this.filterOptions = this.sharedState.categories;
            }
        },
        filterActive: function(id) {
            // is this item a current filter item?
            if (this.currentFilterGroup) {
                if (this.currentFilterGroup == "account") {
                    return this.activeAccountFilters.includes(id);
                } else if (this.currentFilterGroup == "category") {
                    return this.activeCategoryFilters.includes(id);
                }
            }
        },
        toggleActiveFilter: function(id) {
            // add or remove item from its respective filter group
            if (this.currentFilterGroup) {
                if (this.currentFilterGroup == "account") {
                    if (this.activeAccountFilters.includes(id)) {
                        const index = this.activeAccountFilters.indexOf(id);
                        this.activeAccountFilters.splice(index, 1);
                    } else {
                        this.activeAccountFilters.push(id);
                    }
                } else if (this.currentFilterGroup == "category") {
                    if (this.activeCategoryFilters.includes(id)) {
                        const index = this.activeCategoryFilters.indexOf(id);
                        this.activeCategoryFilters.splice(index, 1);
                    } else {
                        this.activeCategoryFilters.push(id);
                    }
                }
            }
        },
        clearFilters: function() {
            this.showFilters = false;
            this.filterOptions = [];
            this.currentFilterGroup = "";
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
                let x = this.sortOrderAsc ? 1 : -1;
                if (a[this.sortProperty] > b[this.sortProperty]) {
                    return x;
                } else if (a[this.sortProperty] < b[this.sortProperty]) {
                    return -x;
                }
                return 0;
            });
            // filters
            if (this.filtersSet) {
                if (
                    this.activeAccountFilters.length &&
                    this.activeCategoryFilters.length
                ) {
                    // if there are filters in both areas, apply them both
                    return transactions_copy.filter(t => {
                        return (
                            this.activeAccountFilters.includes(t.account) &&
                            this.activeCategoryFilters.includes(t.category)
                        );
                    });
                } else {
                    // otherwise, apply only the relevant filter
                    return transactions_copy.filter(t => {
                        return (
                            this.activeAccountFilters.includes(t.account) ||
                            this.activeCategoryFilters.includes(t.category)
                        );
                    });
                }
            } else {
                // if there are no filters, just return the sorted array
                return transactions_copy;
            }
        },
        filtersSet: function() {
            // are filters set?
            return (
                this.currentFilterGroup &&
                (this.activeAccountFilters.length ||
                    this.activeCategoryFilters.length)
            );
        }
    },
    filters: {
        neatDate: function(value) {
            let d = value.split("T")[0];
            return d.slice(5, 7) + "/" + d.slice(8, 10) + "/" + d.slice(0, 4);
        },
        neatNumber: function(value) {
            return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2
            });
        }
    }
};
</script>

<style>
</style>