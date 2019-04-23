"use strict";
class Vector {
    constructor(X, Y, Z) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }
    equal(v) {
        return (this.X === v.X && this.Y === v.Y && this.Z === v.Z);
    }
    length() {
        return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }
    length2() {
        return this.X * this.X + this.Y * this.Y + this.Z * this.Z;
    }
    getX() {
        return this.X;
    }
    getY() {
        return this.Y;
    }
    getZ() {
        return this.Z;
    }
    copy() {
        return new Vector(this.X, this.Y, this.Z);
    }
    scaledCopy(x) {
        return new Vector(this.X * x, this.Y * x, this.Z * x);
    }
    rotatedCopy(q) {
        const u = new Vector(q.getX(), q.getY(), q.getZ());
        const s = q.getW();
        const v1 = Vector.mult(u, 2 * Vector.dot(u, this));
        const v2 = Vector.mult(this, s * s - Vector.dot(u, u));
        const v3 = Vector.mult(Vector.cross(u, this), 2 * s);
        return Vector.add(v1, Vector.add(v2, v3));
    }
    static add(v1, v2) {
        return new Vector(v1.X + v2.X, v1.Y + v2.Y, v1.Z + v2.Z);
    }
    static subtract(v1, v2) {
        return new Vector(v1.X - v2.X, v1.Y - v2.Y, v1.Z - v2.Z);
    }
    static dot(v1, v2) {
        return v1.X * v2.X + v1.Y * v2.Y + v1.Z * v2.Z;
    }
    static mult(v1, x) {
        return new Vector(v1.X * x, v1.Y * x, v1.Z * x);
    }
    static cross(v1, v2) {
        return new Vector(v1.Y * v2.Z - v1.Z * v2.Y, v1.Z * v2.X - v1.X * v2.Z, v1.X * v2.Y - v1.Y * v2.X);
    }
}
class Quaternion {
    constructor(X, Y, Z, W) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        this.W = W;
    }
    equal(q) {
        return (this.X === q.X && this.Y === q.Y && this.Z === q.Z && this.W === q.W);
    }
    getX() {
        return this.X;
    }
    getY() {
        return this.Y;
    }
    getZ() {
        return this.Z;
    }
    getW() {
        return this.W;
    }
    copy() {
        return new Quaternion(this.X, this.Y, this.Z, this.W);
    }
    invertedCopy() {
        return new Quaternion(-this.X, -this.Y, -this.Z, this.W);
    }
    toEulerAngle() {
        const sinr_cosp = +2.0 * (this.W * this.X + this.Y * this.Z);
        const cosr_cosp = +1.0 - 2.0 * (this.X * this.X + this.Y * this.Y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);
        const sinp = +2.0 * (this.W * this.Y - this.Z * this.X);
        if (Math.abs(sinp) >= 1)
            var pitch = Math.sign(sinp) * Math.PI / 2;
        else
            var pitch = Math.asin(sinp);
        const siny_cosp = +2.0 * (this.W * this.Z + this.X * this.Y);
        const cosy_cosp = +1.0 - 2.0 * (this.Y * this.Y + this.Z * this.Z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);
        return new EulerAngle(yaw, pitch, roll);
    }
}
class EulerAngle {
    constructor(yaw, pitch, roll) {
        this.yaw = yaw;
        this.pitch = pitch;
        this.roll = roll;
    }
    equal(r) {
        return (this.yaw === r.yaw && this.pitch === r.pitch && this.roll === r.roll);
    }
    getYaw() {
        return this.yaw;
    }
    getPitch() {
        return this.pitch;
    }
    getRoll() {
        return this.roll;
    }
    copy() {
        return new EulerAngle(this.yaw, this.pitch, this.roll);
    }
    toQuat() {
        const cy = Math.cos(this.yaw * 0.5);
        const sy = Math.sin(this.yaw * 0.5);
        const cp = Math.cos(this.pitch * 0.5);
        const sp = Math.sin(this.pitch * 0.5);
        const cr = Math.cos(this.roll * 0.5);
        const sr = Math.sin(this.roll * 0.5);
        return new Quaternion(cy * cp * cr + sy * sp * sr, cy * cp * sr - sy * sp * cr, sy * cp * sr + cy * sp * cr, sy * cp * cr - cy * sp * sr);
    }
}
function degrees(x) {
    return x * 180 / Math.PI;
}
function radians(x) {
    return x * Math.PI / 180;
}
