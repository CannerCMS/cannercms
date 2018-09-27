export const galleryValidation = {
  validator: (content, reject) => {
    if (content.length === 0) {
      return reject("should at least have one photo");
    }
  }
};