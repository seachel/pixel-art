export { _isDebug as isDebug, _writeDebug as writeDebug };

export const _isDebug = true;

export function _writeDebug(debugMessage, debugObject)
{
	console.log(`***
	Debug note:
	${debugMessage}
	---
	${debugObject}
	***
	`);
}