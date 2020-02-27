<template>
    <form id="account-form" v-on:submit.prevent="postData" method="POST" v-bind:class="{ editing: newAccountMode }">
            <input class="btn" type="button" name="add-account" @click="newAccount" v-bind:value="accountButtonText">
            <p class="form-els">
                <label class="form-label" for="bank_select">Bank:</label>
                <select v-model="bank_select" id="bank_select" :disabled="newAccountMode">
                    <option v-for="bank_ in sharedState.banks" v-bind:key="bank_.id" v-bind:value="bank_.id">
                        {{ bank_.name }}
                    </option>
                </select>
            </p>
            <p class="form-els">
                <label class="form-label" for="name">Name:</label>
                <input name="name" v-model="bank.name">
            </p>
            <p class="form-els">
                <label class="form-label" for="debit_positive">Debit is positive:</label>
                <input type="checkbox" name="debit_positive" v-model="bank.debit_positive">
            </p>
            <p class="form-els">
                <label class="form-label" for="date-format">Date Format:</label>
                <select @change="dateFormatSelector" id="date-format-1">
                    <option v-for="opt in dateOptions" v-bind:key="opt" :selected="opt == dateOptionSelectFirst">
                        {{ opt }}
                    </option>
                </select>
                <select @change="dateSeperatorSelector" id="date-seperator-1">
                    <option v-for="opt in dateSeperators" v-bind:key="opt" :selected="opt == dateSeperatorSelect">
                        {{ opt }}
                    </option>
                </select>
                <select @change="dateFormatSelector" id="date-format-2">
                    <option v-for="opt in dateOptions" v-bind:key="opt" :selected="opt == dateOptionSelectSecond">
                        {{ opt }}
                    </option>
                </select>
                <select @change="dateSeperatorSelector" id="date-seperator-2">
                    <option v-for="opt in dateSeperators" v-bind:key="opt" :selected="opt == dateSeperatorSelect">
                        {{ opt }}
                    </option>
                </select>
                <select @change="dateFormatSelector" id="date-format-3">
                    <option v-for="opt in dateOptions" v-bind:key="opt" :selected="opt == dateOptionSelectThird">
                        {{ opt }}
                    </option>
                </select>
            </p>
        <h3>Field Mappings</h3>
        
            <p class="form-els">
                <label class="form-label" for="credit">credit:</label>
                <input name="credit" v-model="bank.credit_map">
            </p>
            <p class="form-els">
                <label class="form-label" for="debit">debit:</label>
                <input name="debit" v-model="bank.debit_map">
            </p>
            <p class="form-els">
                <label class="form-label" for="description">description:</label>
                <input name="description" v-model="bank.description_map">
            </p>
            <p class="form-els">
                <label class="form-label" for="date">date:</label>
                <input name="date" v-model="bank.date_map">
            </p>
            <p class="form-els">
                <label class="form-label" for="category">category:</label>
                <input name="category" v-model="bank.category_map">
            </p>
        <p class="form-els">
            <input :disabled="!bank_select && !newAccountMode" type="submit" value="Save" class="btn">
            <input :disabled="!bank_select" type="button" value="Delete" class="btn" @click="deleteAccount">
        </p>
    </form>
</template>
<script>

import { store } from '../store.js';

export default {
    data () {
        return {
            sharedState: store.state,
            bank: {},
            bank_select: null,
            bank_selectRestore: null,
            newAccountMode: false,
            accountButtonText: 'Add New Account',
            monthOptions: ['MM',],
            dayOptions: ['DD',],
            yearOptions: ['YY', 'YYYY'],
            dateSeperators: ['/', '.', '-', '\\'],
            dateSeperatorSelect: '/',
            dateOptionSelectFirst: 'MM',
            dateOptionSelectSecond: 'DD',
            dateOptionSelectThird: 'YYYY',
        }
    },

    watch: {
        bank_select: function() {
            if (this.bank_select) {
                this.bank = this.sharedState.banks.find((e) => { return e.id == this.bank_select });
                this.parseDateFormat();
            } else {
                this.bank = {};
            }
            
        }
    },
    methods: {
        postData: async function() {
            if (this.newAccountMode) {
                // get list of bank ids before transaction
                const old_ids = this.sharedState.banks.map(e => e.id);
                // wait for the transaction to complete
                this.storeDateFormat();
                await store.addBank(this.bank);
                // get the new list of ids
                const new_ids = this.sharedState.banks.map(e => e.id);
                // find the (hopefully) one that's different, assume it's the new bank
                const diff_id = new_ids.filter(e => !old_ids.includes(e));
                // just to be sure
                if (diff_id.length == 1) {
                    this.bank_selectRestore = diff_id[0];
                }
                // flip out of edit mode
                this.newAccount();
            } else {
                this.storeDateFormat();
                store.editBank(this.bank);
            }
        },
        deleteAccount: function() {
            store.deleteBank(this.bank_select);
            this.bank_select = null;
        },
        newAccount: function() {
            this.newAccountMode = !this.newAccountMode;
            if (this.newAccountMode) {
                // Store the original bank select so we can return to this account if cancel
                this.bank_selectRestore = this.bank_select;
                this.bank_select = null;
                this.accountButtonText = 'Cancel';
            } else {
                this.bank_select = this.bank_selectRestore;
                this.accountButtonText = 'Add New Account';
            }
        },
        dateFormatSelector: function(e) {
            let v = e.target.value;
            let el = e.target.id;
            if (el=='date-format-1') {
                this.dateOptionSelectFirst = v;
            } else if (el=='date-format-2') {
                this.dateOptionSelectSecond = v;
            } else if (el=='date-format-3') {
                this.dateOptionSelectThird = v;
            }
        },
        dateSeperatorSelector: function(e) {
            this.dateSeperatorSelect = e.target.value;
        },
        parseDateFormat: function() {
            const map = {'m': 'MM', 'd': 'DD', 'y': 'YY', 'Y': 'YYYY'};
            const re = /%(\w)(\W)%(\w)(\W)%(\w)/g;
            const arr = re.exec(this.bank.date_format);
            if (arr.length==6) {
                if (arr[2] == arr[4]) {
                    this.dateSeperatorSelect = arr[2];
                }
                this.dateOptionSelectFirst = map[arr[1]];
                this.dateOptionSelectSecond = map[arr[3]];
                this.dateOptionSelectThird = map[arr[5]];
            }
        },
        storeDateFormat: function() {
            const map = {'MM': 'm', 'DD': 'd', 'YY': 'y', 'YYYY': 'Y'};
            this.bank.date_format = `%${map[this.dateOptionSelectFirst]}${this.dateSeperatorSelect}%${map[this.dateOptionSelectSecond]}${this.dateSeperatorSelect}%${map[this.dateOptionSelectThird]}`;
        }
    },
    computed: {
        dateOptions: function() {
            let opts = [];
            opts = opts.concat(this.monthOptions);
            opts = opts.concat(this.dayOptions);
            opts = opts.concat(this.yearOptions);
            return opts;
        }
    }
}
</script>

<style>
    #account-form {
        padding: 1em;
        margin: 1em;
    }
    .form-label {
        padding-right: 1em;
        display: inline-block;
        width: 7em;
        text-align: right;
    }
</style>