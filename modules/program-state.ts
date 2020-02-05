import { writeDebug } from './debug.js';

import { names, defaults } from './application-constants.js';
import { Pattern } from './pattern.js';
import { assertion } from './assertion.js';

// -------
// Program state
// -------

export class ProgramState
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

	constructor(createPatternCallback : () => Pattern)
	{
		// set the default value for whether or not we are in match mode for setting the brush
		this.isMatchSelection = false;

		// set the current brush to the default cell colour
		this.brush = defaults.cellColour;

		this.displayPattern = createPatternCallback();
	}
}
