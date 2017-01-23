var pageRegex = /<pb id="([^<>]+)"/g;
var jpRegex = /<jp id="([^<>]+)"/
var pageIdStore = {};
var jpIdStore = {};
//var pattern = process.argv[2];
//console.log(pattern);
//process.exit(1);

var Path = require('path');
var glob = require('glob');
var fs = require('fs');

module.exports = function checkRepeatPb(pattern) {

  var routes = glob.sync(pattern, {nosort: true});

  var files = routes.map((route) => {
    let fileName = Path.basename(route);
    let text = fs.readFileSync(route, 'utf8');

    return {'fileName': fileName, 'text': text};
  });

  function alertReteatPage(file, i) {
    file.text.replace(pageRegex, function(m, m1) {
      var storedId = pageIdStore[m1];
      var fileName = file.fileName;

      if (!storedId) {
        pageIdStore[m1] = fileName;
      }
      else {
        throw new Error(m1 + ' ' + storedId + ' ' + fileName);
      }
    });

    file.text.replace(jpRegex, function(m, m1) {
      var storedId = jpIdStore[m1];
      var fileName = file.fileName;

      if (!storedId) {
        jpIdStore[m1] = fileName;
      }
      else {
        throw new Error(m1 + ' ' + storedId + ' ' + fileName);
      }
    });
  }

  files.map(alertReteatPage);
};