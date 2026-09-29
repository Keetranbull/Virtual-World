class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;

        this.ctx =  this.canvas.getContext("2d");

        this.selected = null;
        this.hovered = null;
        this.mouse = null;

        this.dragging = false;
    

        this.#addEventListeners();
    }

    // use to add mouse input for the graph

    #addEventListeners() {

        //Event Listener for creating and selecting a point based on left mouse click down
        this.canvas.addEventListener("mousedown", this.#mouseDownHandler.bind(this));

        //Event Listener for visualising the editing of a point
        this.canvas.addEventListener("mousemove", this.#mouseMoveHandler.bind(this));

        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());

        this.canvas.addEventListener("mouseup", () => this.dragging = false);
    }

    #mouseDownHandler(evt){
        // right click
        if (evt.button == 2) {
            if (this.selected) {
                this.selected = null;
             } else {
                this.#removePoint(this.hovered);
            }
        }

        // left click
        if (evt.button == 0) {
            if (this.hovered){
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }

            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse;
        }
    }

    #mouseMoveHandler(evt){
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 25 * this.viewport.zoom);
        if (this.dragging == true) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #select(point){
        if(this.selected){
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }

        this.selected = point;
    }

    #removePoint(point){
        this.graph.removePoint(point);
        this.hovered = null;

        if (this.selected == point) {
            this.selected = null;
        }
    }

    removeAll(){
        this.graph.removeAll();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        this.graph.draw(this.ctx);
        
        if (this.selected){
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(ctx, { dash: [1, 2] })
            this.selected.draw(this.ctx, {outline: true})
        }

        if (this.hovered){
            this.hovered.draw(this.ctx, {fill: true})
        }
    }
}