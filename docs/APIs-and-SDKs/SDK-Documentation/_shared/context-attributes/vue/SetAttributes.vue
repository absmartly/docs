<treatment
  name="exp_test_experiment"
  :attributes="{ customer_age: 'returning' }"
>
  <template #default="{ config, treatment, ready }">
    <template v-if="ready">
      <my-button v-if="treatment == 0"></my-button>
      <my-button v-else-if="treatment == 1" :color="config.color"></my-button>
      <my-other-button
        v-else-if="treatment == 2"
        :color="config.color"
      ></my-other-button>
    </template>
    <template v-else><my-spinner></my-spinner></template>
  </template>
</treatment>
