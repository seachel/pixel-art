import { assertion } from './assertion.js'
import { Pattern, makePatternFromDimensions, makePatternFromCells } from './pattern.js';

// Core functions from the top-level module appropriate to use when writing tests

export function createNewPattern(patternHeight : number, patternWidth : number, onCellClick : (e : Event) => void) : Pattern
{
	return makePatternFromDimensions(patternHeight, patternWidth, onCellClick);
}

export function loadPattern(cells : string[][], onCellClick : (e : Event) => void) : Pattern
{
	return makePatternFromCells(cells, onCellClick);
}

// Given a cell id from the page in form rowX_colY, where X represents the row index and Y represents the column index, return an object containing X and Y
export function getIndicesFromID(stringID : string) : { row : number, column : number}
{
	// regular expression to match the coordinates from a cell id
	let matchExpression = /row(\d+)-col(\d+)/g;
	let matches = matchExpression.exec(stringID);

	// assert that matches got an array of three elements
	// the first is the full string match, second and third are coordinates
	assertion.hasLength(matches, 3);

	// assert that the second and third matches are numbers
	assertion.isNum(matches[1]);
	assertion.isNum(matches[2]);

	// extract the grid coordinates from the match above and return the indices
	return {
		row : Number(matches[1]),
		column : Number(matches[2])
	};
}
