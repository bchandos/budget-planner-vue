<template>
    <v-dialog v-model="sharedState.transactionEdit.editMode" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Edit Transaction</span>
            </v-card-title>

            <v-card-text>
                <v-container v-if="sharedState.transactionEdit.transaction">
                    <v-row>
                        <v-col >
                            <v-select 
                                v-model="sharedState.transactionEdit.transaction.account_id.id"
                                :items="sharedState.banks" 
                                label="Account"
                                item-text="name"
                                item-value="id"
                                prepend-icon="mdi-bank">
                            </v-select> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-menu
                                v-model="dateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px">
                                <template v-slot:activator="{ on }">
                                <v-text-field
                                    v-model="sharedState.transactionEdit.transaction.date"
                                    label="Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker v-model="neatDate" @input="dateMenu = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="sharedState.transactionEdit.transaction.description" label="Description"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col >
                            <v-select 
                                v-model="sharedState.transactionEdit.transaction.category_id.id"
                                :items="sharedState.categories" 
                                label="Category"
                                item-text="name"
                                item-value="id"
                                prepend-icon="mdi-tag"
                                >
                            </v-select> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field 
                            v-model="neatNumber" 
                            label="Amount"
                            prepend-icon="mdi-cash-usd"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { store } from "../store.js";

export default {
    data() {
        return {
            sharedState: store.state,
            dateMenu: false,
        };
    },
    
    methods: {
        save: function() {
            store.editTransaction(this.sharedState.transactionEdit.transaction);
        },
        close: function() {
            this.dateMenu = false;
            store.exitEditMode();
        }
    
    },
    computed: {
        neatDate: function() {
            return this.sharedState.transactionEdit.transaction.date.split('T')[0];
        },
        neatNumber: function() {
            let value = this.sharedState.transactionEdit.transaction.amount;
            return (value).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        },
        relatedTransactions: function() {
            if (!this.sharedState.transactionEdit.relatedTransactions) {
                return false;
            } else if (
                this.sharedState.transactionEdit.relatedTransactions.length == 0
            ) {
                return false;
            } else {
                return true;
            }
        }
    },
    watch: {},
    filters: {
        
    }
};
</script>

<style>

</style>