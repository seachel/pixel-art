import { writeDebug } from './debug.js';

import { names, defaults } from './application-constants.js';
import { Pattern } from './pattern.js';
import { assertion } from './assertion.js';

// -------
// Program state
// -------

// encapsulating the current state of the program in a local variable
// accessor functions allow external modules to have controlled access to read and write to this value
var currentState : ProgramState;
export function setCurrentState(newState : ProgramState) : void
{
	currentState = newState;
}
export function getCurrentState() : ProgramState
{
	return currentState;
}

export class ProgramState
{
	private _displayPattern : Pattern;
	get displayPattern() : Pattern
	{
		return this._displayPattern;
	}
	set displayPattern(value : Pattern)
	{
		this._displayPattern = value;

		// TODO: create new
	}

	isMatchSelection : Boolean;
	brush : string;

	constructor(createPatternCallback : () => Pattern)
	{
		// set the default value for whether or not we are in match mode for setting the brush
		this.isMatchSelection = false;

		// set the current brush to the default cell colour
		this.brush = defaults.cellColour;

		this.displayPattern = createPatternCallback();
	}
}
