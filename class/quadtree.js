class QuadTree {

    constructor(boundingBox, capacity=4) {
        this.boundingBox = boundingBox;
        this.capacity=capacity;
        this.elems = [];
    }

    insert(elem) {
        if (!this.boundingBox.contains(elems.position)) {
            return false;
        }

        if (this.elems.length < this.capacity) {
            this.elems.push(elem);
            return true;
        }

        const {x, y, w, h} = this.boundingBox;
        let half_w = w/2;
        let half_h = h/2;
        this.northwest = new QuadTree(BoundingBox(x, y, half_w, half_h), 4);
        this.northeast = new QuadTree(BoundingBox(x + half_w, y, half_w, half_h), 4);
        this.southwest = new QuadTree(BoundingBox(x, y + half_h, half_w, half_h), 4);
        this.southeast = new QuadTree(BoundingBox(x + half_w, y + half_h, half_w, half_h), 4);

        if (this.northwest.insert(elem)) return true;
        if (this.northeast.insert(elem)) return true;
        if (this.southwest.insert(elem)) return true;
        if (this.southeast.insert(elem)) return true;

        // for (let i = 0; i < this.elems.length; i++) {
        //     if (this.northwest.insert(this.elems[i])) return true;
        //     if (this.northeast.insert(this.elems[i])) return true;
        //     if (this.southwest.insert(this.elems[i])) return true;
        //     if (this.southeast.insert(this.elems[i])) return true;
        // }
        
        //this should never happen
        return false;
    }

    query(center_x, center_y, radius) {
        elems_in_range = [];
        if (!this.boundingBox.intersects_with_circle(center_x, center_y, radius)) return elems_in_range;

        for (elem of this.elems) {
            if (distance_square(center_x, center_y, elem.position.x, elem.position.y) < radius * radius) {
                elems_in_range.push(elem);
            }
        }
        if (!this.northwest) return elems_in_range;

        elems_in_range.push(this.northwest.query(center_x, center_y, radius));
        elems_in_range.push(this.northeast.query(center_x, center_y, radius));
        elems_in_range.push(this.southwest.query(center_x, center_y, radius));
        elems_in_range.push(this.southeast.query(center_x, center_y, radius));

        return elems_in_range;
    }

}