var fs = require("fs");
var text = fs.readFileSync("./mytext.txt");
var textByLine = text.split("\n")