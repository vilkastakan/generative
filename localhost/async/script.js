/**
 *  async, artwork
 *  @author вилка стакан
 *  @copyright 2021 vilka stakan
 *  yes, i'm using jquery in 2021
 */

const refreshRate = 1000 / 60;
const divTop = 10;
const messages = "ghbdtn ой то есть привет));а ты не разбираешься в js? есть вопрос;есть вопрос;есть время?;есть минутка?;есть минутка?;занят?;занят?;занят?;занят?;здравствуйте;здравствуйте;здравствуйте. можно вопрос?;здравствуйте. можно вопрос задать?;кинул на почту текст, посмотри, это срочно;можешь подсказать кое-что?;можешь подсказать кое-что?;можешь подсказать кое-что?;можешь подсказать кое-что?;можешь помочь кое с чем?;можно вопрос?;можно вопрос?;можно вопрос?;не знаешь кого-нибудь, кто разбирается в css?;недавно смотрел 1 охеренный видос. найду вновь – скину );пинг;пинг;пинг;пинг;пинг;привет;привет;привет;привет!;привет! есть одно дело;привет! есть одно дело;привет, поможешь?;привет, поможешь?;привет. есть одно дело;привет. тут? у меня проблема;ребят, у меня вопрос по html, кто разбирается, напишите в личку :);слушай;слушай, есть вопрос;тут?;тут?;тут?;ты здесь?;ты здесь?;ты здесь?;ты тут?;ты тут?;я уже ему написал пять минут назад, но он не ответил, может ты поможешь?;хочу спросить кое-что, можно?;хэй;хэй;хэй;хэй";

const shuffle = (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var width = window.innerWidth;
var height = window.innerHeight;
$("#world").css("width", width);
$("#world").css("height", height);
var myCanvas = document.getElementById('world');
var messagesList = shuffle(messages.split(";"));
var messageIndex = 0;
var bodiesList = [];

StartAudioContext(Tone.context, 'canvas').then(function() {
    console.log("started");
});


var synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        type: "fmsine",
        modulationType: "sine"
    },
    envelope: {
        attackCurve: "exponential",
        attack: 0.05,
        decay: 0.2,
        sustain: 0.2,
        release: 0.4,
    }
}).toMaster();
var notes = Tone.Frequency("E2").harmonize([0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17]);


var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

var engine = Engine.create();

var render = Render.create({
    canvas: myCanvas,
    engine: engine,
    options: {
        background: 'transparent',
        width: width,
        height: height,
        wireframes: false
    }
});

var ground = Bodies.rectangle(width / 2, height + 30, width, 60, {isStatic: true});
var leftWall = Bodies.rectangle(-10, height, 20, height * 2, {isStatic: true});
var rightWall = Bodies.rectangle(width + 10, height, 20, height * 2, {isStatic: true});
var ceiling = Bodies.rectangle(width / 2, -100, width, 200, {isStatic: true});
World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

Engine.run(engine);

// we need just bodies positions to place divs, not renderer
// Render.run(render);

window.setInterval(() => {
    for (var i = 0; i < bodiesList.length; i++) {
        var x = bodiesList[i].position.x;
        var y = bodiesList[i].position.y;
        const {
            min,
            max
        } = bodiesList[i].bounds;
        var w = parseInt($(".box").eq(i).css("width"));
        var h = parseInt($(".box").eq(i).css("height"));
        var angle = bodiesList[i].angle;

        $(".box").eq(i).css("left", x - w / 2);
        $(".box").eq(i).css("top", y - h / 2);
        $(".box").eq(i).css("transform", "rotate(" + angle + "rad)");
    }
}, refreshRate);

const restart = () => { location = location }

const addBlock = () => {
    var randNote = Math.floor(Math.random() * notes.length);
    synth.triggerAttackRelease(notes[randNote], "4m");

    var randWidth = Math.floor(Math.random() * 700) + (width / 2 - 350);
    var divLeft = randWidth;

    var div = $("<div />").addClass("box");
    div.css({
        left: divLeft,
        top: divTop
    });
    $("body").append(div);
    var index = $(".box").index(div);
    div.text(messagesList[messageIndex]);
    messageIndex++;
    var divWidth = parseInt(div.css("width"));
    var divHeight = parseInt(div.css("height"));
    var body = Bodies.rectangle(divLeft, divTop, divWidth, divHeight, {
        restitution: 0.8,
        label: $(".box").index(div)
    });
    bodiesList.push(body);
    World.add(engine.world, [body]);

    if (bodiesList.length < messagesList.length) {
        setTimeout(addBlock, 500);
    }
    else {
        setTimeout(restart, 13000);
    }
}

document.addEventListener('DOMContentLoaded', addBlock);