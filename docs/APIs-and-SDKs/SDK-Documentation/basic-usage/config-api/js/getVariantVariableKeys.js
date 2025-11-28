// Get the keys of the variant variables from the context
const tagsToFetch = context.variableKeys();

const translationVariations = fetchTranslations(tagsToFetch);
