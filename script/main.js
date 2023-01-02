// DOM
const startButton = document.querySelector("#start");
const playerAddForm = document.querySelector(".player-add");
const runButton = document.querySelector("#run");
const validateButton = document.querySelector("#validate");
const resetButton = document.querySelector("#reset");

const body = document.querySelector("body");
const landingSection = document.querySelector(".landing");
const firstSection = document.querySelector(".first-section");
const secondSection = document.querySelector(".second-section");

const allPlayersDiv = document.querySelector(".all-players");
const chooseWinnerDiv = document.querySelector(".choose-winner");

const announceTitle = document.querySelector(".announce h2");

let remainingPlayers = new Array;

// Funtions
function addPlayer(name) {
    const div = document.createElement("div");
    div.className = "player";

    const button = document.createElement("button");
    button.textContent = "X";

    button.addEventListener("click", function(ev) {
        ev.preventDefault();
        updateStorage('del', name);
        allPlayersDiv.removeChild(div);
    });

    const p = document.createElement("p");
    p.textContent = name;

    div.append(button, p);

    allPlayersDiv.appendChild(div);
}

function showPlayer(name) {
    const div = document.createElement("div");
    div.className = "card";
    div.id = name;

    const h = document.createElement("h3");
    h.textContent = name;

    const img = document.createElement("img");
    img.src = "img/"+name+".jpg";

    div.append(h, img);

    div.addEventListener('click', function(ev) {
        ev.preventDefault();
        const allCards = chooseWinnerDiv.querySelectorAll(".card");
        allCards.forEach(c => {
            c.classList.remove("selected");
        })
        ev.currentTarget.classList.add("selected");
    });

    chooseWinnerDiv.appendChild(div);

}

function isNameExists(name) {
    const playersStorage = JSON.parse(localStorage.getItem("players"));
    return playersStorage.map(ps => ps[0]).some(p => p === name);
}

function updateStorage(action, name) {
    let playersStorage = JSON.parse(localStorage.getItem("players"));
    if (action === "add") {
        playersStorage.push([name, 0]);
    } else if (action === "del") {
        playersStorage = playersStorage.filter(p => p[0] !== name);
    } else if (action === "vote") {
        playersStorage.forEach((ps, i) => {
            if (ps[0] === name) {
                playersStorage[i] = [ps[0], ps[1]+1];
            }
        })
    } else if (action === "reset") {
        playersStorage = [];
    }
    localStorage.setItem("players", JSON.stringify(playersStorage));
}

function nextVote() {
    if (remainingPlayers.length > 0) {
        chooseWinnerDiv.innerHTML = "";
        announceTitle.textContent = "C'est au tour de "+remainingPlayers[0]+" de voter !";
        const candidates = JSON.parse(localStorage.getItem("players")).map(ps => ps[0]).filter(p => p !== remainingPlayers[0]);
        candidates.forEach(c => {
            showPlayer(c);
        });
    } else {
        secondSection.style.display = "none";
        displayResults();
    }
}

function displayResults() {
    let playersStorage = JSON.parse(localStorage.getItem("players"));
    const classement = playersStorage.sort((a,b) => b[1] - a[1]).map(ps => ps[0]);
    
    setTimeout(() => {
        const third = classement[2];
        document.querySelector(".third").dataset.content = third;
        document.querySelector("#img3").src = "img/"+third+".jpg";
    }, 3000);

    setTimeout(() => {
        const second = classement[1];
        document.querySelector(".second").dataset.content = second;
        document.querySelector("#img2").src = "img/"+second+".jpg";
    }, 6000);

    setTimeout(() => {
        const first = classement[0];
        document.querySelector(".first").dataset.content = first;
        document.querySelector("#img1").src = "img/"+first+".jpg";

        body.classList.add("pyro");
    }, 9000);
}

// Events 
startButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    landingSection.style.display = "none";
});

playerAddForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = ev.target.name.value;
    if (!isNameExists(name)) {
        addPlayer(name);
        updateStorage("add", name);
        ev.target.name.value = "";
    } else {
        alert("Ce nom existe déjà !");
    }
});

runButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    remainingPlayers = JSON.parse(localStorage.getItem("players")).map(ps => ps[0]);
    if (remainingPlayers.length > 2) {
        firstSection.style.display = "none";
        nextVote();
    } else {
        alert("Vous n'avez pas indiqué assez de joueurs (min: 3)");
    }
});

validateButton.addEventListener('click', () => {
    remainingPlayers = remainingPlayers.slice(1);
    const selected = chooseWinnerDiv.querySelector(".selected");
    if (selected === null) {
        alert("Vous n'avez pas sélectionné de participant !")
    } else {
        updateStorage("vote", selected.id);
        nextVote();
    }
});

resetButton.addEventListener('click', () => {
    landingSection.style.display = 'flex';
    firstSection.style.display = 'flex';
    secondSection.style.display = 'flex';
    allPlayersDiv.innerHTML = "";
    updateStorage('reset', "");
    body.classList.remove("pyro");
    document.querySelector(".first").dataset.content = "";
    document.querySelector("#img1").src = "img/pull.svg";
    document.querySelector(".second").dataset.content = "";
    document.querySelector("#img2").src = "img/pull.svg";
    document.querySelector(".third").dataset.content = "";
    document.querySelector("#img3").src = "img/pull.svg";
})

// Local Storage
const playersStorage = localStorage.getItem("players");

// On start
if (playersStorage !== null) {
    const players = JSON.parse(playersStorage).map(ps => ps[0])
    players.forEach(p => addPlayer(p));
} else {
    localStorage.setItem("players", JSON.stringify([]));
}
