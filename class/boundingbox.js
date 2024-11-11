function distance_square(x1, y1, x2, y2) {
    dx = x1 - x2;
    dy = y1 - y2;
    return dx * dx + dy * dy;
}

class BoundingBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.half_w = width/2;
        this.half_h = height/2;
        this.center_x = x + width/2;
        this.center_y = y + height/2;
        this.area = width * height;
    }

    contains(point_x, point_y) {
        let horizontally_inside = this.x < point_x && point_x < this.x + this.width;
        let vertically_inside = this.y < point_y && point_y < this.y + this.height;
        return horizontally_inside && vertically_inside;

    }

    intersects_with_circle(circle_x, circle_y, circle_radius) {
        // if (this.contains(circle_x, circle_y)) return true;
        // if (this.contains(circle_x - circle_radius, circle_y)) return true;
        // if (this.contains(circle_x - circle_radius, circle_y - circle_radius)) return true;
        // if (this.contains(circle_x + circle_radius, circle_y)) return true;
        // if (this.contains(circle_x + circle_radius, circle_y + circle_radius)) return true;

        // if (distance_square(this.center_x, this.center_y, circle_x, circle_y) < circle_radius * circle_radius )return true;
        // if (distance_square(this.x, this.y, circle_x, circle_y) < circle_radius * circle_radius ) return true;
        // if (distance_square(this.x + this.width, this.y, circle_x, circle_y) < circle_radius * circle_radius ) return true;
        // if (distance_square(this.x, this.y + this.height, circle_x, circle_y) < circle_radius * circle_radius ) return true;
        // if (distance_square(this.x + this.width, this.y + this.height, circle_x, circle_y) < circle_radius * circle_radius ) return true;
        
        
        // return false;
        let closest_rect_x = max(this.x, min(circle_x, this.x + this.width));
        let closest_rect_y = max(this.y, min(circle_y, this.y + this.height));

        return (
          distance_square(circle_x, circle_y, closest_rect_x, closest_rect_y) <
          circle_radius * circle_radius
        );
        
    }

    show() {
        push();
        {
            noFill();
            if (this.area < 1000) {
                stroke(255, 100, 100);
            } else {
                stroke(255, 255, 255);
            }
            strokeWeight(1);
            rect(this.x, this.y, this.width, this.height);
        }
        pop();
    }
}

