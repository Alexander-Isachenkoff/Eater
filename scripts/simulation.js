class Simulation extends Game {
    constructor(width, heigth) {
        super();
        this.width = width;
        this.height = heigth;
        this.foodGenerationTimeOut = 1000;
        this.nextFoodTime = this.foodGenerationTimeOut;
        this.lastFoodTime = 0;
        this.foodList = new Set();
        this.bacteria = new Set();
        this.maxFoodQuantity = 100;
    }

    start(bacteriaQuantity, foodQuantity) {
        for (let i = 0; i < bacteriaQuantity; i++) {
            this.bacteria.add(this.generateRandomBacterium());
        }
        for (let i = 0; i < foodQuantity; i++) {
            this.generateRandomFood();
        }

        super.start();
    }

    update(timeFromLastFrame) {
        var nextFoodTime = this.lastFoodTime + this.foodGenerationTimeOut;
        while(nextFoodTime <= this.timePassedMills) {
            if (this.foodList.size < this.maxFoodQuantity) {
                this.generateRandomFood();
            }
            this.lastFoodTime = nextFoodTime;
            nextFoodTime += this.foodGenerationTimeOut;
        }

        var seconds = timeFromLastFrame / 1000;        
        this.bacteria.forEach(bacterium => bacterium.live(seconds, this.foodList, this.bacteria));
        
        var deadBacteria = Array.from(this.bacteria).filter(bacterium => !bacterium.isAlive);
        deadBacteria.forEach(bacterium => this.bacteria.delete(bacterium));

        var eatenFood = Array.from(this.foodList).filter(food => food.isEaten);
        eatenFood.forEach(food => this.foodList.delete(food));

        this.onUpdate();
    }

    generateRandomBacterium() {
        var bacterium = new Bacterium();
        bacterium.x = getRandomInRange(0, this.width);
        bacterium.y = getRandomInRange(0, this.height);
        bacterium.width = 24;
        bacterium.height = 24;
        bacterium.feedType = [PLANT, MEAT][getRandomInRange(0, 1)];
        return bacterium;
    }

    generateRandomFood() {
        this.foodIndex++;
        var food = new Food();
        food.x = getRandomInRange(0, this.width);
        food.y = getRandomInRange(0, this.height);
        food.type = [PLANT, MEAT][getRandomInRange(0, 1)];
        this.foodList.add(food);
    }
}
