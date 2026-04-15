<treatment name="exp_test_experiment">
    <template #default="{ treatment, ready, failed }">
        <template v-if="ready">
            <my-button v-if="treatment == 0"></my-button>
            <my-button v-else-if="treatment == 1"></my-button>
            <my-other-button v-else-if="treatment == 2"></my-other-button>
        </template>
        <template v-else><my-spinner></my-spinner></template>
    </template>
</treatment>
