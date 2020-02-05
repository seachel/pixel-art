import { Pattern } from './pattern.js';

// Core functions from the top-level module appropriate to use when writing tests

export function createNewPattern(patternHeight : number, patternWidth : number, onCellClick : (e) => void) : Pattern
{
	return new Pattern(patternHeight, patternWidth, onCellClick);
}

