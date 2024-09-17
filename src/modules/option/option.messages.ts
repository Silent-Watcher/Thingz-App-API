const optionMessages = Object.freeze({
  dataNotProvided: 'minimum requirements are not provided! (category, type, title, key)',
  duplicateKeyValue: (value: string): string =>
    `the key with value of ${value} is already exists within this category options`,
});
export default optionMessages;
