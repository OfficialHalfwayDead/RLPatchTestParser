import parse = require('csv-parse');
import assert = require('assert');
import fs = require('fs');
import path = require('path');
import { Car, HumanReadableCar, HumanReadableWheels, HitboxPreset, HumanReadableHitbox } from './car';

const patchDir = "../RocketLeaguePatchTesterResults/";
const carStatsDir = "/current_patch/logs/CarStats/";
const outDir = "../ProcessedPatchTesterResults/";
const outCars = "/Cars/";
const outHitboxes = "/Hitboxes/"



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


const carFileList = fs.readdirSync(path.join(patchDir, carStatsDir));

const parser = parse();

const cars = new Array<Car>();
const hitboxes = new Array<HitboxPreset>();


carFileList.forEach((filename) => {
    const name = filename.substring(0, filename.length - 4);
    const fullpath = path.join(patchDir, carStatsDir, filename);
    fs.readFile(fullpath, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        parse(data.toString(), (err, output) => {
            if (err) {
                console.error(err);
                return;
            }

            const map = mapFromTupleList(output); // type any but should be Array<Array<string>>
            const car = Car.fromStatMap(name, map);
            cars.push(car);
            if (carFileList.length === cars.length) {
                allCarsRead();
            }
        });
    });
});



function allCarsRead(): void {
    cars.sort(function (a, b) {
        var nameA = a.getName().toLowerCase(), nameB = b.getName().toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    saveHumanReadableCarStats(2);
    checkHitboxes();
}

function saveHumanReadableCarStats(precision: number): void {
    let humanReadableCars = new Array<string>();
    cars.forEach((car) => {
        let wheelFL = car.getWheels().getFrontLeft();
        let wheelFR = car.getWheels().getFrontRight();
        let wheelBL = car.getWheels().getBackLeft();
        let wheelBR = car.getWheels().getBackRight();

        let readableWheels: HumanReadableWheels = {
            FrontLeft: {
                Radius: wheelFL.getRadius(),
                LocationOffset: wheelFL.getOffset(),
                GroundSuspensionDistance: wheelFL.getRestingSuspensionDistance()
            },
            FrontRight: {
                Radius: wheelFR.getRadius(),
                LocationOffset: wheelFR.getOffset(),
                GroundSuspensionDistance: wheelFR.getRestingSuspensionDistance()
            },
            BackLeft: {
                Radius: wheelBL.getRadius(),
                LocationOffset: wheelBL.getOffset(),
                GroundSuspensionDistance: wheelBL.getRestingSuspensionDistance()
            },
            BackRight: {
                Radius: wheelBR.getRadius(),
                LocationOffset: wheelBR.getOffset(),
                GroundSuspensionDistance: wheelBR.getRestingSuspensionDistance()
            },
        };
        let readableCar: HumanReadableCar = {
            Name: car.getName(),
            HitboxSize: car.getHitbox().getSize(),
            HitboxOffset: car.getHitbox().getOffset(),
            MeshOffset: car.getVisualOffset(),
            GroundRotation: car.getRestingRotation().toEulerAngle().useDegrees(),
            GroundLocation: car.getRestingLocation(),
            Wheels: readableWheels
        };
        humanReadableCars.push(JSON.stringify(readableCar, (key, value) => (typeof (value) === "number") ? value.toFixed(precision) : value, 2));
    });

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    if (!fs.existsSync(path.join(outDir, outCars))) {
        fs.mkdirSync(path.join(outDir, outCars));
    }

    humanReadableCars.forEach((value, index) => {
        fs.writeFile(path.join(outDir, outCars, cars[index].getName() + ".json"), value, (err) => { if (err) console.error(err); });
    });
}

function checkHitboxes(): void {
    cars.forEach((car) => {
        let matched = false;
        for (const hitbox of hitboxes)
        {
            if (hitbox.doesCarMatch(car)) {
                if (matched) {
                    console.error("Car matched multiple hitboxes.");
                }
                hitbox.addCar(car);
                matched = true;
            }
        }
        if (!matched) {
            hitboxes.push(new HitboxPreset(car));
        }
    });

    const humanReadableHitboxes = new Array<string>();
    hitboxes.forEach((hitbox) => {
        let wheelFL = hitbox.getWheels().getFrontLeft();
        let wheelFR = hitbox.getWheels().getFrontRight();
        let wheelBL = hitbox.getWheels().getBackLeft();
        let wheelBR = hitbox.getWheels().getBackRight();

        let readableWheels: HumanReadableWheels = {
            FrontLeft: {
                Radius: wheelFL.getRadius(),
                LocationOffset: wheelFL.getOffset(),
                GroundSuspensionDistance: wheelFL.getRestingSuspensionDistance()
            },
            FrontRight: {
                Radius: wheelFR.getRadius(),
                LocationOffset: wheelFR.getOffset(),
                GroundSuspensionDistance: wheelFR.getRestingSuspensionDistance()
            },
            BackLeft: {
                Radius: wheelBL.getRadius(),
                LocationOffset: wheelBL.getOffset(),
                GroundSuspensionDistance: wheelBL.getRestingSuspensionDistance()
            },
            BackRight: {
                Radius: wheelBR.getRadius(),
                LocationOffset: wheelBR.getOffset(),
                GroundSuspensionDistance: wheelBR.getRestingSuspensionDistance()
            },
        };
        let readableHitbox: HumanReadableHitbox = {
            HitboxSize: hitbox.getHitbox().getSize(),
            HitboxOffset: hitbox.getHitbox().getOffset(),
            GroundRotation: hitbox.getRestingRotation().toEulerAngle().useDegrees(),
            GroundLocation: hitbox.getRestingLocation(),
            Wheels: readableWheels,
            Cars: hitbox.getCarNames()
        };
        humanReadableHitboxes.push(JSON.stringify(readableHitbox, null, 2));
    });

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    if (!fs.existsSync(path.join(outDir, outHitboxes))) {
        fs.mkdirSync(path.join(outDir, outHitboxes));
    }

    humanReadableHitboxes.forEach((value, index) => {
        fs.writeFile(path.join(outDir, outHitboxes, index.toString() + ".json"), value, (err) => { if (err) console.error(err); });
    });
}



