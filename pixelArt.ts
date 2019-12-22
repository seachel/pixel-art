/*
TODO:
- set brush to selection
  * hold another button as part of the event?
  * keydown changes state for certain keys?
- apply selection elsewhere in pattern while mouse down?
- select and drag to move? or copy?
- export to PDF

Notes:

- need assignment of brush to update UI elements
*/

// match brush mode
let isMatchSelection : boolean = false;

// if match selection mode is on, then don't colour selected square but instead set the brush to its colour

// Test event functions
class SwitcherThing
{
	values = ["red", "green"];
	index : number;

	constructor()
	{
		this.index = 0;
	}

	next()
	{
		let result = this.values[this.index];

		if (this.index == this.values.length - 1)
		{
			this.index = 0;
		}
		else
		{
			this.index++;
		}

		return result;
	}
}

let myThing = new SwitcherThing();

function setBackground()
{
	let newBackgroundColour = myThing.next();

	document.getElementById("project-body").style.background = newBackgroundColour;
}

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