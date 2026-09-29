class World {
    constructor(graph, roadWidth = 100, roadRoundness = 15) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        this.envelopes = [];
        this.roadBorders = [];

        this.generate();
    }

    generate() {
        this.envelopes.length = 0;

        for (const segment of this.graph.segments){
            this.envelopes.push(
                new Envelope(segment, this.roadWidth, this.roadRoundness)
            );
        }

        this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
    }
    
    draw(ctx) {
        for (const env of this.envelopes){
            env.draw(ctx, { fill: "#858484", stroke: "#858484", lineWidth: 15});
        }

        for (const segment of this.graph.segments){
            segment.draw(ctx, { color: "yellow", Width: 8, dash: [20, 20] });
        }

        for (const segment of this.roadBorders){
            segment.draw(ctx, {color: "white", width: 4});
        }

    }
}