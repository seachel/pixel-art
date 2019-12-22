// Function to change the content of t2
function modifyText() {
	const t2 = document.getElementById("t2");
	if (t2.firstChild.nodeValue == "three") {
		t2.firstChild.nodeValue = "two";
	} else {
		t2.firstChild.nodeValue = "three";
	}
}

// Add event listener to table
const el = document.getElementById("outside");
el.addEventListener("click", modifyText, false);

// document.body.textContent = "Hallo Chelsea";

// build brush

// hook handlers to pallet items
function makeCurrentBlue() {
	const currentBox = document.getElementById("current")
	currentBox.firstChild.nodeValue = "blue"
	currentBox.style.background = "blue";
}

function makeCurrentGreen() {
	const currentBox = document.getElementById("current")
	currentBox.firstChild.nodeValue = "green"
	currentBox.style.background = "green";
}

function makeCurrentPurple() {
	const currentBox = document.getElementById("current")
	currentBox.firstChild.nodeValue = "purple"
	currentBox.style.background = "purple";
}

const element_blue = document.getElementById("blue");
const elementGreen = document.getElementById("green");
const elementPurple = document.getElementById("purple");

element_blue.addEventListener("click", makeCurrentBlue);
elementGreen.addEventListener("click", makeCurrentGreen);
elementPurple.addEventListener("click", makeCurrentPurple);