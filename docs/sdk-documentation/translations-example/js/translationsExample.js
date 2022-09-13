let translations = {
    header1: { en: "Our nice header!", nl: "Onze leuk kop!" },
    call_to_action1: { en: "Click here!", ... },
};

// And then somewhere after the SDK initialization
const newTagsToFetch = context.variableKeys();

const translationVariations = fetchTranslations(newTagsToFetch);
/*
{
    header1_v1: { en: "Our beautiful header!", nl: "Onze mooie kop!" },
    call_to_action1_v1: { en: "Continue", ... },
}
*/

translations = mergeConfig(translations, translationVariations);
/*
{
    get header1: () => {
      exp.treatment("experiment1");
      return {
        en: "Our beautiful header!",
        nl: "Onze mooie kop!",
      };
    }
    get call_to_action1: () => {
      exp.treatment("experiment2");
      return {
        en: "Click here!",
        ...
      };
    }
}
*/
