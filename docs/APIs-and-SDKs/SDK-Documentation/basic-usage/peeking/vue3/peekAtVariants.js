import { useABSmartly } from "@absmartly/vue3-sdk";

const { peek } = useABSmartly();

if (peek("exp_test_experiment").value == 0) {
  // user is in control group (variant 0)
} else {
  // user is in treatment group
}
