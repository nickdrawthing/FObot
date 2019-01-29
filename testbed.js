var t = require("./text_parser.js");

console.log(t.makeReadable(t.branchedString(t.listifyStringArray(["an apple","a pear","an [orange|apricot]"])+".")));
console.log(t.makeReadable(t.listifyStringArray(["an apple","a pear"])+"."));
console.log(t.makeReadable(t.listifyStringArray(["an apple"])+"."));
console.log(t.listifyStringArray([]));