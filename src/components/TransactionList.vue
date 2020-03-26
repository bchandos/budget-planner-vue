<template>
    <v-card width="70%" class="mx-auto">
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
            <template v-slot:item.account="{item}">{{ item.account_id.name }}</template>
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
                    value: "account_id.name",
                    sortable: true,
                    filterable: true,
                    width: "15%"
                },
                {
                    text: "Date",
                    value: "date",
                    sortable: true,
                    filterable: true,
                    width: "15%"
                },
                {
                    text: "Description",
                    value: "description",
                    sortable: true,
                    filterable: true,
                    width: "40%"
                },
                {
                    text: "Amount",
                    value: "amount",
                    sortable: true,
                    filterable: true,
                    width: "15%"
                },
                {
                    text: "Actions",
                    value: "actions",
                    width: "15%",
                    sortable: false,
                    filterable: false
                },

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
        
    },
    computed: {
        
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