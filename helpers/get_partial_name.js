module.exports = function (file) {
  console.log(file);

  var path = file.shortPath.split('/');

  return (path[2] && path[1] === path[2])
    ? path[1]
    : file.shortPath;
}
