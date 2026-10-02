class MarkingEditor {
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world;
        this.targetSegments = targetSegments;

        this.canvas =  viewport.canvas;
        this.ctx =  this.canvas.getContext("2d");

        this.mouse = null;
        this.intent = null;

        this.markings = world.markings;
    }

    //to be overridden by subclasses
    createMarking(center, directionVector) {
        return center;
    }
    

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
    }

    // use to add mouse input for the graph

    #addEventListeners() {
        // turn the mouse down and mouse move handlers into bound functions 
        // so that they can be removed in the event listener
        this.boundMouseDownHandler = this.#mouseDownHandler.bind(this);
        this.boundMouseMoveHandler = this.#mouseMoveHandler.bind(this);
        this.boundContextMenu = (evt) => evt.preventDefault();

        //Event Listener for creating and selecting a point based on left mouse click down
        this.canvas.addEventListener("mousedown", this.boundMouseDownHandler);

        //Event Listener for visualising the editing of a point
            this.canvas.addEventListener("mousemove", this.boundMouseMoveHandler);

        this.canvas.addEventListener("contextmenu", this.boundContextMenu);

    }

    #removeEventListeners() {

        //Event Listener for creating and selecting a point based on left mouse click down
        this.canvas.removeEventListener("mousedown", this.boundMouseDownHandler);

        //Event Listener for visualising the editing of a point
        this.canvas.removeEventListener("mousemove", this.boundMouseMoveHandler);

        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);

    }

    #mouseMoveHandler(evt){
        this.mouse = this.viewport.getMouse(evt, true);
        const segment = getNearestSegment(this.mouse, 
            this.targetSegments, 25 * this.viewport.zoom);

        if (segment) {
            const projection = segment.projectPoint(this.mouse);

            if (projection.offset >= 0 && projection.offset <= 1) {
                this.intent = this.createMarking(projection.point, segment.directionVector());
            } else {
                this.intent = null;
            }
            
        } else {
            this.intent = null;
        }

    }

    #mouseDownHandler(evt){
        if (evt.button == 0) {
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }
        if (evt.button == 2) {
            for (let i = 0; i < this.markings.length; i++) {
                const poly = this.markings[i].poly;
                if (poly.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1);
                    return;
                }
            
            }
        }
    }

    display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }
}
    
