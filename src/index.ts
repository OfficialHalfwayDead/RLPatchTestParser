import parse = require('csv-parse');
import assert = require('assert');
import fs = require('fs');
import {Car} from './car';


const parser = parse();

const carStats = new Array<Array<string>>();

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
    const dom = Car.fromStatMap("Dominus", mapFromTupleList(carStats));
    console.log(dom);
    console.log(dom.getVisualOffset().toFixed(4));

});

function mapFromTupleList(list: Array<Array<string>>): Map<string, number> {
    let output = new Map<string, number>();
    for (const tuple of list) {
        if (tuple.length === 2) {
            assert(!output.has(tuple[0]));
            output.set(tuple[0], parseFloat(tuple[1]));
        } else {
            console.error("Dictionary couldn't be created from tuple list because tuples were wrong size: " + tuple.length.toString());
        }
    }
    return output;
}

fs.createReadStream("H:/timoh/Documents/RLpatchTest/RocketLeaguePatchTesterResults/current_patch/logs/CarStats/Ripper.csv").pipe(parser);