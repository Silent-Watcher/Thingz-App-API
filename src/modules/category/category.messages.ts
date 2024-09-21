const categoryMessages = Object.freeze({
  dataNotProvided: 'minimum requirements are not provided!',
  created: (name: string) => `category ${name} created successfully!`,
  notFoundWithId: 'category with given id not found!',
  deleted: 'category deleted successfully.',
  failedToDelete: 'failed to delete the category try again',
});

export default categoryMessages;
