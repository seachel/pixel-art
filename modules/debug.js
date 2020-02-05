export { writeDebug };
const isDebug = true;
function writeDebug(debugObject = {}, debugMessage = "(no message provided)") {
    if (isDebug) {
        console.log(`***
		Debug note:
		${debugMessage}
		---
		${debugObject}
		***
		`);
    }
}
// Note: used for testing
export function write(thingToWrite) {
    let dumpElement = document.getElementById("dump");
    dumpElement.textContent += "\n" + thingToWrite;
}
