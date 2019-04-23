declare class Vector {
    private X;
    private Y;
    private Z;
    constructor(X: number, Y: number, Z: number);
    equal(v: Vector): boolean;
    length(): number;
    length2(): number;
    getX(): number;
    getY(): number;
    getZ(): number;
    copy(): Vector;
    scaledCopy(x: number): Vector;
    rotatedCopy(q: Quaternion): Vector;
    static add(v1: Vector, v2: Vector): Vector;
    static subtract(v1: Vector, v2: Vector): Vector;
    static dot(v1: Vector, v2: Vector): number;
    static mult(v1: Vector, x: number): Vector;
    static cross(v1: Vector, v2: Vector): Vector;
}
declare class Quaternion {
    private X;
    private Y;
    private Z;
    private W;
    constructor(X: number, Y: number, Z: number, W: number);
    equal(q: Quaternion): boolean;
    getX(): number;
    getY(): number;
    getZ(): number;
    getW(): number;
    copy(): Quaternion;
    invertedCopy(): Quaternion;
    toEulerAngle(): EulerAngle;
}
declare class EulerAngle {
    private yaw;
    private pitch;
    private roll;
    constructor(yaw: number, pitch: number, roll: number);
    equal(r: EulerAngle): boolean;
    getYaw(): number;
    getPitch(): number;
    getRoll(): number;
    copy(): EulerAngle;
    toQuat(): Quaternion;
}
declare function degrees(x: number): number;
declare function radians(x: number): number;
