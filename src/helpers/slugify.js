// https://gist.github.com/codeguy/6684588?permalink_comment_id=3243980#gistcomment-3243980
module.exports = function slugify(text) {
  return text
      .toString() // Cast to string (optional)
      // returns the Unicode Normalization Form of a given string.
      .normalize('NFKD')
      .toLowerCase() // Convert the string to lowercase letters
      .trim() // Remove whitespace from both sides of a string (optional)
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};
