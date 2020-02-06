import { writeDebug } from './debug.js';

import { assertion } from './assertion.js';
import { names, defaults } from './application-constants.js';

// -*-*-*-*-*-*-*-*-*-
// Model
// -*-*-*-*-*-*-*-*-*-

// -------
// Pattern data
// -------

export function makePatternFromDimensions(height : number, width : number, onCellClick : (e : Event) => void) : Pattern
{
	let pattern = new Pattern(onCellClick);

	pattern.initializePatternFromDimensions(height, width);

	return pattern;
}

export function makePatternFromCells(cells : string[][], onCellClick : (e : Event) => void) : Pattern
{
	let pattern = new Pattern(onCellClick);

	pattern.InitializePatternFromCells(cells);

	return pattern;
}

export class Pattern
{
	cells : string[][];
	onCellClick : (e : Event) => void

	constructor(onCellClick : (e : Event) => void)
	{
		this.onCellClick = onCellClick;
	}

	// Note:
	// - pattern init from dimensions or cells
	public initializePatternFromDimensions(height : number, width : number)
	{
		// TODO: Check that inputs are valid numbers, not NaN
		assertion.isNonNegative(height);
		assertion.isNonNegative(width);
		// TODO: this should be front-end validation rather than breaking?

		// set the cells of the object to defaults
		this.cells = this.getDefaultCells(height, width);

		// initialize the HTML elements corresponding to cells in the grid representing the pattern
		this.initializePatternView(height, width);
	}

	public InitializePatternFromCells(cells : string[][])
	{
		this.cells = cells;

		this.initializePatternView(this.getPatternHeight(), this.getPatternWidth());

		// write HTML for pattern and assign brush?
	}

	private getPatternHeight() : number
	{
		// TODO: verification that number can be returned
		if (this.cells && this.cells.length)
		{
			return this.cells.length;
		}
		else
		{
			return 0;
		}
	}

	private getPatternWidth() : number
	{
		if (this.cells && this.cells.length > 0)
		{
			return this.cells[0].length;
		}
		else
		{
			return 0;
		}
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

	// Returns a grid of brushes (strings for now) with the default brush assigned
	private getDefaultCells(height : number, width : number) : string[][]
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

	// TODO: when? need the HTML to already be written
	private initializePatternView(height : number, width : number)
	{
		// write pattern HTML
		let patternContainer = document.getElementById(names.region_pattern)
		patternContainer.innerHTML = this.getPatternHTML(height, width);

		// Add event listener to cells
		const viewCells = document.getElementsByClassName(names.patternCellName);

		for (var i = 0; i < viewCells.length; i++)
		{
			let currentCell : HTMLElement = <HTMLElement> viewCells[i];

			// hook up click event
			currentCell.addEventListener("click", this.onCellClick, false);

			// style background with default
			currentCell.style.background = defaults.cellColour;
		}
	}
}
