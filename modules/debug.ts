export { _writeDebug as writeDebug };

const isDebug = true;

export function _writeDebug(debugObject = {}, debugMessage = "(no message provided)")
{
	if (isDebug)
	{
		console.log(`***
		Debug note:
		${debugMessage}
		---
		${debugObject}
		***
		`);
	}
}