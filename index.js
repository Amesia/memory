/* 
TODO:
-animatie kaartjes verschijnen op tafel
-timer/card turned
*/
const gameBoard = document.querySelector(".game-board-container");
const startBtn = document.querySelector(".start-btn");

//start game
startBtn.addEventListener("click", function () {
  let size = document.querySelector("#game-size").value;
  let collection = document.querySelector("#game-collection").value;
  if (gameBoard.childElementCount > 0) {
    gameBoard.innerHTML = '';
  }
  gameBoard.style.maxHeight = gameBoard.offsetHeight + "px";
  let randomNums = makeRandomCollectionArray(size);
  makeGrid(size, gameBoard.offsetHeight);
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
function makeGrid(size, gameBoardHeight) {
  // make html cards
  for (let i = 0; i < size; i++) {
    gameBoard.innerHTML += '<div class="card"><div class="outer"></div><div class="inner hidden"><img></img></div></div>';
  }
  //size up gameboard
  //hoogte berekenen
  let cardSize3Rows = Math.round((gameBoardHeight / 3) - 20); // 3 rijen
  let cardSize4Rows = Math.round((gameBoardHeight / 4) - 20); //4 rijen

  //breedte berekenen
  if (size === "6") {
    gameBoard.style.maxWidth = ((cardSize3Rows + 20) * 2 + 10) + "px"; // berekenen breedte (1 card + margin) * aantal colomen + margin links en rechts
    resizeCards(cardSize3Rows);
  } else if (size === "12") {
    gameBoard.style.maxWidth = ((cardSize3Rows + 20) * 4) + "px";
    resizeCards(cardSize3Rows);
  } else if (size === "24") {
    gameBoard.style.maxWidth = ((cardSize4Rows + 20) * 6) + "px";
    resizeCards(cardSize4Rows);
  } else if (size === "32") {
    gameBoard.style.maxWidth = ((cardSize4Rows + 20) * 8) + "px";
    resizeCards(cardSize4Rows);
  } else if (size === "40") {
    gameBoard.style.maxWidth = ((cardSize4Rows + 20) * 10) + "px";
    resizeCards(cardSize4Rows);
  }
  gameBoard.style.backgroundColor = "rgba(11, 11, 15, 40%)";
}
function resizeCards(cardSize) {
  document.querySelectorAll(".card").forEach(card => {
    card.style.height = cardSize + "px";
    card.style.width = cardSize + "px";
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
    // remove event
    document.querySelectorAll(".card").forEach(card => {
      card.removeEventListener("click", flipCard);
      card.addEventListener("click", cantTurnCard);
    })
    checkMatch(document.querySelectorAll(".flipped"));
    // add event
    setTimeout(function () {
      document.querySelectorAll(".card").forEach(card => {
        card.removeEventListener("click", cantTurnCard);
        card.addEventListener("click", flipCard);
      })
    }, 2000)
  }
}
function cantTurnCard() {
  this.classList.add("shake");
  setTimeout(() => {
    this.classList.remove("shake");
  }, 1000);
}
function checkMatch(cards) {
  if (cards[0].lastChild.firstChild.src === cards[1].lastChild.firstChild.src) {
    setTimeout(function () {
      cards.forEach(card => {
        card.classList.add("matched");
        card.classList.remove("flipped");
      });
      gameOver();
    }, 1000)

  } else {
    setTimeout(function () {
      cards.forEach(card => {
        card.classList.remove("flipped");
      });
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