<template>
    <v-dialog v-model="sharedState.newTransactionDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Create Transaction</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-form lazy-validation ref="form">
                    <v-row>
                        <v-col >
                            <v-select 
                                v-model="transaction.account_id"
                                :items="sharedState.banks" 
                                label="Account"
                                item-text="name"
                                item-value="id"
                                prepend-icon="mdi-bank"
                                required
                                :rules="[v => !!v || 'Select an account']">
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
                                    v-model="transaction.date"
                                    label="Date"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-on="on"
                                    :rules="[v => !!v || 'Select a date']"
                                ></v-text-field>
                                </template>
                                <v-date-picker 
                                v-model="transaction.date" 
                                @input="dateMenu = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field 
                                v-model="transaction.description" 
                                label="Description"
                                :rules="[v => !!v || 'Enter a description']"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col >
                            <v-select 
                                v-model="transaction.cateogory_id"
                                :items="sharedState.categories" 
                                label="Category"
                                item-text="name"
                                item-value="id"
                                prepend-icon="mdi-tag"
                                append-outer-icon="mdi-tag-plus"
                                @click:append-outer="sharedState.newCategoryDialog = true"
                                >
                            </v-select> 
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field 
                                v-model="transaction.amount" 
                                label="Amount"
                                :rules="[v => !!v || 'Enter transaction amount']"
                                prepend-icon="mdi-cash-usd"></v-text-field>
                        </v-col>
                    </v-row>
                    </v-form>
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
            transaction: {
                account_id: null,
                date: '',
                description: '',
                amount: null,
                category_id: null,
            }
        };
    },
    
    methods: {
        save: function() {
            store.addTransaction(this.transaction);
            this.close();
            
        },
        close: function() {
            this.transaction = {
                account_id: null,
                date: '',
                description: '',
                amount: null,
            };
            this.sharedState.newTransactionDialog = false;
            this.$refs.form.resetValidation();
        }
    },
    computed: {},
    watch: {},
    filters: {}
};
</script>

<style>

</style>