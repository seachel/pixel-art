// Imports:
import { writeDebug, writeToPage } from './modules/debug.js';

import { names, defaults } from './modules/application-constants.js';
import { assertion } from './modules/assertion.js';
import { Pattern } from './modules/pattern.js';
import * as AppState from './modules/program-state.js';


/*
TODO:
- Organize!
  * pull out code referencing the page?
  * read about JS/TS file organization?
  * MVC? By region?

*/

// Constructs a new pattern object according to the input dimensions on the page
function createNewPatternFromInputs() : Pattern
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

	return createNewPattern(patternHeight, patternWidth);
}

function createNewPattern(patternHeight : number, patternWidth : number) : Pattern
{
	return new Pattern(patternHeight, patternWidth, inject_pattern_onCellClick);
}


// TODO: this function below is passed to the pattern class
// TODO: other way to organize? this function needs to access the current state
// Q: put in module parametrized by program state? makes sense for any other injections?
// Function to apply the brush to the passed event's target
function inject_pattern_onCellClick(e : Event)
{
	var targetElement = <HTMLElement>e.target;

	if (AppState.getProgramState().isMatchSelection)
	{
		setBrush(targetElement.style.background);
	}
	else
	{
		applyBrush(targetElement, AppState.getProgramState().brush);
	}
}



// applies the current brush to the passed cell element and its corresponding element in the data grid
function applyBrush(cell : HTMLElement, brush : string)
{
	cell.style.background = brush;

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
	AppState.getProgramState().displayPattern.cells[rowIndex][columnIndex] = AppState.getProgramState().brush;

	// Checking for debugging:
	writeDebug(AppState.getProgramState().displayPattern.cells, "Pattern model after update:");
}

function setBrush(brush : string)
{
	// TODO: checks on brush? is a valid background colour? this will change as the meaning of brush changes

	AppState.getProgramState().brush = brush;

	let currentBrush = document.getElementById(names.currentBrush);

	assertion.isNotNull(currentBrush);
	assertion.isNotUndefined(currentBrush);

	currentBrush.style.background = brush;
}


// Below are functions to update the page - should be in a model? encapsulate?

function writePattern()
{
	let fileString = JSON.stringify(AppState.getProgramState().displayPattern);

	window.localStorage.setItem("saved pattern", fileString);
}

function readPattern()
{
	let fileString = window.localStorage.getItem("saved pattern");

	// TODO: check that valid JSON?
	// TODO: check that parsed JSON has the desired fields?

	// TODO: it's possible to update the display pattern here, but it doesn't update the field on currentState and doesn't cause any persistent update to the model; need function to update it, and make the field private? then this function should be outside?
	AppState.getProgramState().displayPattern = JSON.parse(fileString);
}


function swapMatchMode()
{
	let brushControl = document.getElementById(names.isMatchBrush);

	if (AppState.getProgramState().isMatchSelection)
	{
		// turn it off and change UI as necessary
		AppState.getProgramState().isMatchSelection = false;

		brushControl.style.background = defaults.cellColour;
	}
	else
	{
		// turn it on and change UI as necessary
		AppState.getProgramState().isMatchSelection = true;

		brushControl.style.background = "yellow";
	}
}



// if match selection mode is on, then don't colour selected square but instead set the brush to its colour
function onKeyDown_doc(e : KeyboardEvent)
{
	// First block below is for bug causing firing during IME composition; update: nope?
	if (e.isComposing || e.keyCode === 229)
	{
		writeToPage("is composing.");
		return;
	}

	// see keycode.info for more
	// if correct key pressed and match selection is off, turn on
	if (e.keyCode === 83 && !AppState.getProgramState().isMatchSelection)
	{
		swapMatchMode();
	}
}

function onKeyUp_doc(e : KeyboardEvent)
{
	// First block below is for bug causing firing during IME composition; update: nope?
	if (e.isComposing || e.keyCode === 229)
	{
		writeToPage("is composing.");
		return;
	}

	// see keycode.info for more
	// if correct key released and match selection is on, turn off
	if (e.keyCode === 83 && AppState.getProgramState().isMatchSelection)
	{
		swapMatchMode();
	}
}


// Temp: hook handlers to pallet items
function makeCurrentBlue() {
	setBrush("blue");
}

function makeCurrentGreen() {
	setBrush("green");
}

function makeCurrentPurple() {
	setBrush("rgb(169, 84, 255)");
}



(function initPage()
{
	// Initialization order:
	// 1. set defaults on page
	// 2. initialize program state object
	// 3. hook up handlers

	// temp content for initial brush construction
	const elementBlue = document.getElementById("blue");
	const elementGreen = document.getElementById("green");
	const elementPurple = document.getElementById("purple");

	elementBlue.addEventListener("click", makeCurrentBlue);
	elementGreen.addEventListener("click", makeCurrentGreen);
	elementPurple.addEventListener("click", makeCurrentPurple);
	// end of temp content

	// set the default input values for pattern height and width
	(<HTMLInputElement> document.getElementById(names.patternHeight)).value = defaults.patternHeight;
	(<HTMLInputElement> document.getElementById(names.patternWidth)).value = defaults.patternWidth;

	// set default brush styles
	const currentBrushElement = document.getElementById("current-brush");
	currentBrushElement.style.background = defaults.cellColour;

	// create state object
	AppState.setProgramState(new AppState.ProgramState(createNewPatternFromInputs));


	// hook up handlers for key events
	window.addEventListener("keydown", onKeyDown_doc, false);
	window.addEventListener("keyup", onKeyUp_doc, false);

	// hook up handler for clicking the button to swap match mode
	document.getElementById(names.isMatchBrush).addEventListener("click", swapMatchMode, false);

	// hook up handler for the button to create a new pattern
	let button_makePattern = document.getElementById(names.button_createPattern);
	button_makePattern.addEventListener("click", () => AppState.getProgramState().displayPattern = createNewPatternFromInputs());

	// hook up handlers for buttons to write and read a pattern
	let button_savePattern = document.getElementById(names.button_savePattern)
	button_savePattern.addEventListener("click", writePattern);

	let button_loadPattern = document.getElementById(names.button_loadPattern)
	button_loadPattern.addEventListener("click", readPattern);
})();