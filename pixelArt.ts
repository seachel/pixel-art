/*
TODO:
- set brush to selection
  * hold another button as part of the event?
  * keydown changes state for certain keys? (cmd)
  * state change using button
- apply selection elsewhere in pattern while mouse down?
- select and drag to move? or copy? (later)
- export to PDF
  * need to have representation of pattern; do this after refactor?
  * write the table to pdf
  * save the file as another file type?
  * way to make different file type openable, or will use app?
- redo at some point (after pushing this as far as possible?)

Notes:

- need assignment of brush to update UI elements
- bug: if key down when page refreshed, then swapping modes will be offset; need to refresh everything again?
- bug: keeps firing events when button held?

*/


// match brush mode
let isMatchSelection : boolean = false;

// if match selection mode is on, then don't colour selected square but instead set the brush to its colour

function onKeyDown_doc(e : KeyboardEvent)
{
	// First block below is for bug causing firing during IME composition; update: nope?
	if (e.isComposing || e.keyCode === 229)
	{
		write("is composing.");
		return;
	}

	// see keycode.info for more
	// if correct key pressed and match selection is off, turn on
	if (e.keyCode === 83 && !isMatchSelection)
	{
		write("pressed s; event is " + e.type + ", " + e.target);
		swapMatchMode();
	}
}

function onKeyUp_doc(e : KeyboardEvent)
{
	// First block below is for bug causing firing during IME composition; update: nope?
	if (e.isComposing || e.keyCode === 229)
	{
		write("is composing.");
		return;
	}

	// see keycode.info for more
	// if correct key released and match selection is on, turn off
	if (e.keyCode === 83 && isMatchSelection)
	{
		write("pressed s; event is " + e.type + ", " + e.target);
		swapMatchMode();
	}
}


window.addEventListener("keydown", onKeyDown_doc, false);
window.addEventListener("keyup", onKeyUp_doc, false);


function swapMatchMode()
{
	let brushControl = document.getElementById("match-brush");

	if (isMatchSelection)
	{
		// turn it off and change UI as necessary
		isMatchSelection = false;

		brushControl.style.background = "white";
	}
	else
	{
		// turn it on and change UI as necessary
		isMatchSelection = true;

		brushControl.style.background = "yellow";
	}
}

document.getElementById("match-brush").addEventListener("click", swapMatchMode, false);


// Function to apply the brush to the passed event's target
function onCellClick(e : Event)
{
	var targetElement = <HTMLElement>e.target;

	if (isMatchSelection)
	{
		setBrush(targetElement.style.background);
	}
	else
	{
		applyBrush(targetElement);
	}
}

function applyBrush(cell : HTMLElement)
{
	cell.style.background = currentBrush;
}

function setBrush(brush : string)
{
	currentBrush = brush;
	const currentBox = document.getElementById("current");
	currentBox.style.background = brush;
}

// Add event listener to cells
const cells = document.getElementsByClassName("pattern_cell");
for (var i = 0; i < cells.length; i++)
{
	cells[i].addEventListener("click", onCellClick, false);
}

// document.body.textContent = "Hallo Chelsea";

// build brush
var currentBrush = "white";

// hook handlers to pallet items
function makeCurrentBlue() {
	setBrush("blue");
}

function makeCurrentGreen() {
	setBrush("green");
}

function makeCurrentPurple() {
	setBrush("rgb(169, 84, 255)");
}

const element_blue = document.getElementById("blue");
const elementGreen = document.getElementById("green");
const elementPurple = document.getElementById("purple");

element_blue.addEventListener("click", makeCurrentBlue);
elementGreen.addEventListener("click", makeCurrentGreen);
elementPurple.addEventListener("click", makeCurrentPurple);

function write(thingToWrite : string)
{
	let dumpElement = document.getElementById("dump");
	dumpElement.textContent += "\n" + thingToWrite;
}