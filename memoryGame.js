const grid = document.getElementById('grid');
const score = document.getElementById('score');
const timer = document.getElementById('timer');
const newGameBtn = document.getElementById('newGame');
const gameLvl = document.getElementById('gameLvl')
const gamesHistory = document.getElementById('gamesHistory')
let selectedCards = []
const figures = ["😀", "😅", "😍", "🤠", "😛", "😽", "🥰", "😤",
    "🐶", "🐱", "🐼", "🦁", "🐵", "🐸", "🐙", "🐧",
    "🍕", "🍔", "🍟", "🌮", "🍎", "🍌", "🍇", "🍉",
    "⚽", "🏀", "🎾", "🏈", "🎮", "🎲", "🚗", "✈️"]
let allFigures = [...figures, ...figures]
let firstClick = true
let lockBoard = false
let scorePoints = 0
let attempts = 0
let gameTime = 0
let interval;


const timeText = document.createElement('span')

function updateTime() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;

    timeText.textContent =
        `Time: ${minutes}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
    interval = setInterval(() => {
        if (gameTime > 0) {
            gameTime--
            updateTime()
        } else {
            clearInterval(interval)
            saveResult();
            alert('Time is up!')
        }
    }, 1000)
}

updateTime()

const minusBtn = document.createElement('button')
minusBtn.textContent = '-'
minusBtn.addEventListener('click', () => {
    if (gameTime > 10) {
        gameTime -= 10
        updateTime()
    }
})

const plusBtn = document.createElement('button')
plusBtn.textContent = '+'
plusBtn.addEventListener('click', () => {
    gameTime += 10
    updateTime()
})
if (gameTime >= 2000) {
    plusBtn.disabled = true
}

timer.appendChild(minusBtn)
timer.appendChild(timeText)
timer.appendChild(plusBtn)


function createBoard(cards, time, lvlName) {
    gameLvl.textContent = lvlName
    gameTime = time
    updateTime()
    const gameFigures = figures.slice(0, cards / 2)
    allFigures = [...gameFigures, ...gameFigures]
    allFigures.sort(() => Math.random() - 0.5)
    for (let i = 0; i < cards; i++) {
        const card = document.createElement('button')
        card.dataset.figure = allFigures[i]
        card.classList.add('card')
        card.textContent = allFigures[i]

        card.addEventListener("click", handleCardClick)

        grid.appendChild(card)
    }
    setTimeout(() => {
        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            if (!card.classList.contains("matched")) {
                card.textContent = "";
            }
        });
    }, 2000);
    timer.style.display = 'block'
}


const easyLvl = document.createElement('button')
easyLvl.textContent = 'Easy'
easyLvl.addEventListener('click', () => {
    createBoard(16, 100, 'Easy')
})

const mediumLvl = document.createElement('button')
mediumLvl.textContent = 'Medium'
mediumLvl.addEventListener('click', () => {
    createBoard(24, 120, 'Medium')
})

const hardLvl = document.createElement('button')
hardLvl.textContent = 'Hard'
hardLvl.addEventListener('click', () => {
    createBoard(32, 180, 'Hard')
})

gameLvl.appendChild(easyLvl)
gameLvl.appendChild(mediumLvl)
gameLvl.appendChild(hardLvl)



score.textContent = `Score: ${scorePoints}`

function handleCardClick(e) {
    const button = e.target

    if (e.target) {
        plusBtn.disabled = true
        minusBtn.disabled = true
    }


    if (lockBoard) return

    if (selectedCards.includes(button)) return

    if (button.classList.contains('matched')) return

    button.textContent = button.dataset.figure
    selectedCards.push(button)

    if (selectedCards.length === 2) {
        attempts++
        comparison()
    }

    if (firstClick) {
        startTimer()
        firstClick = false
    }
}

function comparison() {
    const first = selectedCards[0]
    const second = selectedCards[1]


    if (first.dataset.figure === second.dataset.figure) {
        first.classList.add('matched')
        second.classList.add('matched')



        const matchedCards = document.querySelectorAll('.matched')
        if (matchedCards.length === allFigures.length) {
            clearInterval(interval);
            saveResult();
            setTimeout(() => {
                alert('You won!')
            }, 500)
        }


        if (attempts === 1) {
            scorePoints += 15;
        } else if (attempts === 2) {
            scorePoints += 10;
        } else {
            scorePoints += 5;
        }

        score.textContent = `Score: ${scorePoints}`;

        attempts = 0;
        selectedCards = []
    } else {

        lockBoard = true
        setTimeout(() => {
            first.textContent = ""
            second.textContent = ""
            selectedCards = []
            lockBoard = false
        }, 1000)
    }
}

newGameBtn.addEventListener('click', newGame)

function newGame() {
    grid.innerHTML = "";
    gameLvl.textContent = "";
    selectedCards = [];
    scorePoints = 0;
    attempts = 0;
    firstClick = true;
    lockBoard = false;

    timer.style.display = 'none'

    score.textContent = `Score: ${scorePoints}`

    gameLvl.appendChild(easyLvl)
    gameLvl.appendChild(mediumLvl)
    gameLvl.appendChild(hardLvl)

    plusBtn.disabled = false
    minusBtn.disabled = false

}

function saveResult() {
    const statistic = {
        date: new Date().toLocaleString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }),
        lvl: gameLvl.textContent,
        score: scorePoints,
        time: gameTime
    };

    let results = JSON.parse(localStorage.getItem("results")) || [];

    results.push(statistic);

    localStorage.setItem("results", JSON.stringify(results));

    showResults()
}

function showResults() {
    let results = JSON.parse(localStorage.getItem("results")) || [];
    gamesHistory.textContent = "";
    results.sort((a, b) => b.score - a.score);
    results = results.slice(0, 10);
    results.forEach(result => {
        const minutes = Math.floor(result.time / 60);
        const seconds = result.time % 60;
        const li = document.createElement("li");
        li.textContent = `Date: ${result.date}, Level: ${result.lvl}, Time: ${minutes}:${String(seconds).padStart(2, "0")}, Score: ${result.score}`;
        gamesHistory.appendChild(li);
    });
}

showResults();