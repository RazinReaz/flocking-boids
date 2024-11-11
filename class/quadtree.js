class QuadTree {

    constructor(boundingBox, capacity=4) {
        this.boundingBox = boundingBox;
        this.capacity=capacity;
        this.elems = [];
    }

    subdivide() {
        const x = this.boundingBox.x;
        const y = this.boundingBox.y;
        const w = this.boundingBox.width;
        const h = this.boundingBox.height;

        let half_w = w/2;
        let half_h = h/2;
        this.northwest = new QuadTree(new BoundingBox(x, y, half_w, half_h), 4);
        this.northeast = new QuadTree(new BoundingBox(x + half_w, y, half_w, half_h), 4);
        this.southwest = new QuadTree(new BoundingBox(x, y + half_h, half_w, half_h), 4);
        this.southeast = new QuadTree(new BoundingBox(x + half_w, y + half_h, half_w, half_h), 4);
    }

    insert(elem) {
        if (!this.boundingBox.contains(elem.position.x, elem.position.y)) {
            return false;
        }

        if (this.elems.length < this.capacity && !this.northwest) {
            this.elems.push(elem);
            return true;
        }

        if (!this.northwest) {
            this.subdivide();
        }

        if (this.northwest.insert(elem)) return true;
        if (this.northeast.insert(elem)) return true;
        if (this.southwest.insert(elem)) return true;
        if (this.southeast.insert(elem)) return true;
        // ! not sure where to put the 4 elements in this bounding box
        
        // this should never happen
        return false;
    }


    query(center_x, center_y, radius) {
        let elems_in_range = [];
        if (!this.boundingBox.intersects_with_circle(center_x, center_y, radius)) return elems_in_range;

        for (let elem of this.elems) {
            let d_2 = distance_square(center_x, center_y, elem.position.x, elem.position.y);
            if (d_2 < radius * radius) {
                elems_in_range.push(elem);
            }
        }
        if (!this.northwest) {
            return elems_in_range;
        }
        // query the children
        elems_in_range = elems_in_range.concat(this.northwest.query(center_x, center_y, radius));
        elems_in_range = elems_in_range.concat(this.northeast.query(center_x, center_y, radius));
        elems_in_range = elems_in_range.concat(this.southwest.query(center_x, center_y, radius));
        elems_in_range = elems_in_range.concat(this.southeast.query(center_x, center_y, radius));

        return elems_in_range;
    }

    show() {
        this.boundingBox.show();
        if (this.northwest) {
            this.northwest.show();
            this.northeast.show();
            this.southwest.show();
            this.southeast.show();
        }
    }

}