<template>
    <form id="transaction_form" v-bind:class="{ editing: editMode }" v-on:submit.prevent="$emit('postData')" method="POST">
        <input type="hidden" v-model="id">
        <p class="form_els">
            <label class="transaction_form_label" for="date">Date:</label>
            <input type="date" v-model="date" id="date">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="bank_select">Bank:</label>
            <select v-model="bank_select" id="bank_select">
                <option v-for="bank in banks" v-bind:key="bank.value" v-bind:value="bank.value">
                    {{ bank.text }}
                </option>
            </select>
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="description">Description:</label>
            <input v-model="description" id="description" placeholder="description">
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="category_select">Category:</label>
            <select v-model="category_select" id="category_select">
                <option v-for="category in categories" v-bind:key="category.value" v-bind:value="category.value">
                    {{ category.text }}
                </option>
            </select>
        </p>
        <p class="form_els">
            <label class="transaction_form_label" for="debit">Debit:</label>
            <input v-model.number="debit" id="debit" placeholder="debit">
        </p>
        <p class="form_els">
            <input class="btn" :disabled="editMode" type="submit" value="Submit">
            <input class="btn" :disabled="!editMode" type="submit" value="Save Edits">
            <a v-if="editMode" href="" @click.prevent="$emit('exitEdit')">
                <img class="icon" src="icons/exit-edit-icon.svg" alt="exit edit transaction mode" />
            </a>
        </p>
    </form>
</template>

<script>
export default {
    props: ['editMode',
            'date', 
            'banks', 
            'bank_select', 
            'description',
            'categories',
            'category_select',
            'debit']
}
</script>