"use strict";
class Hitbox {
    constructor(extent, offset) {
        this.extent = extent.copy();
        this.offset = offset.copy();
    }
    copy() {
        return new Hitbox(this.extent, this.offset);
    }
    equal(other) {
        return (this.extent.equal(other.extent) && this.offset.equal(other.offset));
    }
    getExtent() {
        return this.extent.copy();
    }
    getOffset() {
        return this.offset.copy();
    }
    getSize() {
        return this.extent.scaledCopy(2);
    }
}
class Wheel {
    constructor(radius, localOffset, presetOffset, restingSuspensionDistance) {
        this.radius = radius;
        this.localOffset = localOffset.copy();
        this.presetOffset = presetOffset.copy();
        this.restingSuspensionDistance = restingSuspensionDistance;
    }
    copy() {
        return new Wheel(this.radius, this.localOffset, this.presetOffset, this.restingSuspensionDistance);
    }
    equal(other) {
        return (this.radius === other.radius
            && this.getOffset().equal(other.getOffset())
            && this.restingSuspensionDistance === other.restingSuspensionDistance);
    }
    getRadius() {
        return this.radius;
    }
    getOffset() {
        return (this.presetOffset.length2() < 0.0001) ? this.localOffset.copy() : this.presetOffset.copy();
    }
    getRestingSuspensionDistance() {
        return this.restingSuspensionDistance;
    }
}
class Wheels {
    constructor(frontLeft, frontRight, backLeft, backRight) {
        this.frontLeft = frontLeft.copy();
        this.frontRight = frontRight.copy();
        this.backLeft = backLeft.copy();
        this.backRight = backRight.copy();
    }
    copy() {
        return new Wheels(this.frontLeft, this.frontRight, this.backLeft, this.backRight);
    }
    equal(other) {
        return (this.frontLeft.equal(other.frontLeft)
            && this.frontRight.equal(other.frontRight)
            && this.backLeft.equal(other.backLeft)
            && this.backRight.equal(other.backRight));
    }
}
class Car {
    constructor(name, hitbox, visualOffset, restingRotation, restingLocation, wheels) {
        this.name = name;
        this.hitbox = hitbox.copy();
        this.restingVisualLocation = visualOffset.copy();
        this.restingRotation = restingRotation.copy();
        this.restingLocation = restingLocation.copy();
        this.wheels = wheels.copy();
    }
    getHitbox() {
        return this.hitbox.copy();
    }
    getName() {
        return this.name;
    }
    getVisualOffset() {
        let unadjustedOffset = Vector.subtract(this.restingVisualLocation, this.restingLocation);
        const rotation = this.restingRotation.invertedCopy();
        return unadjustedOffset.rotatedCopy(rotation);
    }
    getRestingLocation() {
        return this.restingLocation.copy();
    }
    getRestingRotation() {
        return this.restingRotation.copy();
    }
    getWheels() {
        return this.wheels.copy();
    }
    isOfPreset(preset) {
        return preset.doesCarMatch(this);
    }
}
class HitboxPreset {
    constructor(car) {
        this.cars = new Array();
        this.cars.push(car);
        this.hitbox = car.getHitbox();
        this.restingLocation = car.getRestingLocation();
        this.restingRotation = car.getRestingRotation();
        this.wheels = car.getWheels();
    }
    doesCarMatch(car) {
        return (this.hitbox.equal(car.getHitbox())
            && this.restingLocation.equal(car.getRestingLocation())
            && this.restingRotation.equal(car.getRestingRotation())
            && this.wheels.equal(car.getWheels()));
    }
    addCar(car) {
        this.cars.push(car);
    }
}
