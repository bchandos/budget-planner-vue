<template>
    <div>
        <div v-for="bank in sharedState.banks" v-bind:key="bank.id">
            <h2>{{ bank.name }}</h2>
            Balance: $ 
            <span v-bind:class="[ bankBalance(bank.id) < 0 ? 'negative-balance' : 'positive-balance' ]">
                {{ bankBalance(bank.id) | neatNumber }}
            </span>
        </div>
    </div>
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
        bankBalance: function(bank_id) {
            let bankTrans = this.sharedState.transactions.filter(function(t) { return t.account == bank_id });
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
            return Number.parseFloat(value).toFixed(2);
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