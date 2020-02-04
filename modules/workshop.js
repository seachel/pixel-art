import { writeDebug } from './debug.js';
import { names, defaults } from './application-constants.js';
import { assertion } from './assertion.js';
import { Pattern } from './pattern.js';
import { ProgramState } from './program-state.js';
// This module contains all the behaviour referencing the application state
// The functions here will be used by the top-level module to manage the application
var currentState;
export function createState() {
    currentState = new ProgramState();
}
// Sets the displayed pattern field to a new pattern object according to the input dimensions on the page
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
    this.displayPattern = new Pattern(patternHeight, patternWidth, inject_pattern_onCellClick);
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
// Below are functions to update the page - should be in a model? encapsulate?
export function writePattern() {
    let fileString = JSON.stringify(currentState.displayPattern);
    window.localStorage.setItem("saved pattern", fileString);
}
export function readPattern() {
    let fileString = window.localStorage.getItem("saved pattern");
    // TODO: check that valid JSON?
    // TODO: check that parsed JSON has the desired fields?
    // TODO: it's possible to update the display pattern here, but it doesn't update the field on currentState and doesn't cause any persistent update to the model; need function to update it, and make the field private? then this function should be outside?
    currentState.displayPattern = JSON.parse(fileString);
}
export function swapMatchMode() {
    let brushControl = document.getElementById(names.isMatchBrush);
    if (currentState.isMatchSelection) {
        // turn it off and change UI as necessary
        currentState.isMatchSelection = false;
        brushControl.style.background = defaults.cellColour;
    }
    else {
        // turn it on and change UI as necessary
        currentState.isMatchSelection = true;
        brushControl.style.background = "yellow";
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
// if match selection mode is on, then don't colour selected square but instead set the brush to its colour
function onKeyDown_doc(e) {
    // First block below is for bug causing firing during IME composition; update: nope?
    if (e.isComposing || e.keyCode === 229) {
        write("is composing.");
        return;
    }
    // see keycode.info for more
    // if correct key pressed and match selection is off, turn on
    if (e.keyCode === 83 && !currentState.isMatchSelection) {
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
    if (e.keyCode === 83 && currentState.isMatchSelection) {
        swapMatchMode();
    }
}
// Note: used for testing
function write(thingToWrite) {
    let dumpElement = document.getElementById("dump");
    dumpElement.textContent += "\n" + thingToWrite;
}
