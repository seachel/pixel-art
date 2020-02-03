export { _isDebug as isDebug, _writeDebug as writeDebug };
export const _isDebug = true;
export function _writeDebug(debugObject = {}, debugMessage = "(no message provided)") {
    if (_isDebug) {
        console.log(`***
		Debug note:
		${debugMessage}
		---
		${debugObject}
		***
		`);
    }
}
