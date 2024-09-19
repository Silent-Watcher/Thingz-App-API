const optionMessages = Object.freeze({
  dataNotProvided: 'minimum requirements are not provided!',
  duplicateKeyValue: (value: string): string =>
    `the key with value of ${value} is already exists within this category options`,
  deleted: (id: string) => `option with id ${id} deleted successfully`,
  notFound: (id: string) => `option with id ${id} not found`,
  updated: (id: string) => `option with id ${id} updated successfully`,
  notFoundWithinCategory: 'option with given id not found within this category',
});
export default optionMessages;
