// Imports:
import { assertion } from './modules/assertion.js';


/*
TODO:
- Organize!
  * pull out code referencing the page?
  * read about JS/TS file organization?
  * MVC? By region?
- export to PDF
  * need to have representation of pattern; do this after refactor?
  * write the table to pdf
  * save the file as another file type?
  * way to make different file type openable, or will use app?
- move apply and set brush functions to the program state?
- check defaults in initialization?
- learn about modules
- in assertions, give warnings when called unnecessarily? (e.g. if the type of arg passed to isNum is already a number)
- check defaults
  * way to know if I've checked everything? make defaults enumerable? flag that verified?
- documentation for NaN : number?

Questions:

- when getting info from html element, cast
- best ways to link model and view? events fire when a thing is changed? pattern to follow?
  * updating cell should update model automatically
  * function to initialize and another to handle updates?
- best way to interface between js, css, and html? how to store class names, ids, etc
- bad to have a different style for each cell?
- how to open the page from VS Code?
- when styles added to an HTML element here, are they put in the html, or a css file? (I think the former?)
- using conditions/assertions the way I am is silly because trying to access properties of a null object will cause the same error already?
  * not necessarily the case when passing and manipulating strings; some unintended values may get through?
  * correction: silent failure without checks
- what to do about redundant assertion checks?
  * restrict to pre- and post-conditions?
- I don't want anything to be allowed to be undefined (e.g. if I try to set a style defaults.background, I want to be notified that this is undefined)


Notes:

- need assignment of brush to update UI elements
- bug: if key down when page refreshed, then swapping modes will be offset; need to refresh everything again?
- bug: keeps firing events when button held? (keyup and keydown)

*/



// Below is an interface for id and class names shared between HTML, TS/JS, and CSS
// Only use the fields in name in this file for easier referencing and renaming later
// If changing any of the strings, be sure they are also updated in the TS and CSS files
const names =
{
	currentBrush: "current-brush",
	isMatchBrush: "is-match-brush",
	patternHeight: "pattern-height",
	patternWidth: "pattern-width",
	patternGrid: "table_pattern",
	patternCellName: "pattern-cell",
	button_createPattern: "btn_make-grid",
	button_savePattern: "btn_save-pattern",
	button_loadPattern: "btn_load-pattern",
	appContainer: "app-content",
	region_settings: "region-settings",
	region_pattern: "region-pattern",
	region_brush: "region-brush",
	errorDisplay: "error-display",
	errorMessage: "error-message"
}

// Wrapped defaults
const defaults =
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
// Pattern data
// -------

class Pattern
{
	cells : string[][];

	constructor(height : number, width : number)
	{
		// TODO: Check that inputs are valid numbers, not NaN
		assertion.isNonNegative(height);
		assertion.isNonNegative(width);
		// TODO: this should be front-end validation rather than breaking?

		// write pattern HTML
		let patternContainer = document.getElementById(names.region_pattern)
		patternContainer.innerHTML = this.getPatternHTML(height, width);

		// initialize the HTML elements corresponding to cells in the grid representing the pattern
		this.initializeCellViews();

		// set the cells of the object to defaults
		this.cells = this.initializeCells(height, width);
	}


	// TODO: update function with functions to write html elements
	private getPatternHTML(height : number, width : number) : string
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

	private initializeCells(height : number, width : number) : string[][]
	{
		// cells is column of rows, so
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

		return cells;
	}

	public initializeCellViews()
	{
		// Add event listener to cells
		const viewCells = document.getElementsByClassName(names.patternCellName);

		for (var i = 0; i < viewCells.length; i++)
		{
			let currentCell : HTMLElement = <HTMLElement> viewCells[i];

			// hook up click event
			currentCell.addEventListener("click", onCellClick, false);

			// style background with default
			currentCell.style.background = defaults.cellColour;
		}
	}
}


// -------
// Program state
// -------

class ProgramState
{
	private _displayPattern : Pattern;
	get displayPattern() : Pattern
	{
		return this._displayPattern;
	}
	set displayPattern(value : Pattern)
	{
		// TODO: update view
		this._displayPattern = value;
	}

	isMatchSelection : Boolean;
	brush : string;

	constructor()
	{
		// set the display pattern
		this.createNewPattern();

		// set the default value for whether or not we are in match mode for setting the brush
		this.isMatchSelection = false;

		// set the current brush to the default cell colour
		this.brush = defaults.cellColour;
	}

	// Sets the displayed pattern field to a new pattern object according to the input dimensions on the page
	createNewPattern()
	{
		// Get elements containing dimension inputs and assign to input element type
		let patternHeightInputElement = <HTMLInputElement> document.getElementById(names.patternHeight);
		let patternWidthInputElement = <HTMLInputElement> document.getElementById(names.patternWidth);

		// Get input values as strings
		let patternHeightInput : string = patternHeightInputElement.value;
		let patternWidthInput : string = patternWidthInputElement.value;

		// Check that pattern dimension values are numbers
		assertion.isNum(patternHeightInput);
		assertion.isNum(patternWidthInput);

		let patternHeight : number = Number(patternHeightInput);
		let patternWidth : number = Number(patternWidthInput);

		this.displayPattern = new Pattern(patternHeight, patternWidth);
	}

	// applies the current brush to the passed cell element and its corresponding element in the data grid
	applyBrush(cell : HTMLElement)
	{
		cell.style.background = currentState.brush;

		// regular expression to match the coordinates from a cell id
		let matchExpression = /row(\d+)-col(\d+)/g;
		let matches = matchExpression.exec(cell.id);

		// assert that matches got an array of three elements
		// the first is the full string match, second and third are coordinates
		assertion.hasLength(matches, 3);

		// assert that the second and third matches are numbers
		assertion.isNum(matches[1]);
		assertion.isNum(matches[2]);

		// extract the grid coordinates from the match above
		let rowIndex = Number(matches[1]);
		let columnIndex = Number(matches[2]);

		// set the brush of the corresponding cell in the model to current brush
		this.displayPattern.cells[rowIndex][columnIndex] = this.brush;
	}

	setBrush(brush : string)
	{
		// TODO: checks on brush? is a valid background colour? this will change as the meaning of brush changes

		this.brush = brush;

		let currentBrush = document.getElementById(names.currentBrush);

		assertion.isNotNull(currentBrush);
		assertion.isNotUndefined(currentBrush);

		currentBrush.style.background = brush;
	}
}

var currentState : ProgramState;


function writePattern()
{
	let fileString = JSON.stringify(currentState.displayPattern);

	window.localStorage.setItem("saved pattern", fileString);
}

function readPattern()
{
	let fileString = window.localStorage.getItem("saved pattern");

	// TODO: check that valid JSON?
	// TODO: check that parsed JSON has the desired fields?

	// TODO: it's possible to update the display pattern here, but it doesn't update the field on currentState and doesn't cause any persistent update to the model; need function to update it, and make the field private? then this function should be outside?
	currentState.displayPattern = JSON.parse(fileString);
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
		currentState.setBrush(targetElement.style.background);
	}
	else
	{
		currentState.applyBrush(targetElement);
	}
}


// Temp: hook handlers to pallet items
function makeCurrentBlue() {
	currentState.setBrush("blue");
}

function makeCurrentGreen() {
	currentState.setBrush("green");
}

function makeCurrentPurple() {
	currentState.setBrush("rgb(169, 84, 255)");
}

// Note: used for testing
function write(thingToWrite : string)
{
	let dumpElement = document.getElementById("dump");
	dumpElement.textContent += "\n" + thingToWrite;
}



(function initPage()
			{
				// Initialization order:
				// 1. set defaults on page
				// 2. initialize program state object
				// 3. hook up handlers

				// temp content for initial brush construction
				const element_blue = document.getElementById("blue");
				const elementGreen = document.getElementById("green");
				const elementPurple = document.getElementById("purple");

				element_blue.addEventListener("click", makeCurrentBlue);
				elementGreen.addEventListener("click", makeCurrentGreen);
				elementPurple.addEventListener("click", makeCurrentPurple);
				// end of temp content

				// set the default input values for pattern height and width
				(document.getElementById(names.patternHeight)).value = defaults.patternHeight;
				(document.getElementById(names.patternWidth)).value = defaults.patternWidth;

				// set default brush styles
				const currentBrushElement = document.getElementById("current-brush");
				currentBrushElement.style.background = defaults.cellColour;

				// create state object
				currentState = new ProgramState();


				// hook up handlers for key events
				window.addEventListener("keydown", onKeyDown_doc, false);
				window.addEventListener("keyup", onKeyUp_doc, false);

				// hook up handler for clicking the button to swap match mode
				document.getElementById(names.isMatchBrush).addEventListener("click", swapMatchMode, false);

				// hook up handler for the button to create a new pattern
				let button_makePattern = document.getElementById(names.button_createPattern);
				button_makePattern.addEventListener("click", currentState.createNewPattern);

				// hook up handlers for buttons to write and read a pattern
				let button_savePattern = document.getElementById(names.button_savePattern)
				button_savePattern.addEventListener("click", writePattern);

				let button_loadPattern = document.getElementById(names.button_loadPattern)
				button_loadPattern.addEventListener("click", readPattern);
			})();