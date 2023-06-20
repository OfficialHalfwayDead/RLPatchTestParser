import { userInfo } from "os";

export class Vector {
    private X: number;
    private Y: number;
    private Z: number;

    constructor(X: number, Y: number, Z: number) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }

    equal(v: Vector): boolean {
        return (this.X === v.X && this.Y === v.Y && this.Z === v.Z);
    }

    length(): number {
        return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }

    // Length squared
    length2(): number {
        return this.X * this.X + this.Y * this.Y + this.Z * this.Z;
    }

    getX(): number {
        return this.X;
    }

    getY(): number {
        return this.Y;
    }

    getZ(): number {
        return this.Z;
    }

    copy(): Vector {
        return new Vector(this.X, this.Y, this.Z);
    }

    scaledCopy(x: number): Vector {
        return new Vector(this.X * x, this.Y * x, this.Z * x);
    }

    rotatedCopy(q: Quaternion): Vector {
        const u = new Vector(q.getX(), q.getY(), q.getZ());
        const s = q.getW();

        const v1 = Vector.mult(u, 2 * Vector.dot(u, this));
        const v2 = Vector.mult(this, s * s - Vector.dot(u, u));
        const v3 = Vector.mult(Vector.cross(u, this), 2 * s);
        return Vector.add(v1, Vector.add(v2, v3));
    }

    toFixed(precision: number): string {
        return "Vector {\n  X: " + this.X.toFixed(precision)
            + ",\n  Y: " + this.Y.toFixed(precision)
            + ",\n  Z: " + this.Z.toFixed(precision) + " }";
    }

    static add(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.X + v2.X, v1.Y + v2.Y, v1.Z + v2.Z);
    }

    static subtract(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.X - v2.X, v1.Y - v2.Y, v1.Z - v2.Z);
    }

    static dot(v1: Vector, v2: Vector): number {
        return v1.X * v2.X + v1.Y * v2.Y + v1.Z * v2.Z;
    }

    static mult(v1: Vector, x: number): Vector {
        return new Vector(v1.X * x, v1.Y * x, v1.Z * x);
    }

    static cross(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.Y * v2.Z - v1.Z * v2.Y, v1.Z * v2.X - v1.X * v2.Z, v1.X * v2.Y - v1.Y * v2.X);
    }

    static fromStatMap(statName: string, map: Map<string, number>): Vector {
        let placeholder = map.get(statName + ".X");
        const x: number = (placeholder === undefined) ? 0 : placeholder;
        placeholder = map.get(statName + ".Y");
        const y: number = (placeholder === undefined) ? 0 : placeholder;
        placeholder = map.get(statName + ".Z");
        const z: number = (placeholder === undefined) ? 0 : placeholder;
        return new Vector(x, y, z);
    }
}

export class Quaternion {
    private X: number;
    private Y: number;
    private Z: number;
    private W: number;

    constructor(X: number, Y: number, Z: number, W: number) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        this.W = W;
    }

    equal(q: Quaternion): boolean {
        return (this.X === q.X && this.Y === q.Y && this.Z === q.Z && this.W === q.W);
    }

    getX(): number {
        return this.X;
    }

    getY(): number {
        return this.Y;
    }

    getZ(): number {
        return this.Z;
    }

    getW(): number {
        return this.W;
    }

    copy(): Quaternion {
        return new Quaternion(this.X, this.Y, this.Z, this.W);
    }

    invertedCopy(): Quaternion {
        return new Quaternion(-this.X, -this.Y, -this.Z, this.W);
    }

    toEulerAngle(): EulerAngle {
        // roll (x-axis rotation)
        const sinr_cosp = +2.0 * (this.W * this.X + this.Y * this.Z);
        const cosr_cosp = +1.0 - 2.0 * (this.X * this.X + this.Y * this.Y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);

        // pitch (y-axis rotation)
        const sinp = +2.0 * (this.W * this.Y - this.Z * this.X);
        if (Math.abs(sinp) >= 1)
            var pitch = Math.sign(sinp) * Math.PI / 2; // use 90 degrees if out of range
        else
            var pitch = Math.asin(sinp);

        // yaw (z-axis rotation)
        const siny_cosp = +2.0 * (this.W * this.Z + this.X * this.Y);
        const cosy_cosp = +1.0 - 2.0 * (this.Y * this.Y + this.Z * this.Z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);

        return new EulerAngle(yaw, pitch, roll);
    }

    static fromStatMap(statName: string, map: Map<string, number>): Quaternion {
        let placeholder = map.get(statName + ".X");
        const x: number = (placeholder === undefined) ? 0 : placeholder;
        placeholder = map.get(statName + ".Y");
        const y: number = (placeholder === undefined) ? 0 : placeholder;
        placeholder = map.get(statName + ".Z");
        const z: number = (placeholder === undefined) ? 0 : placeholder;
        placeholder = map.get(statName + ".W");
        const w: number = (placeholder === undefined) ? 0 : placeholder;
        return new Quaternion(x, y, z, w);
    }

}

export class EulerAngle {
    private yaw: number;
    private pitch: number;
    private roll: number;
    private degrees: boolean;

    constructor(yaw: number, pitch: number, roll: number, bDegrees: boolean = false) {
        this.yaw = yaw;
        this.pitch = pitch;
        this.roll = roll;
        this.degrees = false;
    }

    equal(r: EulerAngle): boolean {
        return (this.yaw === r.yaw && this.pitch === r.pitch && this.roll === r.roll);
    }

    getYaw(): number {
        return this.yaw;
    }

    getPitch(): number {
        return this.pitch;
    }

    getRoll(): number {
        return this.roll;
    }

    copy(): EulerAngle {
        return new EulerAngle(this.yaw, this.pitch, this.roll);
    }

    useDegrees(): EulerAngle {
        if (!this.degrees) {
            this.yaw = degrees(this.yaw);
            this.pitch = degrees(this.pitch);
            this.roll = degrees(this.roll);
            this.degrees = true;
        }
        return this;
    }

    useRadians(): EulerAngle {
        if (this.degrees) {
            this.yaw = radians(this.yaw);
            this.pitch = radians(this.pitch);
            this.roll = radians(this.roll);
            this.degrees = false;
        }
        return this;
    }

    toQuat(): Quaternion {
        let deg = false;
        if (this.degrees) {  // if angle currently in degrees, we need to transform to radians first
            deg = true;
            this.useRadians();
        }

        const cy = Math.cos(this.yaw * 0.5);
        const sy = Math.sin(this.yaw * 0.5);
        const cp = Math.cos(this.pitch * 0.5);
        const sp = Math.sin(this.pitch * 0.5);
        const cr = Math.cos(this.roll * 0.5);
        const sr = Math.sin(this.roll * 0.5);

        if (deg) this.useDegrees(); // return to degrees, if that was previous setting

        return new Quaternion(
            cy * cp * cr + sy * sp * sr,
            cy * cp * sr - sy * sp * cr,
            sy * cp * sr + cy * sp * cr,
            sy * cp * cr - cy * sp * sr);
    }

    toFixed(precision: number): string {
        return "Angle {\n  Yaw: " + this.yaw.toFixed(precision)
            + ",\n  Pitch: " + this.pitch.toFixed(precision)
            + ",\n  Roll: " + this.roll.toFixed(precision) + " }";
    }

}

export function degrees(x: number): number {
    return x * 180 / Math.PI;
}

export function radians(x: number): number {
    return x * Math.PI / 180;
}