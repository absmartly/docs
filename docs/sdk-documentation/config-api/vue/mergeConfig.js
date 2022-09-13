// Import the mergeConfig function.
import { mergeConfig } from "@absmartly/vue2-sdk";

/*

Your current config might be something like:

const myAppConfig = { ... };

or

const myAppConfig = getConfigFromFile(config.json);

then you just need to add the mergeConfig function like this:
*/

const myAppConfig = mergeConfig(getConfigFromFile(config.json));
