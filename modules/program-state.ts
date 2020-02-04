import { writeDebug } from './debug.js';

import { names, defaults } from './application-constants.js';
import { Pattern } from './pattern.js';
import { assertion } from './assertion.js';

export { ProgramState };

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

	createNewPattern : () => void;
	isMatchSelection : Boolean;
	brush : string;

	constructor(createNewPattern)
	{
		// set the display pattern
		this.createNewPattern = createNewPattern;
		this.createNewPattern();

		// set the default value for whether or not we are in match mode for setting the brush
		this.isMatchSelection = false;

		// set the current brush to the default cell colour
		this.brush = defaults.cellColour;
	}
}
