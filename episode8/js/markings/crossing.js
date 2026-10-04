class Crossing extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.border = [this.poly.segments[0], this.poly.segments[2]];

        //added to distinguish between marking for loading
        this.type = "crossing";
    }

    draw(ctx) {
        const perp = perpVector(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        );
        line.draw(ctx, {width: this.height, color: "white", dash: [this.height / 5, this.height / 4]});
 
    }
}