/* 
TODO:
-animatie kaartjes verschijnen op tafel
-timer/card turned
bug: daantje zie geen plaatjes
*/
const gameBoard = document.querySelector(".game-board-container");
const startBtn = document.querySelector(".start-btn");
const maxWidth = document.querySelector("body").offsetWidth;

// mediaqueries
const s = window.matchMedia("(max-width: 375px)");
const xs = window.matchMedia("(max-width: 320px)");
if (s.matches) {
  document.querySelector(".forty").setAttribute("disabled", "disabled");
}
if (xs.matches) {
  document.querySelector(".thirtytwo").setAttribute("disabled", "disabled");
}
//START GAME
startBtn.addEventListener("click", function () {
  let size = document.querySelector("#game-size").value;
  let collection = document.querySelector("#game-collection").value;
  if (gameBoard.childElementCount > 0) {
    gameBoard.innerHTML = '';
  }
  gameBoard.style.maxHeight = gameBoard.offsetHeight + "px";
  // gameBoard.style.width = body.offsetWidth + "px";
  let randomNums = makeRandomCollectionArray(size);
  makeGrid(size, gameBoard.offsetHeight, maxWidth);
  //addRandomImages
  addRandomImages(collection, randomNums);
})
// MAIN FUNCTIONS
function makeRandomCollectionArray(size) {
  // array of size/2 random unique numbers not bigger then amount of pics
  let randomUniqueArray = [];

  while (randomUniqueArray.length < size / 2) {
    let randomnumber = Math.floor(Math.random() * 30) + 1;
    if (!randomUniqueArray.includes(randomnumber)) {
      randomUniqueArray.push(randomnumber);
    }
  }
  // array = randomUniqueArray * 2
  let doubleArray = [];
  doubleArray.push(...randomUniqueArray, ...randomUniqueArray);
  // array shuffle
  return shuffleArray(doubleArray);
}
function shuffleArray(arr) {
  // pick 2 random numbers inside array and swith
  for (let i = 0; i < arr.length; i++) {
    let randomNum = Math.floor(Math.random() * arr.length);
    let holdNum = (arr.splice(randomNum, 1));
    arr.push(...holdNum);
  }
  return arr;
}
function makeGrid(size, maxHeight, maxWidth) {
  let foundBestFit = false;
  let testCols = 2;
  let bestAmountCols, bestCardSize;
  do {
    if (size % testCols === 0) {
      cardSize = Math.floor(maxHeight / (size / testCols));
      if (cardSize * testCols > maxWidth) {
        foundBestFit = true;
        if (testCols === 2) {
          bestAmountCols = 2;
          bestCardSize = maxWidth / 2;
        }
      } else {
        bestAmountCols = testCols;
        bestCardSize = cardSize;
        testCols++;
      }
    } else {
      testCols++;
    }
  } while (!foundBestFit)
  let cols = bestAmountCols;
  gameBoard.style.width = bestCardSize * bestAmountCols + "px";
  gameBoard.style.backgroundColor = "rgba(11, 11, 15, 40%)";
  gameBoard.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
  makeCards(bestCardSize, size);
}
function makeCards(cardSize, size) {
  for (let i = 0; i < size; i++) {
    gameBoard.innerHTML += '<div class="card"><div class="outer"></div><div class="inner hidden"><img></img></div></div>';
  }
  document.querySelectorAll(".card").forEach(card => {
    card.style.width = (cardSize) - 8 + "px";
    card.style.height = (cardSize) - 8 + "px";
    card.addEventListener("click", flipCard);
  })
}
function addRandomImages(collection, randomNumArr) {
  document.querySelectorAll(".card img").forEach((img, key) => {
    img.setAttribute("src", "images/" + collection + "/" + collection + randomNumArr[key] + ".jpg");
  });
}
//ONCLICK FUNCTIONS
function flipCard() {
  this.lastChild.classList.remove("hidden");
  this.classList.add("flipped");
  if (document.querySelectorAll(".flipped").length === 2) {
    checkMatch(document.querySelectorAll(".flipped"));
  }
}
function cantTurnCard() {
  this.classList.add("shake");
  setTimeout(() => {
    this.classList.remove("shake");
  }, 1000);
}
function checkMatch(cards) {
  document.querySelectorAll(".card").forEach(card => {
    card.removeEventListener("click", flipCard);
    card.addEventListener("click", cantTurnCard);
  })
  if (cards[0].lastChild.firstChild.src === cards[1].lastChild.firstChild.src) {
    setTimeout(function () {
      cards.forEach(card => {
        card.classList.add("matched");
        card.classList.remove("flipped");
      });
      gameOver();
      document.querySelectorAll(".card").forEach(card => {
        card.removeEventListener("click", cantTurnCard);
        if (!card.classList.contains("matched")) {
          card.addEventListener("click", flipCard);
        }
      })
    }, 1000)
  } else {
    setTimeout(function () {
      cards.forEach(card => {
        card.classList.remove("flipped");
      });
      document.querySelectorAll(".card").forEach(card => {
        card.removeEventListener("click", cantTurnCard);
        card.addEventListener("click", flipCard);
      })
    }, 2000)
  }
}
function gameOver() {
  let totalCards = document.querySelectorAll(".card").length;
  let totalMatched = document.querySelectorAll(".matched").length;
  if (totalMatched === totalCards) {
    gameBoard.innerHTML += '<span class="gameover">Good job!! Press play to start again</span>';
  }
}