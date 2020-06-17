
// Set dice 1
var playerOneNumber = Math.floor(Math.random() * 6) + 1
document.getElementsByClassName("img1")[0].setAttribute("src", "images\\dice" + playerOneNumber + ".png")

// Set dice 2
var playerTwoNumber = Math.floor(Math.random() * 6) + 1
document.getElementsByClassName("img2")[0].setAttribute("src", "images\\dice" + playerTwoNumber + ".png")


if (playerOneNumber > playerTwoNumber) {
  document.querySelector("h1").textContent = "Player 1 Wins!"
} else if (playerTwoNumber > playerOneNumber) {
  document.querySelector("h1").textContent = "Player 2 Wins!"
} else {
  document.querySelector("h1").textContent = "Its a tie :("
}
