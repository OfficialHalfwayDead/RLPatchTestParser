import { Vector, Quaternion } from './primitives';
class Hitbox {
    private extent: Vector;
    private offset: Vector;

    constructor(extent: Vector, offset: Vector) {
        this.extent = extent.copy();
        this.offset = offset.copy();
    }

    copy(): Hitbox {
        return new Hitbox(this.extent, this.offset);
    }

    equal(other: Hitbox): boolean {
        return (this.extent.equal(other.extent) && this.offset.equal(other.offset));
    }

    getExtent(): Vector {
        return this.extent.copy();
    }

    getOffset(): Vector {
        return this.offset.copy();
    }

    getSize(): Vector {
        return this.extent.scaledCopy(2);
    }
}

class Wheel {
    private radius: number;
    private localOffset: Vector;
    private presetOffset: Vector;
    private restingSuspensionDistance: number;

    constructor(radius: number, localOffset: Vector, presetOffset: Vector, restingSuspensionDistance: number) {
        this.radius = radius;
        this.localOffset = localOffset.copy();
        this.presetOffset = presetOffset.copy();
        this.restingSuspensionDistance = restingSuspensionDistance;
    }

    copy(): Wheel {
        return new Wheel(this.radius, this.localOffset, this.presetOffset, this.restingSuspensionDistance);
    }

    equal(other: Wheel): boolean {
        return (this.radius === other.radius
            && this.getOffset().equal(other.getOffset())
            && this.restingSuspensionDistance === other.restingSuspensionDistance);
    }

    getRadius(): number {
        return this.radius;
    }

    getOffset(): Vector {
        // Batmobile has PresetOffsets of 0 on all axes
        return (this.presetOffset.length2() < 0.0001) ? this.localOffset.copy() : this.presetOffset.copy();
    }

    getRestingSuspensionDistance(): number {
        return this.restingSuspensionDistance;
    }

    static fromStatMap(wheelName: String, map: Map<string, number>): Wheel {
        let placeholder = map.get(wheelName + ".WheelRadius");
        const radius: number = (placeholder === undefined) ? 0 : placeholder;
        const localOffset = Vector.fromStatMap(wheelName + ".LocalRestPosition", map);
        const presetOffset = Vector.fromStatMap(wheelName + ".PresetRestPosition", map);
        placeholder = map.get(wheelName + ".GetSuspensionDistance");
        const supsensionDistance: number = (placeholder === undefined) ? 0 : placeholder;

        return new Wheel(radius, localOffset, presetOffset, supsensionDistance);
    }

}

class Wheels {
    private frontLeft: Wheel;
    private frontRight: Wheel;
    private backLeft: Wheel;
    private backRight: Wheel;

    constructor(frontLeft: Wheel, frontRight: Wheel, backLeft: Wheel, backRight: Wheel) {
        this.frontLeft = frontLeft.copy();
        this.frontRight = frontRight.copy();
        this.backLeft = backLeft.copy();
        this.backRight = backRight.copy();
    }

    copy(): Wheels {
        return new Wheels(this.frontLeft, this.frontRight, this.backLeft, this.backRight);
    }

    equal(other: Wheels): boolean {
        return (this.frontLeft.equal(other.frontLeft)
            && this.frontRight.equal(other.frontRight)
            && this.backLeft.equal(other.backLeft)
            && this.backRight.equal(other.backRight));
    }
}

export class Car {
    private name: string;
    private hitbox: Hitbox;
    private restingVisualLocation: Vector;
    private restingRotation: Quaternion;
    private restingLocation: Vector;
    private wheels: Wheels;

    constructor(name: string, hitbox: Hitbox, visualLocation: Vector, restingRotation: Quaternion, restingLocation: Vector, wheels: Wheels) {
        this.name = name;
        this.hitbox = hitbox.copy();
        this.restingVisualLocation = visualLocation.copy();
        this.restingRotation = restingRotation.copy();
        this.restingLocation = restingLocation.copy();
        this.wheels = wheels.copy();
    }

    getHitbox(): Hitbox {
        return this.hitbox.copy();
    }

    getName(): string {
        return this.name;
    }

    getVisualOffset(): Vector {
        let unadjustedOffset = Vector.subtract(this.restingVisualLocation, this.restingLocation);
        const rotation = this.restingRotation.invertedCopy();
        return unadjustedOffset.rotatedCopy(rotation);
    }

    getRestingLocation(): Vector {
        return this.restingLocation.copy();
    }

    getRestingRotation(): Quaternion {
        return this.restingRotation.copy();
    }

    getWheels(): Wheels {
        return this.wheels.copy();
    }

    isOfPreset(preset: HitboxPreset): boolean {
        return preset.doesCarMatch(this);
    }

    static fromStatMap(name: string, map: Map<string, number>): Car {
        const location = Vector.fromStatMap("car.Location", map);
        const rotation = Quaternion.fromStatMap("car.Quaternion", map);
        const extent = Vector.fromStatMap("car.LocalCollisionExtent", map);
        const offset = Vector.fromStatMap("car.LocalCollisionOffset", map);
        const visualLocation = Vector.fromStatMap("car.CarMesh.GetPosition", map);

        const wheels = new Wheels(
            Wheel.fromStatMap("car.Wheel0", map),
            Wheel.fromStatMap("car.Wheel1", map),
            Wheel.fromStatMap("car.Wheel2", map),
            Wheel.fromStatMap("car.Wheel3", map));


        return new Car(name, new Hitbox(extent, offset), visualLocation, rotation, location, wheels);
    }
}

class HitboxPreset {
    private hitbox: Hitbox;
    private restingRotation: Quaternion;
    private restingLocation: Vector;
    private wheels: Wheels;
    private cars = new Array<Car>();

    constructor(car: Car) {
        this.cars.push(car);
        this.hitbox = car.getHitbox();
        this.restingLocation = car.getRestingLocation();
        this.restingRotation = car.getRestingRotation();
        this.wheels = car.getWheels();
    }

    doesCarMatch(car: Car): boolean {
        return (this.hitbox.equal(car.getHitbox())
            && this.restingLocation.equal(car.getRestingLocation())
            && this.restingRotation.equal(car.getRestingRotation())
            && this.wheels.equal(car.getWheels()));
    }

    addCar(car: Car): void {
        this.cars.push(car);
    }


}