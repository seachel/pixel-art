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
- move apply and set brush functions to the program state?

Questions:

- when getting info from html element, cast
- best ways to link model and view? events fire when a thing is changed? pattern to follow?
  * updating cell should update model automatically
  * function to initialize and another to handle updates?
- best way to interface between js, css, and html? how to store class names, ids, etc
- bad to have a different style for each cell?
- how to open the page from VS Code?


Notes:

- need assignment of brush to update UI elements
- bug: if key down when page refreshed, then swapping modes will be offset; need to refresh everything again?
- bug: keeps firing events when button held? (keyup and keydown)

*/

// Below is an interface for id and class names shared between HTML, TS/JS, and CSS
// Only use the fields in name in this file for easier referencing and renaming later
// If changing any of the strings, be sure they are also updated in the TS and CSS files
var names =
{
	currentBrush: "current-brush",
	isMatchBrush: "is-match-brush",
	patternHeight: "pattern-height",
	patternWidth: "pattern-width",
	patternGrid: "table_pattern",
	patternCellName: "pattern-cell",
	button_createPattern: "btn_make-grid",
	appContainer: "app-content",
	region_settings: "region-settings",
	region_pattern: "region-pattern",
	region_brush: "region-brush"
}

// Wrapped defaults
var defaults =
{
	cellColour: "white",
	patternHeight: "3",
	patternWidth: "3",
	cellId: (row : number, column : number) => `row${row}-col${column}`
}

// -*-*-*-*-*-*-*-*-*-
// Model
// -*-*-*-*-*-*-*-*-*-

// -------
// Program state
// -------

class ProgramState
{
	displayPattern : Pattern;
	isMatchSelection : Boolean;
	brush : string;

	constructor()
	{
		let gridHeight = Number(defaults.patternHeight);
		let gridWidth = Number(defaults.patternWidth);

		// TODO: assert that defaults for height and width are numbers

		this.displayPattern = new Pattern(gridHeight, gridWidth);
		this.isMatchSelection = false;
		this.brush = defaults.cellColour;
	}
}

var currentState : ProgramState = new ProgramState();

// -------
// Pattern data
// -------

class Pattern
{
	cells : string[][];

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
				row.push(defaults.cellColour);
			}

			cells.push(row);
		}

		this.cells = cells;
	}
}

function initializePattern()
{
	// Get elements containing dimension inputs and assign to input element type
	let patternHeightInputElement = <HTMLInputElement> document.getElementById(names.patternHeight);
	let patternWidthInputElement = <HTMLInputElement> document.getElementById(names.patternWidth);

	// Get input values as strings
	let patternHeightInput : string = patternHeightInputElement.value;
	let patternWidthInput : string = patternWidthInputElement.value;

	// Check pattern dimension values are numbers
	if (isNaN(Number(patternHeightInput)))
	{
		// TODO: update error once handled another way
		console.log("Pattern height input is not a number.")
	}
	else if (isNaN(Number(patternWidthInput)))
	{
		// TODO: update error once handled another way
		console.log("Pattern width input is not a number.")
	}
	else
	{
		let patternHeight : number = Number(patternHeightInput);
		let patternWidth : number = Number(patternWidthInput);

		currentState.displayPattern = new Pattern(patternHeight, patternWidth)

		// TODO: make sure when a new pattern is generated, the old styles don't persist
		// use regex to search for and delete all cell styles?
		// keep separate file for cell styles related to design?

		// write pattern HTML
		let patternContainer = document.getElementById(names.region_pattern)
		patternContainer.innerHTML = getPatternHTML(patternHeight, patternWidth);

		handleCellClick();
	}
}

function handleCellClick()
{
	// Add event listener to cells
	const cells = document.getElementsByClassName(names.patternCellName);
	for (var i = 0; i < cells.length; i++)
	{
		cells[i].addEventListener("click", onCellClick, false);
	}
}

function getPatternHTML(height : number, width : number) : string
{
	// get element where the pattern will be written
	// build the text for that element
	let patternHTML = `<table id="${names.patternGrid}">
	`;

	for (let i = 0; i < height; i++)
	{
		patternHTML += `<tr>
		`;

		for (let j = 0; j < width; j++)
		{
			patternHTML += `<td id="${defaults.cellId(i,j)}" class="${names.patternCellName}">
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
	if (e.keyCode === 83 && !currentState.isMatchSelection)
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
	if (e.keyCode === 83 && currentState.isMatchSelection)
	{
		swapMatchMode();
	}
}

function swapMatchMode()
{
	let brushControl = document.getElementById(names.isMatchBrush);

	if (currentState.isMatchSelection)
	{
		// turn it off and change UI as necessary
		currentState.isMatchSelection = false;

		brushControl.style.background = defaults.cellColour;
	}
	else
	{
		// turn it on and change UI as necessary
		currentState.isMatchSelection = true;

		brushControl.style.background = "yellow";
	}
}


// Function to apply the brush to the passed event's target
function onCellClick(e : Event)
{
	var targetElement = <HTMLElement>e.target;

	if (currentState.isMatchSelection)
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
	cell.style.background = currentState.brush;

	// Q: since I can set the background of the cell, do I need to make styles for each cell?
	// TODO: update model
	// TODO: extract row and column to get grid coordinates? is there a better way?
	//cell.id
	let matchExpression = /row(\d+)-col(\d+)/g;
	let idString = cell.id;

	// let matches = idString.matchAll(matchExpression);
	// TODO: figure out why below works and above does not
	// TODO: figure out why matchAll works in regex testing site but match works in Safari console
	//let matches = idString['matchAll'](matchExpression);
	let matches = matchExpression.exec(idString);
	//let matches = idString['match'](matchExpression);

	let rowIndex = Number(matches[1]);
	let colIndex = Number(matches[2]);

	// Check that row and column indices are numbers and something hasn't gone wrong with the match
	if (isNaN(rowIndex) || isNaN(colIndex))
	{
		console.log("Bad news! One of the indices to update is not a number!");
	}

	// Update the model
	// TODO: once the brush represents more than just a string of the colour, below will need to be updated
	currentState.displayPattern.cells[rowIndex][colIndex] = currentState.brush;
}

function setBrush(brush : string)
{
	currentState.brush = brush;
	const currentBox = document.getElementById(names.currentBrush);
	currentBox.style.background = brush;
}

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

// Note: used for testing
function write(thingToWrite : string)
{
	let dumpElement = document.getElementById("dump");
	dumpElement.textContent += "\n" + thingToWrite;
}