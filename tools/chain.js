var fs = require('fs');
var template = require('./template');
var coffee = require('coffee-script');

for (var name of process.argv.slice(2)) {
  try {
    var parts = name.match(/^tmp\/([^_]*)(?:_(.*))?-(.*)\.(.*)\.js$/);
    var sourceName = `src/${parts[1]}/${parts[3]}.${parts[4]}`;
    var script = fs.readFileSync(sourceName, 'utf8');
    script = script.replace(/\r\n/g, '\n');
    script = template(script, {type: parts[2]}, sourceName);
    if (parts[4] === 'coffee') {
      script = coffee.compile(script);
      if (/^[$A-Z][$\w]*$/.test(parts[3])) {
        script = `${parts[3]} = ${script}`;
      }
    }
    script += '\n';
    fs.writeFileSync(name, script);
  } catch (err) {
    console.error(`Error processing ${name}`);
    throw err;
  }
}


