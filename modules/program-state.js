import { defaults } from './application-constants.js';
// -------
// Program state
// -------
// encapsulating the current state of the program in a local variable
// accessor functions allow external modules to have controlled access to read and write to this value
var currentState;
export function setCurrentState(newState) {
    currentState = newState;
}
export function getCurrentState() {
    return currentState;
}
export class ProgramState {
    constructor(createPatternCallback) {
        // set the default value for whether or not we are in match mode for setting the brush
        this.isMatchSelection = false;
        // set the current brush to the default cell colour
        this.brush = defaults.cellColour;
        this.displayPattern = createPatternCallback();
    }
    get displayPattern() {
        return this._displayPattern;
    }
    set displayPattern(value) {
        // TODO: update view
        this._displayPattern = value;
    }
}
