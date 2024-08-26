var dialogue = ["The crime scene has nothing that relates to me.", //0
 "Phoenix Wright must have poisoned her during their meeting. The poison is fast acting, so she must have died right after.", //1
 "Or, he gave something to the victim with the poison on it. It can spread through the skin, after all.", //2
 "The witness is suspicious. She was sneaking into the victim's home, but has no relation to her.", //3
 "I'm locked up in prison. How can I even reach the victim or do anything on the outside?", //4
 "Maybe you believe the victim came here to visit me.", //5
 "What motive could I even have? Thalassa and I are unrelated. I hold no grudge against her.", //6
 "I'm not interested in celebrities, either. I didn't know the victim as anything else than a singer.", //7
 "Wright and his daughter are obvious suspects. Why would their crime turn out to be my own?", //8
 "The victim died while administering herself a morphine shot, which got poisoned with VX. It's a clear-cut case. I had no access to her medicine.", //9
 //breaking testimonies
 "...Why, yes, that does seem rather similar to my own.", //10
 "A five hour gap until death is indeed too long for a potent poison like VX.", //11
 "...I see. So the poison was ingested.", //12
 "Trucy Wright... was once Gramarye. Yes, she was Thalassa's daughter.", //13
 "I was indeed corresponding with Valant. Are you implying he may be an accomplice?", //14
 "Ah. The victim could not leave her home by herself. So she could not have come to visit me, correct?", //15
 "So Thalassa was in the first implementation of the Jurist System. I will never forgive that pathetic profanity to law.", //16
 "Thalassa was originally in the Gramarye Troupe... Well, it's hard to deny my ties to that stamp now, isn't it?", //17
 "So you believe I'm setting him up again? Third time's the charm, as they say?", //18
 "There lacks evidence to point at the syringe being the murder weapon, then.", //19
 "That's completely unrelated. Is there no thought inside that head of yours?" //20
]

const textboxEl = document.getElementById("click");
const spriteEl = document.getElementById("sprite");
const healthbarEl = document.getElementById("healthbar");
const testimonyEl = document.querySelector(".testimony");

const containerEl = document.getElementById("evidence-container");
const descriptionEl = document.getElementById("evidence-description");
const instructionsEl = document.getElementById("instructions");

const talkEl = document.querySelector("#talk");
const bgmEl = document.querySelector("#bgm");
const selectEl = document.querySelector("#select");
const correctEl = document.querySelector("#correct");
const damageEl = document.querySelector("#damage");
const breakdownEl = document.querySelector("#breakdown");
const gavelEl = document.querySelector("#gavel");

const soundEl = document.querySelector(".sound");
const soundIcon = document.querySelector(".sound > i");

const winloseEl = document.getElementById("winlose");
const wintextEl = document.getElementById("win-text");
const winsubtextEl = document.getElementById("win-subtext");

var index = 0;
var solved = 10;
var health = 5;
var talking = "t";

class evidence {
    constructor(id, description) {
        this.id = id;
        this.description = description;
    } 
}

class testimony {
    constructor(id) {
        this.id = id;
        this.dialogue = dialogue[id];
    }

    delete() {
        this.id = -1;
    }
}

let ev0 = new evidence(8, "Phoenix Wright's attorney badge. He was disbarred for seven years due to Kristoph setting him up.");
let ev1 = new evidence(2, "Thalassa Gramarye's autopsy report. Died from a direct ingestion of VX between 10:30PM to 11:00PM.");
let ev2 = new evidence(3, "The witness' locket, showing her mother, Thalassa.");
let ev3 = new evidence(5, "Thalassa's brooch. She lost it in an accident which caused her severe injuries. She was currently bedridden.");
let ev4 = new evidence(1, "Phoenix Wright's phone. He and the victim parted at 5:30PM. She then left him a voicemail at 6:00PM.");
let ev5 = new evidence(6, "Forged note. Kristoph was found guilty for forging and murder. Thalassa was in the jury for the trial.");
let ev6 = new evidence(9, "Syringe. Was used by victim for her chronic pains from her injuries. Contains only traces of morphine.");
let ev7 = new evidence(0, "Rare nail polish. The victim's bottle was found open and emptied by her side. Kristoph uses the same brand.");
let ev8 = new evidence(4, "Letter sent by Kristoph to Valant Gramarye. The contents are missing.");
let ev9 = new evidence(7, "Gramarye Troupe stamp, limited for fans. Was gifted by Kristoph. Shows the trio of Thalassa, Valant, Zak.");

let t0 = new testimony(0); let t1 = new testimony(1);
let t2 = new testimony(2); let t3 = new testimony(3);
let t4 = new testimony(4); let t5 = new testimony(5);
let t6 = new testimony(6); let t7 = new testimony(7);
let t8 = new testimony(8); let t9 = new testimony(9); 

var isPrinting = false;
var firstPlay = true;
var gameOver = false;
var activeEvidence = ev0;
var activeTestimony = t0;
const evidenceList = [ev0, ev1, ev2, ev3, ev4, ev5, ev6, ev7, ev8, ev9];
const testimonyList = [t0, t1, t2, t3, t4, t5, t6, t7, t8, t9];

function startGame() {
    updateHealth();
    printing(dialogue[index]);
    checkSprite();
}

startGame();
talkEl.volume = 0.2;
selectEl.volume = 0.2;
damageEl.volume = 0.2;
correctEl.volume = 0.2;
gavelEl.volume = 0.2;
breakdownEl.volume = 0.2;
bgmEl.volume = 0.4;

document.addEventListener("click", () => {
    if(firstPlay) {
        bgmEl.play();
        firstPlay = false;
    }
});

function checkSprite() {
    if(index === -2) {
        spriteEl.src = "assets/sprites/02" + talking + ".webp";
    }
    else if(index === -1) {
        spriteEl.src = "assets/sprites/hit2" + talking + ".webp";
    }
    else if(index < 3) {
        spriteEl.src = "assets/sprites/01" + talking + ".webp";
    }
    else if(index >= 3 && index < 7) {
        spriteEl.src = "assets/sprites/02" + talking + ".webp";
    }
    else if(index >= 7 && index < 10) {
        spriteEl.src = "assets/sprites/03" + talking + ".webp";
    }
    else if(index >= 10) {
        spriteEl.src = "assets/sprites/hit2" + talking + ".webp";
    }
}

textboxEl.addEventListener("click", ()=> {
    if(!isPrinting && !gameOver) {
        checkIndex();
        printing(dialogue[index]);
    }
});

soundEl.addEventListener("click", ()=> {
    if(bgmEl.paused) {
        talkEl.volume = 0.2;
        selectEl.volume = 0.2;
        damageEl.volume = 0.2;
        correctEl.volume = 0.2;
        gavelEl.volume = 0.2;
        breakdownEl.volume = 0.2;

        bgmEl.play();
        soundIcon.classList.remove("fa-volume-xmark");
        soundIcon.classList.add("fa-volume-loud");
    }
    else {
        talkEl.volume = 0;
        selectEl.volume = 0;
        damageEl.volume = 0;
        correctEl.volume = 0;
        gavelEl.volume = 0;
        breakdownEl.volume = 0;

        bgmEl.pause();
        soundIcon.classList.remove("fa-volume-loud");
        soundIcon.classList.add("fa-volume-xmark");
    }
})

evidenceList.forEach((item) => {
    const btnEl = document.createElement("button");
    btnEl.classList.add("evidence-button");
    btnEl.style.backgroundImage="URL(assets/evidence/"+item.id+".webp)";
    containerEl.appendChild(btnEl);
    btnEl.addEventListener("click", ()=>
    {
        descriptionEl.innerText = item.description;
        activeEvidence = item;
        selectEl.play();
    });
});

function showInstructions() {
    instructionsEl.style.visibility = "visible";
}

function hideInstructions() {
    instructionsEl.style.visibility = "hidden";
}

function presentEvidence() {
    if(!isPrinting && !gameOver) {
        if(activeTestimony.id === activeEvidence.id)
        correctEvidence();
        else
        incorrectEvidence();
    }
}

function checkIndex() {
    for(let i = activeTestimony.id; i <= testimonyList.length; i++) {
        if(i === activeTestimony.id) {
            continue;
        }
        if(i === testimonyList.length) {
            i = 0;
        }
        if(testimonyList[i].id == -1) {
            continue;
        }
        index = i;
        activeTestimony = testimonyList[index];
        break;
    }
}

function correctEvidence() {
    setTimeout(() => {
        if(!gameOver) {
            index += 10;
            printing(dialogue[index]);
            index = -1;
        }
    }, 1000);

    isPrinting = true;
    testimonyEl.innerText = "";
    spriteEl.src = "assets/sprites/hit1.webp";
    correctEl.play();
    activeTestimony.delete();
    solved--;

    if(solved === 0) {
        youWin();
    }
}

function incorrectEvidence() {
    setTimeout(() => {
        if(!gameOver) {
            health--;
            updateHealth();

            damageEl.play();
            index = -2;
            printing(dialogue[20]);
        }
    }, 2800);

    isPrinting = true;
    testimonyEl.innerText = "";
    spriteEl.src = "assets/sprites/miss.webp";
}

function printing(text) {
    talking = "t";
    checkSprite();
    testimonyEl.innerText = "";

    for(let i = 0; i < text.length; i++) {
        let char = text[i];
        setTimeout(() => {
            testimonyEl.append(char);
            isPrinting = true;
            talkEl.play();
        }, (22*i));
    }

    setTimeout(() => {
        isPrinting = false;
        talking = "i";
        checkSprite();
    }, (25*text.length));
}

function updateHealth() {
    healthbarEl.innerText = "";
    for(let i = 0; i < health; i++) {
        let life = document.createElement("i");
        life.classList.add("fa-gavel", "fa-solid", "life");
        healthbarEl.append(life);
    }

    if(health === 0) {
        youLose();
    }
}

function youWin() {
    setTimeout(() => {
        winloseEl.style.display = "flex";
        wintextEl.innerText = "You win!";
        winsubtextEl.innerText = "You finished the game with " + health + " lives remaining.";
    }, 2900);

    spriteEl.src = "assets/sprites/win.webp";
    gameOver = true;
    breakdownEl.play();
}

function youLose() {
    setTimeout(() => {
        winloseEl.style.display = "flex";
        wintextEl.innerText = "You lose!";
        winsubtextEl.innerText = "Better luck next time.";
        gavelEl.play();
    }, 1000)
    gameOver = true;
}