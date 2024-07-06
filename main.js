import './style.css'

const mainPlatform = document
    .getElementById('platform');

const smallPlatform1 = document
    .getElementById('small-platform-1');

const smallPlatform2 = document
    .getElementById('small-platform-2');

const smallPlatform3 = document
    .getElementById('small-platform-3');

const smallPlatform4 = document
    .getElementById('small-platform-4');

const extraSmallPlatform1 = document
    .getElementById('extra-small-platform-1');

const extraSmallPlatform2 = document
    .getElementById('extra-small-platform-2');

const extraSmallPlatform3 = document
    .getElementById('extra-small-platform-3');

const extraSmallPlatform4 = document
    .getElementById('extra-small-platform-4');

const box1 = document
    .getElementById('box1');

const box2 = document
    .getElementById('box2');

const box3 = document
    .getElementById('box3');

const box4 = document
    .getElementById('box4');

const box5 = document
    .getElementById('box5');

const bush1 = document
    .getElementById('bush1');

const deadBush = document
    .getElementById('dead-bush');

const sign = document
    .getElementById('sign');

const arrowSign = document
    .getElementById('arrow-sign');

const tree1 = document
    .getElementById('tree1');

const tree2 = document
    .getElementById('tree2');

const tombStone = document
    .getElementById('tomb-stone');

const tombStone2 = document
    .getElementById('tomb-stone2');

const tombStone3 = document
    .getElementById('tomb-stone3');

const bush2 = document
    .getElementById('bush2');


box1.style.top = '25px';
box1.style.left = '850px';

box2.style.top = '570px';
box2.style.left = '1600px';

box3.style.top = '460px';
box3.style.left = '770px';

box4.style.top = '690px';
box4.style.left = '380px';

box5.style.top = '895px';
box5.style.left = '1400px';

tree1.style.top = '760px';
tree1.style.left = '600px';

tree2.style.top = '760px';
tree2.style.left = '1600px';

bush1.style.top = '200px';
bush1.style.left = '200px';

deadBush.style.top = '390px';
deadBush.style.left = '1440px';

sign.style.top = '700px';
sign.style.left = '950px';

arrowSign.style.top = '200px';
arrowSign.style.left = '120px';

tombStone.style.top = '950px';
tombStone.style.left = '600px';

tombStone2.style.top = '925px';
tombStone2.style.left = '850px';

tombStone3.style.top = '950px';
tombStone3.style.left = '1800px';

bush2.style.top = '160px';
bush2.style.left = '1750px';

smallPlatform1.style.left = '800px';
smallPlatform1.style.top = '130px';

smallPlatform2.style.left = '1500px';
smallPlatform2.style.top = '220px';

smallPlatform3.style.left = '100px';
smallPlatform3.style.top = '290px';

smallPlatform4.style.left = '1400px';
smallPlatform4.style.top = '670px';

extraSmallPlatform1.style.left = '250px';
extraSmallPlatform1.style.top = '790px';

extraSmallPlatform2.style.left = '900px';
extraSmallPlatform2.style.top = '790px';

extraSmallPlatform3.style.left = '1300px';
extraSmallPlatform3.style.top = '460px';

extraSmallPlatform4.style.left = '700px';
extraSmallPlatform4.style.top = '560px';


const characterElm = document
    .querySelector('#character');

await new Promise((resolve) => {
    document.querySelector('#start-screen > button')
        .addEventListener('click', async()=> {
            await document.querySelector('html').requestFullscreen( {
                navigationUI: 'hide'
            });
            document.querySelector('#start-screen').classList.add('hide');
            resolve();
        });
});

await new Promise(function (resolve) {

    const images = ['/img/BG.png',
        '/img/tile/Tile (1).png',
        '/img/tile/Tile (2).png',
        '/img/tile/Tile (3).png',
        ...Array(10).fill('/img/character')
            .flatMap((v, i) => [
                `${v}/Jump__00${i}.png`,
                `${v}/Attack__00${i}.png`,
                `${v}/Idle__00${i}.png`,
                `${v}/Run__00${i}.png`
            ])
    ];
    for (const image of images) {
        const img = new Image();
        img.src = image;
        img.addEventListener('load', progress);
    }

    const barElm = document.getElementById('bar');
    const totalImages = images.length;

    function progress() {
        images.pop();
        barElm.style.width = `${100 / totalImages * (totalImages - images.length)}%`
        if (!images.length) {
            setTimeout(() => {
                document.getElementById('overlay').classList.add('hide');
                resolve();
            }, 1000);
        }
    }
});

let dx = 0;         //Run
let i = 0;          //Rendering
let t = 0;          // Initialize t variable
let run = false;
let jump = false;
let attack = false;
let angle = 0;
let tmr4Jump;
let tmr4Run;
let tmr4InitialFall;        // Define the interval variable globally
let characterElmWidth = 65;
let boxesLength = 5;

//Rendering Function
setInterval(() => {

    if (jump) {
        characterElm.style.width = '120px';
        characterElm.style.height = '120px';
        characterElm.style.backgroundImage = `url('/img/character/Jump__00${i++}.png')`;
        if (i === 10) i = 0;

    } else if (attack) {
            characterElm.style.backgroundImage = `url('/img/character/Attack__00${i++}.png')`;
            characterElm.style.width = '140px';
            characterElm.style.height = '140px';

        if (i === 10) {
            i = 0;
            attack = false;
            blastBox();
        }

    } else if (!run) {
        characterElm.style.width = '120px';
        characterElm.style.height = '120px';
        characterElm.style.backgroundImage = `url('/img/character/Idle__00${i++}.png')`;
        if (i === 10) i = 0;

    } else {
        characterElm.style.width = '120px';
        characterElm.style.height = '120px';
        characterElm.style.backgroundImage = `url('/img/character/Run__00${i++}.png')`;
        if (i === 10) i = 0;
    }

}, 60);


const platforms = [
    mainPlatform, smallPlatform1, smallPlatform2, smallPlatform3, smallPlatform4, extraSmallPlatform1, extraSmallPlatform2, extraSmallPlatform3,
    extraSmallPlatform4
];

const boxes = [
    box1,box2,box3,box4,box5
];

//Initially Fall Down
function startInitialFall() {

    t = 0;  // Reset t variable for each new interval
    tmr4InitialFall = setInterval(() => {
        const top = characterElm.offsetTop + (t++ * 10);

        let onPlatform = false;

        for (const platform of platforms) {

            const platformPosition = platform.offsetTop - characterElm.offsetHeight;

            if (characterElm.offsetTop >= platformPosition &&
                characterElm.offsetLeft + characterElmWidth >= platform.offsetLeft &&
                    characterElm.offsetLeft + characterElmWidth <= platform.offsetLeft + platform.offsetWidth) {
                    // characterElm.style.top = `${platformPosition}px`;
                    onPlatform = true;
                    break;
            }
        }
        if (onPlatform) {
            clearInterval(tmr4InitialFall);
        }else {
            characterElm.style.top = `${top}px`;
        }

    }, 30);
}
// Start the initial fall
startInitialFall();

//Jump
function doJump() {

    if (tmr4Jump) return;
    i = 0;
    jump = true;
    const initialTop = characterElm.offsetTop;

    tmr4Jump = setInterval(() => {
        const top = initialTop - (Math.sin(toRadians(angle++))) * 200;
        characterElm.style.top = `${top}px`;

        let onPlatform = false;

        if (angle >= 90) {

            for (const platform of platforms) {

                const platformEnd = platform.offsetLeft + platform.offsetWidth - characterElmWidth;
                const platformPosition = platform.offsetTop - characterElm.offsetHeight;

                if (characterElm.offsetLeft >= platform.offsetLeft - characterElmWidth &&
                    characterElm.offsetLeft <= platformEnd &&
                    top <= platformPosition + platform.offsetHeight &&
                    top >= platformPosition) {
                    characterElm.style.top = `${platformPosition}px`;
                    onPlatform = true;
                    break;

                }else if (angle <= 90) {

                    for (const platform of platforms) {

                        if (top <= platformPosition + platform.offsetHeight &&
                            characterElm.offsetLeft >= platform.offsetLeft + characterElmWidth &&
                            characterElm.offsetLeft <= platformEnd) {
                            angle = 90;
                            break;
                        }
                    }
                }
            }
        }

        if (onPlatform || angle === 181) {
            clearInterval(tmr4Jump);
            tmr4Jump = undefined;
            jump = false;
            angle = 0;
            i = 0;
        }

    }, 1);
}


//Utility Fn (degree to radiant)
function toRadians(angle) {
    return angle * Math.PI / 180;
}

//Run
function doRun(left) {
    if (tmr4Run) return;
    run = true;
    i = 0;
    if (left) {
        dx = -10;
        characterElm.classList.add('rotate');
    } else {
        dx = 10;
        characterElm.classList.remove('rotate');
    }

    tmr4Run = setInterval(() => {
        if (dx === 0) {
            clearInterval(tmr4Run);
            tmr4Run = undefined;
            run = false;
            i = 0;
            return;
        }
        const left = characterElm.offsetLeft + dx;
        const characterPosition = characterElm.offsetTop + characterElm.offsetHeight;

        for (const platform of platforms) {
            if (characterPosition === platform.offsetTop &&
                (left + characterElmWidth >= platform.offsetLeft + platform.offsetWidth ||
                    left <= platform.offsetLeft)) {
                    startInitialFall();
            }
        }

        if (left + characterElmWidth >= innerWidth ||
        left <= 0) {
            if (left <= 0) {
                characterElm.style.left = '0';
            } else {
                characterElm.style.left = `${innerWidth - characterElmWidth - 1}px`;
            }
            dx = 0;
            return;
        }
        characterElm.style.left = `${characterElm.offsetLeft + dx}px`;

    }, 20);
}

//Event Listeners
addEventListener('keydown', (e) => {
    switch (e.code) {
        case "ArrowLeft":
            case "ArrowRight":
            doRun(e.code === "ArrowLeft");
            break;
        case "Space":
            doJump();
    }
});

addEventListener('keyup', (e) => {
    switch (e.code) {
        case "ArrowLeft":
            case "ArrowRight":
            dx = 0;
    }
});

function doAttack(){
    attack = true;
}
document.addEventListener('click',  doAttack);

function blastBox(){
    for (const box of boxes) {
        if (box.offsetLeft <= characterElm.offsetLeft + characterElm.offsetWidth &&
            box.offsetLeft + box.offsetWidth >= characterElm.offsetLeft &&
            box.offsetTop - 40 <= characterElm.offsetTop &&
            box.offsetTop + box.offsetHeight + 20 >= characterElm.offsetTop + characterElm.offsetHeight) {

            box.classList.add('animate__animated', 'animate__fadeOut');

            box.addEventListener('animationend', () => {
                boxesLength = boxesLength - 1;
                box.remove();
            });
        }
    }
}

setInterval(() => {
    if (boxesLength === 0) {
        document.querySelector('#victory-screen').classList.remove('hide');
        document.removeEventListener('click', doAttack);

        document.querySelector('#victory-screen > button').addEventListener('click', () => {
            location.reload();
        });
    }
}, 1);

const resizeFn = () => {
    characterElm.style.top = `${innerHeight - 100 - characterElm.offsetHeight}px`;

    if (characterElm.offsetLeft < 0) {
        characterElm.style.left = '0';
    }else if(characterElm.style.left >= innerWidth) {
        characterElm.style.left = `${innerWidth - characterElmWidth - 1}px`;
    }
}
addEventListener('resize', resizeFn);







