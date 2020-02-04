import { defaults } from './application-constants.js';
export { ProgramState };
// -------
// Program state
// -------
class ProgramState {
    constructor() {
        // set the default value for whether or not we are in match mode for setting the brush
        this.isMatchSelection = false;
        // set the current brush to the default cell colour
        this.brush = defaults.cellColour;
    }
    get displayPattern() {
        return this._displayPattern;
    }
    set displayPattern(value) {
        // TODO: update view
        this._displayPattern = value;
    }
}
