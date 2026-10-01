const USE_MOCK_RESPONSE = true;

const form = document.querySelector("#analyzer-form");
const languageInput = document.querySelector("#language");
const codeInput = document.querySelector("#code");
const errorInput = document.querySelector("#error");
const analyzeButton = document.querySelector("#analyze-button");
const buttonLabel = analyzeButton.querySelector(".button-label");
const spinner = analyzeButton.querySelector(".spinner");
const clearButton = document.querySelector("#clear-button");
const formMessage = document.querySelector("#form-message");
const results = document.querySelector("#results");
const readyState = document.querySelector("#ready-state");
const copyButton = document.querySelector("#copy-button");
const copyMessage = document.querySelector("#copy-message");
const fixedCode = document.querySelector("#result-fixed-code");
const editorLanguage = document.querySelector("#editor-language");

languageInput.addEventListener("change", () => {
	editorLanguage.textContent = languageInput.value.toUpperCase();
});

function showResult(result) {
	document.querySelector("#result-error-type").textContent = result.error_type || "Not provided";
	document.querySelector("#result-cause").textContent = result.cause || "Not provided";
	document.querySelector("#result-explanation").textContent = result.explanation || "Not provided";
	document.querySelector("#result-solution").textContent = result.solution || "Not provided";
	document.querySelector("#result-changes").textContent = result.changes || "Not provided";
	fixedCode.textContent = result.fixed_code || "";
	results.hidden = false;
}

async function getDebugResult(requestData) {
	if (USE_MOCK_RESPONSE) {
		// Temporary mock: set USE_MOCK_RESPONSE to false and remove this branch when Flask is ready.
		await new Promise((resolve) => window.setTimeout(resolve, 650));
		return {
			error_type: "IndexError",
			cause: "The program is trying to access an index that does not exist.",
			explanation: "The list contains three elements, so valid indexes are 0, 1 and 2.",
			solution: "Use a valid index.",
			fixed_code: "print(numbers[2])",
			changes: "Changed the invalid index to a valid index."
		};
	}

	const response = await fetch("/debug", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(requestData)
	});

	if (!response.ok) {
		throw new Error("The debug request failed.");
	}

	return response.json();
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	formMessage.hidden = true;
	results.hidden = true;
	readyState.hidden = true;
	copyMessage.textContent = "";

	const requestData = {
		language: languageInput.value,
		code: codeInput.value.trim(),
		error: errorInput.value.trim()
	};

	if (!requestData.code || !requestData.error) {
		formMessage.textContent = "Enter both your code and the error message.";
		formMessage.hidden = false;
		return;
	}

	analyzeButton.disabled = true;
	clearButton.disabled = true;
	spinner.hidden = false;
	buttonLabel.textContent = "Analyzing...";
	analyzeButton.setAttribute("aria-busy", "true");

	try {
		const result = await getDebugResult(requestData);
		showResult(result);
		results.scrollIntoView({ behavior: "smooth", block: "start" });
	} catch (error) {
		formMessage.textContent = "Unable to analyze the code. Please try again.";
		formMessage.hidden = false;
		readyState.hidden = false;
	} finally {
		analyzeButton.disabled = false;
		clearButton.disabled = false;
		spinner.hidden = true;
		buttonLabel.textContent = "Analyze Error";
		analyzeButton.removeAttribute("aria-busy");
	}
});

clearButton.addEventListener("click", () => {
	form.reset();
	results.hidden = true;
	readyState.hidden = false;
	formMessage.hidden = true;
	copyMessage.textContent = "";
	document.querySelector("#result-error-type").textContent = "";
	document.querySelector("#result-cause").textContent = "";
	document.querySelector("#result-explanation").textContent = "";
	document.querySelector("#result-solution").textContent = "";
	document.querySelector("#result-changes").textContent = "";
	fixedCode.textContent = "";
	editorLanguage.textContent = languageInput.value.toUpperCase();
	languageInput.focus();
});

copyButton.addEventListener("click", async () => {
	try {
		await navigator.clipboard.writeText(fixedCode.textContent);
		copyMessage.textContent = "Code copied.";
	} catch (error) {
		copyMessage.textContent = "Copy is unavailable in this browser.";
	}
});
