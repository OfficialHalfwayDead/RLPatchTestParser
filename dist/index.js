"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse = require("csv-parse");
const parser = parse();
const carStats = new Array();
parser.on('readable', function () {
    let record;
    while (record = parser.read()) {
        carStats.push(record);
    }
});
parser.on('error', function (err) {
    console.error(err.message);
});
parser.on('end', function () {
    console.log(carStats);
});
parser.write("bullshit, you, motherfucker\ntestin,this, shit");
parser.end();
