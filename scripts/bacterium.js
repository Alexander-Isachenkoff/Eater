let Bacterium = class {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 70;
        this.height = 70;
        this.speed = 100;
        this.angle = 0;
        this.rotationSpeed = 120;
        this.energy = 100;
        this.isAlive = true;
        this.feedType = PLANT;
    }

    findObjective(foodList, bacteria) {
        let typeFood = Array.from(foodList).filter(food => food.type == this.feedType);
        let availableFood = typeFood.filter(
            food => Array.from(bacteria).every(bacterium =>
                bacterium == this ||
                food != bacterium.objective ||
                bacterium.calcDistanceTo(food.x, food.y) > this.calcDistanceTo(food.x, food.y)));

        // var nearestFood;
        // var minDistance = -1;
        // for (let i = 0; i < availableFood.length; i++) {
        //     var food = availableFood[i];
        //     var distance = this.calcDistanceTo(food.x, food.y);
        //     if (distance < minDistance || minDistance < 0) {
        //         minDistance = distance;
        //         nearestFood = food;
        //     }
        // }
        this.objective = this.findMinTimeObjective(availableFood);
    }

    findMinTimeObjective(foodList) {
        var minTime = -1;
        var nearestFood;
        foodList.forEach(food => {
            var angleDifference = Math.abs(this.getAngleTo(food.x, food.y) - this.angle);
            var time = this.calcDistanceTo(food.x, food.y) / this.speed + angleDifference / this.rotationSpeed;
            if (time < minTime || minTime == -1) {
                minTime = time;
                nearestFood = food;
            }
        });
        return nearestFood;
    }

    calcDistanceTo(x, y) {
        return calcDistance(this.x, this.y, x, y);
    }

    getAngleToObjective() {
        return this.getAngleTo(this.objective.x, this.objective.y);
    }

    getAngleTo(x, y) {
        var h = x - this.x;
        var v = y - this.y;
        var angle = Math.atan2(h, v) * 180 / Math.PI;
        while(angle - this.angle < -180) {
            angle += 360;
        }
        while(angle - this.angle > 180) {
            angle -= 360;
        }
        return angle;
    } 

    copy() {
        var bacterium = new Bacterium();
        bacterium.x = this.x;
        bacterium.y = this.y;
        bacterium.angle = this.angle;
        bacterium.feedType = this.feedType;
        return bacterium;
    }

    rotate(seconds) {
        if (this.objective == undefined) {
            return;
        }
        var requiredAngle = this.getAngleToObjective();
        if (this.angle < requiredAngle) {
            this.angle += this.rotationSpeed * seconds;
            if (this.angle > requiredAngle) {
                this.angle = requiredAngle;
            }
        } else if (this.angle > requiredAngle) {
            this.angle -= this.rotationSpeed * seconds;
            if (this.angle < requiredAngle) {
                this.angle = requiredAngle;
            }
        }
    }

    move(seconds) {
        if (this.objective == undefined) {
            return;
        }
        var angleDifference = Math.abs(this.getAngleToObjective() - this.angle);
        var speedCoefficient = Math.cos(angleDifference / 180 * Math.PI);
        var currentSpeed = (speedCoefficient > 0) ? (speedCoefficient * this.speed) : 0;
        var dx = Math.sin(this.angle / 180 * Math.PI) * currentSpeed * seconds;
        var dy = Math.cos(this.angle / 180 * Math.PI) * currentSpeed * seconds;

        this.x += dx;
        this.y += dy;
    }

    wasteEnergy(seconds) {
        this.energy -= 5 * seconds;
        if (this.energy <= 0) {
            this.isAlive = false;
        }
    }

    tryToGiveOffspring(bacteria) {
        if (this.energy >= 180 && this.width >= 50) {
            this.energy = 100;
            var offspring = this.copy();
            offspring.width = 24;
            offspring.height = 24;
            bacteria.add(offspring);
        }
    }

    tryToEat() {
        if (this.objective != undefined) {
            if (this.calcDistanceTo(this.objective.x, this.objective.y) <= 10) {
                this.objective.isEaten = true;
                this.energy += 10;
            }
        }
    }

    grow(seconds) {
        if (this.energy > 100 && this.width < 100) {
            this.width += 1 * seconds;
            this.height += 1 * seconds;
        }
    }

    live(seconds, foodList, bacteria) {
        this.wasteEnergy(seconds);
        this.grow(seconds);
        this.findObjective(foodList, bacteria);        
        this.rotate(seconds);
        this.move(seconds);
        this.tryToEat();
        this.tryToGiveOffspring(bacteria);        
    }
}
