import { defaults } from './application-constants.js';
export { _ProgramState as ProgramState };
// -------
// Program state
// -------
export class _ProgramState {
    constructor(createNewPattern) {
        // set the display pattern
        this.createNewPattern = createNewPattern;
        this.createNewPattern();
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
