class World {
    constructor(graph, 
        roadWidth = 100, 
        roadRoundness = 15,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50,
        treeSize = 160
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = []
        this.trees = []

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
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();
    }
    #generateTrees(){
        const points = [
            ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
            ...this.buildings.map((b) => b.points).flat()
        ];

        const left = Math.min(...points.map((p) => p.x)) - (this.treeSize * 2);
        const right = Math.max(...points.map((p) => p.x)) + (this.treeSize * 2);
        
        const top = Math.min(...points.map((p) => p.y)) - (this.treeSize * 2);
        const bottom = Math.max(...points.map((p) => p.y)) + (this.treeSize * 2);  

        const illegalPolys = [
            ...this.buildings,
            ...this.envelopes.map((e) => e.poly)

        ]

        const trees = [];
        let tryCount = 0;
        while (tryCount < 30) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random())
            );
            // check for nearby roads or buildings
            let keep = true;

            // check for nearby roads or buildings
            for (const poly of illegalPolys){
                if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2){
                    keep = false;
                    break;
                }
            }

            if (keep){
                // check for nearby trees
                for (const tree of trees){
                   if (distance(tree, p) < this.treeSize){
                    keep = false;
                    break
                   } 
                }
            }

            // set distance for how far out trees can be 
            if (keep){
                let closeToSomething = false;
                for (const poly of illegalPolys){
                    if (poly.distanceToPoint(p) < this.treeSize * 2){
                        closeToSomething = true;
                    }
                }
                keep = closeToSomething;
            }

            if (keep){
                trees.push(p);
                tryCount = 0;
            }
            tryCount++

        }
        return trees;
    }

    #generateBuildings(){
        const tmpEnvelopes = [];
        for (const segment of this.graph.segments){
            tmpEnvelopes.push(
                new Envelope(
                    segment,
                    this.roadWidth + this.buildingWidth + this.spacing * 2,
                    this.roadRoundness
                )
            );
        }
        const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

        for (let i = 0; i < guides.length; i++){
            const segment = guides[i];
            if (segment.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = [];
        for (let segment of guides){
            const len = segment.length() + this.spacing;
            const buildingCount = Math.floor( len / (this.buildingMinLength + this.spacing));
            const buildingLength = len / buildingCount - this.spacing;

            const direction = segment.directionVector();

            let q1 = segment.p1;
            let q2 = add(q1, scale(direction, buildingLength));
            supports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++){
                q1 = add(q2, scale(direction, this.spacing));
                q2 = add(q1, scale(direction, buildingLength));

                supports.push(new Segment(q1, q2));
            }
        }
        const bases = [];

        for (const segment of supports){
            bases.push(new Envelope(segment, this.buildingWidth).poly)
        }
        const eps = 0.001;
        for (let i = 0; i < bases.length - 1; i++){
            for (let j = i + 1; j < bases.length; j++){
                if (bases[i].intersectsPoly(bases[j]) || bases[i].distanceToPoly(bases[j]) < this.spacing - eps){
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases;
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
        for (const bld of this.buildings){
            bld.draw(ctx);
        }
        for (const tree of this.trees){
            tree.draw(ctx, {size: this.treeSize, color: "rgba(0,0,0,0.5)"});
        }

    }
}