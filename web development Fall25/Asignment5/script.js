const playerpick = document.querySelectorAll(".flex-item");
const computerImg = document.querySelector("#computer-play img");
let computer = "none";
let playerChoice = null;
let wincounter = 0;
let losecounter = 0;
let tiecounter = 0;

playerpick.forEach(item => {
    item.addEventListener("click", () => {
        playerpick.forEach(c => c.style.border = "none");

        item.style.border = "5px solid red";

        playerChoice = item.getAttribute("data-choice");

        computerpick();
    });
});

function computerpick() {
    let counter = 0;
    const interval = setInterval(() => {
        computerImg.style.border = 'none';

        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const randompick = randomNumber % 3;

        if (randompick === 0) {
            computerImg.src = "images/scissors.PNG";
            computer = 'scissors';
        }
        if (randompick === 1) {
            computerImg.src = "images/rock.PNG";
            computer = 'rock';
        }
        if (randompick === 2) {
            computerImg.src = "images/paper.PNG";
            computer = 'paper';
        }

        counter++;

        if (counter >= 6) {
            clearInterval(interval);
            computerImg.style.border = '5px solid blue';
            const result = compare(playerChoice, computer);
        document.getElementById("result").textContent = result;
        updateScore(); 

           }

    }, 500);
}

function compare(player, computer) {
    let result = "";

    if (player === computer) {
        tiecounter++;
        result = "It's a tie!";
    } else if (player === 'rock') {
        if (computer === 'scissors') {
            wincounter++;
            result = "Player wins!";
        } else {
            losecounter++;
            result = "Player lost!";
        }
    } else if (player === 'paper') {
        if (computer === 'rock') {
            wincounter++;
            result = "Player wins!";
        } else {
            losecounter++;
            result = "Player lost!";
        }
    } else if (player === 'scissors') {
        if (computer === 'paper') {
            wincounter++;
            result = "Player wins!";
        } else {
            losecounter++;
            result = "Player lost!";
        }
    }

    return result;
}

document.getElementById('resetScore').onclick = function () {
    wincounter = 0;
    tiecounter = 0;
    losecounter = 0;

    const scoreText = `Scores: Wins: ${wincounter} | Losses: ${losecounter} | Ties: ${tiecounter}`;
    document.getElementById("scores").textContent = scoreText;

};



function updateScore() {
    const scoreText = `Scores: Wins: ${wincounter} | Losses: ${losecounter} | Ties: ${tiecounter}`;
    document.getElementById("scores").textContent = scoreText;
}