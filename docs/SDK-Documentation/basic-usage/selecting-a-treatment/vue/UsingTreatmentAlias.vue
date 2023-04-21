<treatment name="exp_test_experiment">
    <template #A>
        <my-button></my-button>
    </template>
    <template #B="{ config }">
        <my-button :color="config.color"></my-button>
    </template>
    <template #loading>
        <my-spinner></my-spinner>
    </template>
</treatment>
