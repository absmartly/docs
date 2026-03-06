import { useABSmartly } from "@absmartly/vue3-sdk";

const { treatment } = useABSmartly();

const treatmentVariant = treatment("exp_test_experiment");

if (treatmentVariant.value === 0) {
  // user is in control group (variant 0)
} else if (treatmentVariant.value === 1) {
  // user is in treatment group (variant 1)
}
