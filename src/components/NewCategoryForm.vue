<template>
    <v-row justify="center">
        <v-dialog v-model="sharedState.newCategoryDialog" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Category</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    prepend-icon="mdi-tag"
                                    clearable
                                    v-model="newCategory"
                                    label="New Category"
                                    required
                                    @change="addCategory"
                                    :autofocus="sharedState.newCategoryDialog"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="addTweeter">Add</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { store } from "../store";

export default {
    data: () => ({
        sharedState: store.state,
        newCategory: '',
    }),
    methods: {
        addCategory: function() {
            if (this.newCategory) {
                store.addCategory(this.newCategory);
                this.newCategory = '';
                this.sharedState.newCategoryDialog = false;
            }
        },
        closeDialog: function() {
            this.newCategory = '';
            this.sharedState.newCategoryDialog = false;
        }
    }
};
</script>