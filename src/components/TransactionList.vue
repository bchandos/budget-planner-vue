<template>
    <v-card class="mx-auto col-10">
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
            :loading="sharedState.loading"
        >
            <template v-slot:[`item.account`]="{item}">
                {{ item.account_id.name }}
                <v-icon small class="mr-2" @click="sendAccountToEdit(item.account_id)">mdi-pencil</v-icon>
            </template>
            <template v-slot:[`item.date`]="{item}">{{ item.date | neatDate }}</template>
            <template v-slot:[`item.amount`]="{item}">{{ item.amount | neatNumber }}</template>
            <template v-slot:[`item.actions`]="{item}">
                <v-icon small class="mr-2" @click="sendToEdit(item)">mdi-pencil</v-icon>
                <v-icon small class="ml-2" @click="deleteTrans(item.id)">mdi-delete</v-icon>
            </template>
            <template v-slot:[`item.category_id.name`]="{item}">
                <v-select 
                    :disabled="item.category_id.name ? true : false"
                    :append-icon="item.category_id.name ? '' : '$dropdown'"
                    v-model="item.category_id.id"
                    :items="sharedState.categories"
                    item-text="name"
                    item-value="id"
                    @change="updateCategory(item)"
                    >
                </v-select>
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
                },
                {
                    text: "Date",
                    value: "date",
                    sortable: true,
                    filterable: true,
                },
                {
                    text: "Description",
                    value: "description",
                    sortable: true,
                    filterable: true,
                },
                {
                    text: 'Category',
                    value: 'category_id.name',
                    sortable: true,
                    filterable: true,
                },
                {
                    text: "Amount",
                    value: "amount",
                    sortable: true,
                    filterable: true,
                },
                {
                    text: "Actions",
                    value: "actions",
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
        deleteTrans: function(t_id) {
            store.deleteTransaction(t_id);
        },
        sendToEdit: function(t) {
            store.enterTransactionEditMode(t);
        },
        sendAccountToEdit: function(a) {
            store.enterAccountEditMode(a);
        },
        updateCategory: function(item) {
            let transaction = {
                id: item.id,
                account_id: item.account_id.id,
                date: item.date,
                description: item.description,
                amount: item.amount,
                category_id: item.category_id.id
            }
            store.editTransaction(transaction);
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
.v-select__selection--disabled {
    color: #555 !important;
}
</style>