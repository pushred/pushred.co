module.exports = (post) => {
  return (post.title)
    ? post.title
    : post.url.replace(/http(s)?:\/\//, '').replace(/github\.com/, '').replace(/www\./, '');
};
