class Boid {
    constructor(x, y, maxSpeed = 5, color = "white", mass = 10, density = 1) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(1, 2));
        this.acceleration = createVector();

        this.maxSpeed = maxSpeed;
        this.maxForce = 0.5;
        this.perception_radius = 100;
        this.wanderAngle = 0;
        this.currentMarker = 0;

        this.mass = mass;
        this.density = density;
        this.radius = 3 * Math.sqrt(this.mass / this.density);

        this.color = color;
    }

    ignoreEdges(screenWidth, screenHeight) {
        if (this.position.x > screenWidth) this.position.x = 0;
        if (this.position.x < 0) this.position.x = screenWidth;
        if (this.position.y > screenHeight) this.position.y = 0;
        if (this.position.y < 0) this.position.y = screenHeight;
    }

    drawVector(start, vector, R = 255, G = 255, B = 255) {
        stroke(R, G, B);
        strokeWeight(1);
        line(start.x, start.y, start.x + vector.x, start.y + vector.y);
    }

    arriveAcceleration(target) {
        let vicinity = 100;
        let threshold = 0.1;
        let desire = p5.Vector.sub(target, this.position);

        let d = desire.mag();
        let factor = d < vicinity ? (d < threshold ? 0 : d / vicinity) : 1;
        desire.setMag(this.maxSpeed * factor);
        let followForce = p5.Vector.sub(desire, this.velocity);
        return followForce.div(this.mass);
    }

    arrive(target) {
        this.acceleration.add(this.arriveAcceleration(target));
    }

    seekAcceleration(target) {
        //target is a vector instance
        let desire = p5.Vector.sub(target, this.position);
        desire.setMag(this.maxSpeed);
        let seekForce = p5.Vector.sub(desire, this.velocity);
        return seekForce.div(this.mass);
    }

    seek(target) {
        //target is a p5 vector instance
        this.acceleration.add(this.seekAcceleration(target));
    }

    fleeAcceleration(monster) {
        //monster is a p5 vector instance
        let vicinity = 200;
        let repulse = p5.Vector.sub(this.position, monster);
        let d = repulse.mag();
        let factor = d < vicinity ? d / vicinity : 1;
        repulse.setMag(this.maxSpeed / (factor * 10));
        let fleeForce = p5.Vector.sub(repulse, this.velocity);
        return fleeForce.div(this.mass);
    }

    flee(monster) {
        //monster is a p5 vector instance
        this.acceleration.add(this.fleeAcceleration(monster));
    }

    wanderAcceleration() {
        //Change these const variables to change the wandering behaviours
        const CIRCLE_RADIUS = 10;
        const CIRCLE_DISTANCE = 50;
        const ANGLE_CHANGE = PI / 10;

        let toCenter = this.velocity.copy();
        toCenter.setMag(CIRCLE_DISTANCE);
        let nudgeVector = p5.Vector.fromAngle(this.wanderAngle, CIRCLE_RADIUS);
        this.wanderAngle += ANGLE_CHANGE * (Math.random() - 0.5);
        let wanderForce = p5.Vector.add(toCenter, nudgeVector);
        return wanderForce.div(this.mass);
    }

    wander() {
        this.acceleration.add(this.wanderAcceleration());
    }

    predictPosition(entity, predictionTime) {
        // s = s0 + vt
        let predictedChange = p5.Vector.mult(entity.velocity, predictionTime);
        return p5.Vector.add(entity.position, predictedChange);
    }

    pursueAcceleration(target) {
        let predictionTime =
            dist(
                this.position.x,
                this.position.y,
                target.position.x,
                target.position.y
            ) / this.maxSpeed;
        let predictedPosition = this.predictPosition(target, predictionTime);

        return this.seekAcceleration(predictedPosition);
    }

    pursue(target) {
        // Target is an object of boid instance
        this.acceleration.add(this.pursueAcceleration(target));
    }

    evadeAcceleration(enemy) {
        // Enemy is an object of boid instance
        let predictionTime =
            dist(
                this.position.x,
                this.position.y,
                enemy.position.x,
                enemy.position.y
            ) / this.maxSpeed;
        let predictedPosition = this.predictPosition(enemy, predictionTime);

        return this.fleeAcceleration(predictedPosition);
    }

    evade(enemy) {
        this.acceleration.add(this.evadeAcceleration(enemy));
    }

    align(nearby_boids) {
        let total = 0;
        let alignment = createVector();
        for (let boid of nearby_boids) {
            if (boid == this) {
                continue;
            }
            alignment.add(boid.velocity);
            total++;
        }
        if (total != 0) {
            alignment.div(total);
            alignment.setMag(this.maxSpeed);
            alignment.sub(this.velocity);
            alignment.limit(this.maxForce);
            alignment.div(this.mass);
        }
        return alignment;
    }

    cohere(nearby_boids) {
        let total = 0;
        let cohesion = createVector();
        for (let boid of nearby_boids) {
            if (boid == this) {
                continue;
            }

            cohesion.add(boid.position);
            total++;
        }
        if (total > 0) {
            cohesion.div(total);
            cohesion.sub(this.position); //cohesion is now the desired vector
            cohesion.setMag(this.maxSpeed);
            cohesion.sub(this.velocity); //cohesion is now the steering vector
            cohesion.limit(this.maxForce);
            cohesion.div(this.mass);
        }
        return cohesion;
    }

    seperate(nearby_boids) {
        let total = 0;
        let seperation = createVector();
        for (let boid of nearby_boids) {
            if (boid == this) {
                continue;
            }
            let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            let repulse = p5.Vector.sub(this.position, boid.position).div(distance * distance);
            seperation.add(repulse);
            total++;
        }

        if (total > 0) {
            seperation.div(total);
            seperation.setMag(this.maxSpeed);
            seperation.sub(this.velocity);
            seperation.limit(this.maxForce);
            seperation.div(this.mass);
        }
        return seperation;
    }

    flockWith(nearby_boids) {
        
        let alignment = this.align(nearby_boids);
        let cohesion = this.cohere(nearby_boids);
        let seperation = this.seperate(nearby_boids);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(seperation);
    }

    followPath(path) {
        //path is a Path object
        let n = path.markers.length;

        let targetMarker = path.markers[this.currentMarker];
        let d = p5.Vector.sub(targetMarker.position, this.position).mag(); //distance from boid to target

        //!the 0.8 here
        if (d < targetMarker.radius)
            this.currentMarker = (this.currentMarker + 1) % n;

        let target = targetMarker.position;
        this.seek(target);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show() {
        noStroke();
        push();
        {
            fill(this.color);
            translate(this.position.x, this.position.y);
            let angle = this.velocity.heading();
            rotate(angle);
            triangle(
                -this.radius,
                this.radius / 2,
                -this.radius,
                -this.radius / 2,
                this.radius,
                0
            );
        }
        pop();
    }

    show_with_color(color) {
        noStroke();
        push();
        {
            fill(color);
            translate(this.position.x, this.position.y);
            let angle = this.velocity.heading();
            rotate(angle);
            triangle(
                -this.radius,
                this.radius / 2,
                -this.radius,
                -this.radius / 2,
                this.radius,
                0
            );
        }
        pop();
    }
}
