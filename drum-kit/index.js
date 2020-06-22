// Functions

function handleClick(character) {
  switch (character) {
    case "w":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;
    case "a":
      var kickBass = new Audio("sounds/kick-bass.mp3");
      kickBass.play();
      break;
    case "s":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;
    case "d":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play()
      break;
    case "j":
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play()
      break;
    case "k":
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play()
      break;
    case "l":
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play()
      break;
    default:
      console.log("button not recognized");
    }
}

function buttonAnimation(character) {
  var drumClass = "." + character;
  document.querySelector(drumClass).classList.add("pressed")

  setTimeout(function() {
    document.querySelector(drumClass).classList.remove("pressed")
  }, 100);
}

// Drum event listeners
var drums = document.getElementsByClassName("drum")
var drumsLength = drums.length
for (i=0; i < drumsLength; i++) {
  drums[i].addEventListener("click", function(){
    handleClick(this.textContent);
    buttonAnimation(this.textContent);
  })
}

// Keyboard event listener
document.addEventListener("keydown", function(event) {
  handleClick(event.key);
  buttonAnimation(event.key);
})
