// Imports:
import { writeDebug } from './modules/debug.js';
import { names, defaults } from './modules/application-constants.js';
import { assertion } from './modules/assertion.js';
import { Pattern } from './modules/pattern.js';
import { ProgramState } from './modules/program-state.js';
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
- why is it necessary to rename exports?
- should file type in import path be js or ts?
- lost debugging ability b/c modules?


Notes:

- need assignment of brush to update UI elements
- bug: if key down when page refreshed, then swapping modes will be offset; need to refresh everything again?
- bug: keeps firing events when button held? (keyup and keydown)

*/
var currentState;
export function createState() {
    currentState = new ProgramState(createNewPattern);
}
export function getCurrentState() {
    return currentState;
}
// Sets the displayed pattern field to a new pattern object according to the input dimensions on the page
// NEXT: what to do about this? call outside of creating new state? pass it in?
//  * used as: handler for new pattern button
//  * in the past as initialization of state pattern
export function createNewPattern() {
    // Get elements containing dimension inputs and assign to input element type
    let patternHeightInputElement = document.getElementById(names.patternHeight);
    let patternWidthInputElement = document.getElementById(names.patternWidth);
    // Get input values as strings
    let patternHeightInput = patternHeightInputElement.value;
    let patternWidthInput = patternWidthInputElement.value;
    // Check that pattern dimension values are numbers
    assertion.isNum(patternHeightInput);
    assertion.isNum(patternWidthInput);
    let patternHeight = Number(patternHeightInput);
    let patternWidth = Number(patternWidthInput);
    return new Pattern(patternHeight, patternWidth, inject_pattern_onCellClick);
}
// TODO: this function below is passed to the pattern class
// TODO: other way to organize? this function needs to access the current state
// Q: put in module parametrized by program state? makes sense for any other injections?
// Function to apply the brush to the passed event's target
export function inject_pattern_onCellClick(e) {
    var targetElement = e.target;
    if (currentState.isMatchSelection) {
        setBrush(targetElement.style.background);
    }
    else {
        applyBrush(targetElement, currentState.brush);
    }
}
// applies the current brush to the passed cell element and its corresponding element in the data grid
export function applyBrush(cell, brush) {
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
    currentState.displayPattern.cells[rowIndex][columnIndex] = currentState.brush;
    // Checking for debugging:
    writeDebug(currentState.displayPattern.cells, "Pattern model after update:");
}
export function setBrush(brush) {
    // TODO: checks on brush? is a valid background colour? this will change as the meaning of brush changes
    currentState.brush = brush;
    let currentBrush = document.getElementById(names.currentBrush);
    assertion.isNotNull(currentBrush);
    assertion.isNotUndefined(currentBrush);
    currentBrush.style.background = brush;
}
// Note: used for testing
export function write(thingToWrite) {
    let dumpElement = document.getElementById("dump");
    dumpElement.textContent += "\n" + thingToWrite;
}
// Below are functions to update the page - should be in a model? encapsulate?
export function writePattern() {
    let fileString = JSON.stringify(getCurrentState().displayPattern);
    window.localStorage.setItem("saved pattern", fileString);
}
export function readPattern() {
    let fileString = window.localStorage.getItem("saved pattern");
    // TODO: check that valid JSON?
    // TODO: check that parsed JSON has the desired fields?
    // TODO: it's possible to update the display pattern here, but it doesn't update the field on currentState and doesn't cause any persistent update to the model; need function to update it, and make the field private? then this function should be outside?
    getCurrentState().displayPattern = JSON.parse(fileString);
}
export function swapMatchMode() {
    let brushControl = document.getElementById(names.isMatchBrush);
    if (getCurrentState().isMatchSelection) {
        // turn it off and change UI as necessary
        getCurrentState().isMatchSelection = false;
        brushControl.style.background = defaults.cellColour;
    }
    else {
        // turn it on and change UI as necessary
        getCurrentState().isMatchSelection = true;
        brushControl.style.background = "yellow";
    }
}
// if match selection mode is on, then don't colour selected square but instead set the brush to its colour
function onKeyDown_doc(e) {
    // First block below is for bug causing firing during IME composition; update: nope?
    if (e.isComposing || e.keyCode === 229) {
        write("is composing.");
        return;
    }
    // see keycode.info for more
    // if correct key pressed and match selection is off, turn on
    if (e.keyCode === 83 && !getCurrentState().isMatchSelection) {
        swapMatchMode();
    }
}
function onKeyUp_doc(e) {
    // First block below is for bug causing firing during IME composition; update: nope?
    if (e.isComposing || e.keyCode === 229) {
        write("is composing.");
        return;
    }
    // see keycode.info for more
    // if correct key released and match selection is on, turn off
    if (e.keyCode === 83 && getCurrentState().isMatchSelection) {
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
(function initPage() {
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
    document.getElementById(names.patternHeight).value = defaults.patternHeight;
    document.getElementById(names.patternWidth).value = defaults.patternWidth;
    // set default brush styles
    const currentBrushElement = document.getElementById("current-brush");
    currentBrushElement.style.background = defaults.cellColour;
    // create state object
    createState();
    // hook up handlers for key events
    window.addEventListener("keydown", onKeyDown_doc, false);
    window.addEventListener("keyup", onKeyUp_doc, false);
    // hook up handler for clicking the button to swap match mode
    document.getElementById(names.isMatchBrush).addEventListener("click", swapMatchMode, false);
    // hook up handler for the button to create a new pattern
    let button_makePattern = document.getElementById(names.button_createPattern);
    button_makePattern.addEventListener("click", () => currentState.displayPattern = createNewPattern());
    // hook up handlers for buttons to write and read a pattern
    let button_savePattern = document.getElementById(names.button_savePattern);
    button_savePattern.addEventListener("click", writePattern);
    let button_loadPattern = document.getElementById(names.button_loadPattern);
    button_loadPattern.addEventListener("click", readPattern);
})();
