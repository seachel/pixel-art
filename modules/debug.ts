export { writeDebug };

const isDebug = true;

function writeDebug(debugObject = {}, debugMessage = "(no message provided)")
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