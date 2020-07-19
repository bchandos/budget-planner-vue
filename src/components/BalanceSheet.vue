<template>
    <v-dialog v-model="sharedState.balanceDialog" max-width="550px">
        <v-card>
            <v-card-title>Balances</v-card-title>
            <v-card-text>
                <v-container v-for="bank in sharedState.banks" v-bind:key="bank.id">
                    <v-row>
                        <v-col class="text-right">
                            {{ bank.name }} Balance:
                        </v-col>
                        <v-col>
                            <span v-bind:class="[ bankBalance(bank.id) < 0 ? 'negative-balance' : 'positive-balance' ]">
                                {{ bankBalance(bank.id) | neatNumber }}
                            </span>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { store } from '../store.js';

export default {
    data() {
        return {
            sharedState: store.state,
        }
    },
    methods: {
        close: function() {
            this.sharedState.balanceDialog = false;
        },
        bankBalance: function(bank_id) {
            let bankTrans = this.sharedState.transactions.filter(function(t) { return t.account_id.id == bank_id });
            if (bankTrans) {
                return bankTrans.reduce((accumulator, currentTrans) => {
                    return accumulator + currentTrans.amount;
                }, 0);
            } else {
                return 0;
            }
        },
    },
    computed: {
        
    },
    filters: {
        neatNumber: function(value) {
            return (value).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        },
    },
}
</script>

<style>
    span {
        padding: 0.5em;
        border-radius: 3px;
    }
    .negative-balance {
        background-color: rgb(250, 110, 110);
    }
    .positive-balance {
        background: rgb(112, 255, 112);
    }
</style>