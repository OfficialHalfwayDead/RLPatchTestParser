declare class Hitbox {
    private extent;
    private offset;
    constructor(extent: Vector, offset: Vector);
    copy(): Hitbox;
    getExtent(): Vector;
    getOffset(): Vector;
    getSize(): Vector;
}
declare class Wheel {
    private radius;
    private localOffset;
    private presetOffset;
    private restingSuspensionDistance;
    constructor(radius: number, localOffset: Vector, presetOffset: Vector, restingSuspensionDistance: number);
    copy(): Wheel;
    getRadius(): number;
    getOffset(): Vector;
    getRestingSuspensionDistance(): number;
}
declare class Wheels {
    private frontLeft;
    private frontRight;
    private backLeft;
    private backRight;
    constructor(frontLeft: Wheel, frontRight: Wheel, backLeft: Wheel, backRight: Wheel);
    copy(): Wheels;
}
declare class Car {
    private name;
    private hitbox;
    private restingVisualLocation;
    private restingRotation;
    private restingLocation;
    private wheels;
    constructor(name: string, hitbox: Hitbox, visualOffset: Vector, restingRotation: Quaternion, restingLocation: Vector, wheels: Wheels);
    getHitbox(): Hitbox;
    getName(): string;
    getVisualOffset(): Vector;
    getRestingLocation(): Vector;
    getRestingRotation(): Quaternion;
    getWheels(): Wheels;
    isOfPreset(preset: HitboxPreset): boolean;
}
declare class HitboxPreset {
    private hitbox;
    private restingRotation;
    private restingLocation;
    private wheels;
    private cars;
    constructor(car: Car);
}
