<template>
    <v-dialog v-model="sharedState.importDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Edit Transaction</span>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-select 
                            v-model="bank_select"
                            :items="sharedState.banks" 
                            label="Account"
                            item-text="name"
                            item-value="id">
                        </v-select> 
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-file-input v-model="file" show-size label="CSV File"/>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="sharedState.importDialog = false">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="postData">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
        postData: function() {
            store.importTransactions(this.file, this.bank_select);
            this.sharedState.importDialog = false;
        }
    }
}
</script>