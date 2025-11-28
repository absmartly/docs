<treatment name="exp_test_experiment">
    <template #0>
        <my-button></my-button>
    </template>
    <template #1="{ config }">
        <my-button :color="config.color"></my-button>
    </template>
    <template #2="{ config }">
        <my-other-button :color="config.color"></my-other-button>
    </template>
    <template #loading>
        <my-spinner></my-spinner>
    </template>
</treatment>
