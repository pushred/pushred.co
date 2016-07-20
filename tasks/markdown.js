var through = require('through2');

var markdownIt = require('markdown-it')({
  html: true,
  typographer: true,
  quotes: '“”‘’'
});

module.exports = () => {
  return through.obj(function (input, enc, cb) {
    var data = JSON.parse(input.contents.toString());

    Object.keys(data).forEach((date) => {
      Object.keys(data[date]).forEach((project) => {
        const details = data[date][project].details;
        if (!details) return;

        data[date][project].details = markdownIt.render(details);
      });
    });

    input.contents = new Buffer(JSON.stringify(data));

    this.push(input);
    cb();
  });
}
