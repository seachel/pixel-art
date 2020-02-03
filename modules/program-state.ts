import { names, defaults } from './application-constants.js';
import { Pattern } from './pattern.js';
import { assertion } from './assertion.js';

export { _ProgramState as ProgramState };

// -------
// Program state
// -------

export class _ProgramState
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
	applyBrush(cell : HTMLElement, brush : string)
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
