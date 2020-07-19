<template>
    <v-dialog v-model="sharedState.accountEdit.editMode" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Edit Account</span>
            </v-card-title>

            <v-card-text>
                <v-container v-if="sharedState.accountEdit.account">
                    <v-row>
                        <v-col>
                            <v-text-field v-model="sharedState.accountEdit.account.name" label="Name"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-checkbox v-model="sharedState.accountEdit.account.debit_positive" label="Debit positive"></v-checkbox>
                        </v-col>
                    
                        <v-col>
                            <v-select
                                v-model="sharedState.accountEdit.account.date_format"
                                :items="dateFormat" 
                                label="Date Format"
                                item-text="display"
                                item-value="value"
                            >
                            </v-select>
                        </v-col>
                    </v-row>
                </v-container>
                Field Mappings
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="sharedState.accountEdit.account.credit_map" label="credit"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="sharedState.accountEdit.account.debit_map" label="debit"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="sharedState.accountEdit.account.description_map" label="description"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="sharedState.accountEdit.account.date_map" label="date"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="sharedState.accountEdit.account.category_map" label="category"></v-text-field>
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
            dateFormat: [
                {
                    value: '%m/%d/%Y',
                    display: 'MM/DD/YYYY'
                },
                {
                    value: '%m/%d/%y',
                    display: 'MM/DD/YY'
                }
            ],
        };
    },
    
    methods: {
        save: function() {
            store.editBank(this.sharedState.accountEdit.account);
        },
        close: function() {
            store.exitAccountEditMode();
        }
    
    },
    computed: {
         },
    watch: {},
    filters: {}
};
</script>

<style>

</style>