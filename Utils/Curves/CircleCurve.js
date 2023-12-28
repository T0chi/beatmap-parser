const BaseCurve = require("./BaseCurve");

module.exports = class CircleCurve extends BaseCurve {
    constructor(startPos, points) {
        super(startPos, points);
    }

    // https://github.com/osbjs/osbjs/blob/master/src/Beatmap/Curves/CircleCurve.ts#L65
    generate() {
        if (this.points.length !== 2) {
            return this.generateLinear();
        }

        const data = [];
        let midPoint = this.points[0];

        let d = 2 *
            (this.startPos.x * (midPoint.y - this.endPos.y) +
                midPoint.x * (this.endPos.y - this.startPos.y) +
                this.endPos.x * (this.startPos.y - midPoint.y));
        if (d == 0) throw new Error('Invalid circle curve');

        let startLengthSqr = this.startPos.x * this.startPos.x + this.startPos.y * this.startPos.y,
            midLengthSqr = midPoint.x * midPoint.x + midPoint.y * midPoint.y,
            endLengthSqr = this.endPos.x * this.endPos.x + this.endPos.y * this.endPos.y;

        let center = {
            x:
                (startLengthSqr * (midPoint.y - this.endPos.y) +
                    midLengthSqr * (this.endPos.y - this.startPos.y) +
                    endLengthSqr * (this.startPos.y - midPoint.y)) /
                d,
            y:
                (startLengthSqr * (this.endPos.x - midPoint.x) +
                    midLengthSqr * (this.startPos.x - this.endPos.x) +
                    endLengthSqr * (midPoint.x - this.startPos.x)) /
                d,
        };

        let centerStart = {
            x: this.startPos.x - center.x,
            y: this.startPos.y - center.y,
        };

        let radius = Math.sqrt(centerStart.x * centerStart.x + centerStart.y * centerStart.y);

        let startAngle = Math.atan2(this.startPos.y - center.y, this.startPos.x - center.x);
        let midAngle = Math.atan2(midPoint.y - center.y, midPoint.x - center.x);
        let endAngle = Math.atan2(this.endPos.y - center.y, this.endPos.x - center.x);

        while (midAngle < startAngle) midAngle += 2 * Math.PI;
        while (endAngle < startAngle) endAngle += 2 * Math.PI;
        if (midAngle > endAngle) endAngle -= 2 * Math.PI;

        let length = Math.abs((endAngle - startAngle) * radius);
        let precision = length * 0.125;

        for (let i = 1; i < precision; i++) {
            let progress = i / precision;
            let angle = endAngle * progress + startAngle * (1 - progress);
            let position = { x: Math.cos(angle) * radius + center.x, y: Math.sin(angle) * radius + center.y };
            data.push(position);
        }
        data.push(this.endPos);

        return {
            type: "Perfect",
            values: data
        };
    }

    static isValid(startPos, midPoint, endPos) {
        return (
            startPos.x != midPoint.x &&
            startPos.y != midPoint.y &&
            midPoint.x != endPos.x &&
            midPoint.y != endPos.y &&
            2 * (startPos.x * (midPoint.y - endPos.y) + midPoint.x * (endPos.y - startPos.y) + endPos.x * (startPos.y - midPoint.y)) != 0
        )
    }
}