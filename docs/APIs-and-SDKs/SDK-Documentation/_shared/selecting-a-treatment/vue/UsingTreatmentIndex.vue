<treatment name="exp_test_experiment">
    <template #0>
        <my-button></my-button>
    </template>
    <template #1="{ treatment }">
        <my-button :variant="treatment"></my-button>
    </template>
    <template #2="{ treatment }">
        <my-other-button :variant="treatment"></my-other-button>
    </template>
    <template #loading>
        <my-spinner></my-spinner>
    </template>
</treatment>
