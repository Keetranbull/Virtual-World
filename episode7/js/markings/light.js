class Light extends Marking {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, 20);

        this.state = "off";
        this.border = this.poly.segments[2];
    }

    draw(ctx) {
        const perp = perpVector(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        );

        const green = lerp2D(line.p1, line.p2, 0.20);
        const yellow = lerp2D(line.p1, line.p2, 0.50);
        const red = lerp2D(line.p1, line.p2, 0.80);

        new Segment(red, green).draw(ctx, {width: this.height, cap: "round"});

        green.draw(ctx, {size: this.height * 0.5, color: "#006600"});
        yellow.draw(ctx, {size: this.height * 0.5, color: "#666600"});
        red.draw(ctx, {size: this.height * 0.5, color: "#660000"});
        
        switch (this.state) {
            case "green":
                green.draw(ctx, {size: this.height * 0.5, color: "#00FF00"});
                break;
            case "yellow":
                yellow.draw(ctx, {size: this.height * 0.5, color: "#FFFF00"});
                break;
            case "red":
                red.draw(ctx, {size: this.height * 0.5, color: "#FF0000"});
                break;
        }
        
    }
}