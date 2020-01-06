/*
TODO:
- set brush to selection
  * hold another button as part of the event? (done)
  * keydown changes state for certain keys? (done)
  * state change using button (done)
- apply selection elsewhere in pattern while mouse down?
- select and drag to move? or copy? (later)
- export to PDF
  * need to have representation of pattern; do this after refactor?
  * write the table to pdf
  * save the file as another file type?
  * way to make different file type openable, or will use app?
- redo at some point (after pushing this as far as possible?)

Questions:

- when getting info from html element, cast
- best ways to link model and view? events fire when a thing is changed? pattern to follow?
  * updating cell should update model automatically
  * function to initialize and another to handle updates?
- best way to interface between js, css, and html? how to store class names, ids, etc
- bad to have a different style for each cell?


Notes:

- need assignment of brush to update UI elements
- bug: if key down when page refreshed, then swapping modes will be offset; need to refresh everything again?
- bug: keeps firing events when button held? (keyup and keydown)

*/

// -*-*-*-*-*-*-*-*-*-
// Model
// -*-*-*-*-*-*-*-*-*-

// TODO:
// objects to represent:
// - pattern (a grid of cells)
// - cell (a structure with a string for colour for now, later more)

const defaultColour : string = "white";
let displayPattern : Pattern;

class Pattern
{
	cells : string[][];

	// set all cells to default value?

	constructor(height : number, width : number)
	{
		// grid is column of rows, so
		//   outer loop goes along/down the column
		//   the inner loop goes across each row

		let cells : string[][] = [];

		for (let i = 0; i < height; i++)
		{
			let row : string[] = [];

			for (let j = 0; j < width; j++)
			{
				row.push(defaultColour);
			}

			cells.push(row);
		}

		this.cells = cells;
	}
}

function initializePattern()
{
	// Get elements containing dimension inputs and assign to input element type
	let patternHeightInputElement = <HTMLInputElement> document.getElementById("grid-height");
	let patternWidthInputElement = (<HTMLInputElement>document.getElementById("grid-width"));

	// Get input values as strings
	let patternHeightInput : string = patternHeightInputElement.value;
	let patternWidthInput : string = patternWidthInputElement.value;

	// Check pattern dimension values are numbers
	if (isNaN(Number(patternHeightInput)))
	{
		// TODO: update error once handled another way
		console.log("Pattern height input is not a number")
	}
	else if (isNaN(Number(patternWidthInput)))
	{
		// TODO: update error once handled another way
		console.log("Pattern width input is not a number")
	}
	else
	{
		let patternHeight : number = Number(patternHeightInput);
		let patternWidth : number = Number(patternWidthInput);

		displayPattern = new Pattern(patternHeight, patternWidth)

		// TODO: make sure when a new pattern is generated, the old styles don't persist
		// use regex to search for and delete all cell styles?
		// keep separate file for cell styles related to design?

		// write pattern HTML
		let patternContainer = document.getElementById("pattern-container")
		patternContainer.innerHTML = getPatternHTML(patternHeight, patternWidth);
	}
}

function getPatternHTML(height : number, width : number) : string
{
	// get element where the pattern will be written
	// build the text for that element
	let patternHTML = `<table id="table_pattern">
	`;

	for (let i = 0; i < height; i++)
	{
		patternHTML += `<tr>
		`;

		for (let j = 0; j < width; j++)
		{
			patternHTML += `<td id="row${i}-col${j}" class="pattern-cell">
			-
			</td>
			`;
			// Note: "-" is temp content for cell
		}

		patternHTML += `</tr>
		`;
	}

	patternHTML += `</table>
	`;

	return patternHTML;
}


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

// Note: used for testing
function write(thingToWrite : string)
{
	let dumpElement = document.getElementById("dump");
	dumpElement.textContent += "\n" + thingToWrite;
}

const button_makePattern = document.getElementById("btn_make-grid");
button_makePattern.addEventListener("click", initializePattern);

(function initPage()
{
	(<HTMLInputElement> document.getElementById("grid-width")).value = "3";
	(<HTMLInputElement> document.getElementById("grid-height")).value = "3";

	initializePattern();
})();
