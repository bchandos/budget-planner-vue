<template>
    <form id="import_form" v-on:submit.prevent="postData" method="POST">
        <p class="form-els">
            <label for="file_upload">Select File:</label>
            <input type="file" ref="fileUpload" @change="selectFile">
        </p>
        <p class="form-els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank in sharedState.banks" v-bind:key="bank.id" v-bind:value="bank.id">
                    {{ bank.name }}
                </option>
            </select>
        </p>
        <p class="form-els" style="text-align: center;">
            <input type="submit" value="Import" class="btn">
        </p>
    </form>
</template>
<script>
import { store } from '../store.js';

export default {
    data () {
        return {
            sharedState: store.state,
            bank_select: null,
            file: null,
        }
    },

    methods: {
        selectFile: function() {
            this.file = this.$refs.fileUpload.files[0];
        },
        postData: function() {
            store.importTransactions(this.file, this.bank_select);
            this.$emit('close');
        }
    }
}
</script>