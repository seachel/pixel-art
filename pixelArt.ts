// Function to change the content of t2
function applyBrush(e : Event)
{
	var targetElement = <HTMLElement>e.target;
	targetElement.style.background = brush;
}

// Add event listener to cells
const cells = document.getElementsByClassName("pattern_cell");
for (var i = 0; i < cells.length; i++)
{
	cells[i].addEventListener("click", applyBrush, false);
}

// document.body.textContent = "Hallo Chelsea";

// build brush
var brush = "white";

// hook handlers to pallet items
function makeCurrentBlue() {
	const currentBox = document.getElementById("current")
	currentBox.firstChild.nodeValue = "blue"
	currentBox.style.background = "blue";
	brush = "blue";
}

function makeCurrentGreen() {
	const currentBox = document.getElementById("current")
	currentBox.firstChild.nodeValue = "green"
	currentBox.style.background = "green";
	brush = "green";
}

function makeCurrentPurple() {
	const currentBox = document.getElementById("current")
	currentBox.firstChild.nodeValue = "purple"
	currentBox.style.background = "purple";
	brush = "purple";
}

const element_blue = document.getElementById("blue");
const elementGreen = document.getElementById("green");
const elementPurple = document.getElementById("purple");

element_blue.addEventListener("click", makeCurrentBlue);
elementGreen.addEventListener("click", makeCurrentGreen);
elementPurple.addEventListener("click", makeCurrentPurple);