class Tree {

    // this is used to create a 3d object of a tree
    // however using libaries to create these object 
    // would be better and more effectent to learn about in the future

    constructor(center, size, height = 200){
        this.center = center;
        this.size = size;
        this.height = height
        this.base = this.#generateLayer(center, size);
    }

    #generateLayer(point, size){
        const points = [];
        const radius = size / 2;
        for(let a = 0; a< Math.PI * 2; a += Math.PI / 16){
            const kindOfRandom = Math.cos(((a + this.center.x) * size ) % 17) ** 2;
            const noiseRadius = radius * lerp(0.8, 1, kindOfRandom);
            points.push(translate(point, a, noiseRadius)) ;
        }
        return new Polygon(points);
    }

    draw(ctx, viewPoint){
        this.base.draw(ctx, { fill: "black", stroke: "rgba(19, 19, 19, 0.31)", lineWidth: 15});
        
        const top = getFake3DPoint(this.center, viewPoint, this.height);

        const layerCount = 7;
        for(let layer = 0; layer < layerCount; layer++){
            const t = layer / (layerCount - 1)
            const point = lerp2D(this.center, top, t);
            const color = "rgb(40," + lerp(50, 200, t) + ",70)";
            const size = lerp(this.size, 50, t);

            const poly = this.#generateLayer(point, size);

            poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0)" });
        }
    }
}