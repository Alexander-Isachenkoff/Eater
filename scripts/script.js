function $(id) {
    return document.getElementById(id);
}

var gameField = $('game-field');
var context = gameField.getContext('2d');
var simulation;
var showPaths = false;
var showEnergy = true;

onload = function () {
    restart();
};

function repaint() {
    context.clearRect(0, 0, gameField.width, gameField.height);

    if (showPaths) {
        simulation.bacteria.forEach(drawPath);
    }
    simulation.foodList.forEach(drawFood);
    simulation.bacteria.forEach(drawBacterium);
    if (showEnergy) {
        simulation.bacteria.forEach(drawEnergyBar);
    }

    $('bacteria-quantity').textContent = 'Количество бактерий: ' + simulation.bacteria.size;
    $('food-quantity').textContent = 'Количество еды: ' + simulation.foodList.size;
    $('time-passed').textContent = "Времени прошло: " + formatMilliseconds(simulation.timePassedMills);
    $('time-passed-accurate').textContent = "Времени прошло (точно): " + formatMilliseconds(simulation.timePassed);
    $('food-label').textContent = Math.round(1 / (simulation.foodGenerationTimeOut / 1000) * 100) / 100 + ' еды/сек.';

    if (simulation.bacteria.size == 0) {
        var answer = confirm('Все бактерии погибли! Начать заново?');
        if (answer) {
            restart();
        } else {
            simulation.stop();
        }
    }
}

function restart() {
    if (simulation != undefined) {
        simulation.stop();
    }
    simulation = new Simulation(960, 640);
    simulation.onUpdate = repaint;
    simulation.start(5, 20);
    updateFoodTimeOut();
    checkShowPaths();
}

function drawBacterium(bacterium) {
    var img = new Image();
    if (bacterium.feedType == PLANT) {
        img.src = "resources/bacterium_plant.svg";
    }
    if (bacterium.feedType == MEAT) {
        img.src = "resources/bacterium_meat.svg";
    }
    drawRotated(img, bacterium.x, bacterium.y, bacterium.width, bacterium.height, bacterium.angle);
}

function drawPath(bacterium) {
    if (bacterium.objective != undefined) {
        context.beginPath();
        context.moveTo(bacterium.objective.x, bacterium.objective.y);
        context.lineTo(bacterium.x, bacterium.y);
        context.closePath();
        context.strokeStyle = "lightgray";
        context.stroke();
    }
}

function drawEnergyBar(bacterium) {
    var barWidth = 8;
    var barHeight = 32;
    var fillHeight = bacterium.energy / 200 * barHeight; // 200 - max energy

    var x = bacterium.x - bacterium.width / 2 - barWidth - 2;

    context.beginPath();
    context.rect(x, bacterium.y - barHeight / 2, barWidth, barHeight);
    context.closePath();
    context.fillStyle = "white";
    context.fill();

    context.beginPath();
    context.rect(x, bacterium.y + barHeight / 2 - fillHeight, barWidth, fillHeight);
    context.closePath();
    var h = bacterium.energy / 200 * 120;
    var s = 100;
    var l = 50;
    context.fillStyle = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    console.log(context.fillStyle);
    context.fill();

    context.beginPath();
    context.rect(x, bacterium.y - barHeight / 2, barWidth, barHeight);
    context.closePath();
    context.strokeStyle = "black";
    context.stroke();
}

function drawFood(food) {
    var fill;
    if (food.type == PLANT) {
        fill = 'lawngreen';
    }
    if (food.type == MEAT) {
        fill = 'salmon';
    }
    drawEllipse(context, [food.x, food.y], [food.width/2, food.height/2], 45/180*Math.PI, 'gray', fill);
}

function drawRotated(image, x, y, width, height, degrees) {
    context.save();
    context.translate(x, y);
    context.rotate((-degrees + 180) * Math.PI / 180);
    context.drawImage(image, -width / 2, -width / 2, width, height);
    context.restore();
}

function drawEllipse(ctx, coords, sizes, angle, stroke, fill) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(coords[0], coords[1]);
    ctx.rotate(angle);
    ctx.scale(1, sizes[1]/sizes[0]);
    ctx.arc(0, 0, sizes[0], 0, Math.PI*2);
    ctx.restore();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.closePath();
}

function formatMilliseconds(milliseconds) {
    var hours = Math.floor(milliseconds / (1000 * 60 * 60));
    milliseconds -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(milliseconds / (1000 * 60));
    milliseconds -= minutes * 1000 * 60;
    var seconds = Math.floor(milliseconds / 1000);
    milliseconds -= seconds * 1000;
    var formatedString = hours + 'ч. ' + minutes + 'мин. ' + seconds + 'с. ' + milliseconds + 'мс.';
    return formatedString;
}

function checkShowPaths() {
    showPaths = $('show-paths-chb').checked;
    repaint();
}

function checkShowEnergy() {
    showEnergy = $('show-energy-chb').checked;
    repaint();
}

function checkPause() {
    var checkbox = $('pause');
    simulation.paused = checkbox.checked;
}

function updateFoodTimeOut() {
    var timeOut = 1000 / $('food-trackbar').value;
    simulation.foodGenerationTimeOut = timeOut;
}
