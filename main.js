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

const extraSmallPlatform5 = document
    .getElementById('extra-small-platform-5');


smallPlatform1.style.left = '800px';
smallPlatform1.style.top = '100px';

smallPlatform2.style.left = '1500px';
smallPlatform2.style.top = '200px';

smallPlatform3.style.left = '100px';
smallPlatform3.style.top = '300px';

smallPlatform4.style.left = '1400px';
smallPlatform4.style.top = '700px';

extraSmallPlatform1.style.left = '250px';
extraSmallPlatform1.style.top = '800px';

extraSmallPlatform2.style.left = '900px';
extraSmallPlatform2.style.top = '800px';

extraSmallPlatform3.style.left = '600px';
extraSmallPlatform3.style.top = '250px';

extraSmallPlatform4.style.left = '700px';
extraSmallPlatform4.style.top = '600px';

extraSmallPlatform5.style.left = '1300px';
extraSmallPlatform5.style.top = '500px';

const characterElm = document
    .querySelector('#character');

await new Promise((resolve) => {
    document.querySelector('#start-screen > button')
        .addEventListener('click', async()=> {
            await document.querySelector('html').requestFullscreen( {
                navigationUI: 'hide'
            });
            document.querySelector('#start-screen').remove();
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
let angle = 0;
let tmr4Jump;
let tmr4Run;
let tmr4InitialFall;        // Define the interval variable globally
let characterElmWidth = 65;

//Rendering Function
setInterval(() => {

    if (jump) {
        characterElm.style.backgroundImage = `url('/img/character/Jump__00${i++}.png')`;
        if (i === 10) i = 0;

    } else if (!run) {
        characterElm.style.backgroundImage = `url('/img/character/Idle__00${i++}.png')`;
        if (i === 10) i = 0;

    } else {
        characterElm.style.backgroundImage = `url('/img/character/Run__00${i++}.png')`;
        if (i === 10) i = 0;
    }

}, 1000 / 30);


const platforms = [
    mainPlatform, smallPlatform1, smallPlatform2, smallPlatform3, smallPlatform4, extraSmallPlatform1, extraSmallPlatform2, extraSmallPlatform3,
    extraSmallPlatform4, extraSmallPlatform5
];

//Initially Fall Down
function startInitialFall() {

    t = 0;  // Reset t variable for each new interval
    tmr4InitialFall = setInterval(() => {
        const top = characterElm.offsetTop + (t++ * 10);

        let onPlatform = false;

        for (const platform of platforms) {
            if (characterElm.offsetTop >= (platform.offsetTop - characterElm.offsetHeight)) {
                if (characterElm.offsetLeft + characterElmWidth >= platform.offsetLeft &&
                    characterElm.offsetLeft + characterElmWidth <= platform.offsetLeft + platform.offsetWidth) {
                    onPlatform = true;
                    break;
                }
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
                if (top >= platform.offsetTop - characterElm.offsetHeight)  {
                    if (characterElm.offsetLeft >= platform.offsetLeft - characterElmWidth &&
                        characterElm.offsetLeft <= platformEnd) {
                        // console.log(top);
                        // console.log(platform.offsetTop);
                        // console.log(characterElm.offsetHeight);
                        onPlatform = true;
                        break;
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
        console.log(characterPosition);

        for (const platform of platforms) {
            if (characterPosition === platform.offsetTop) {
                if (left + characterElmWidth >= platform.offsetLeft + platform.offsetWidth ||
                    left + characterElmWidth <= platform.offsetLeft) {
                    startInitialFall();
                }
            }else {
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

const resizeFn = () => {
    characterElm.style.top = `${innerHeight - 100 - characterElm.offsetHeight}px`;

    if (characterElm.offsetLeft < 0) {
        characterElm.style.left = '0';
    }else if(characterElm.style.left >= innerWidth) {
        characterElm.style.left = `${innerWidth - characterElmWidth - 1}px`;
    }
}

addEventListener('resize', resizeFn);







