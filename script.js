// These rules are stored locally, so the analyzer works offline and needs no API.
// Each language has named errors; C and C++ use practical message-pattern rules.
const ERROR_RULES = {
  Python: {
    NameError: {
      patterns: [/\bNameError\b/i, /\bname\s+['"`]?\w+['"`]?\s+is not defined/i],
      cause: "The code uses a variable or function name that Python cannot find.",
      explanation: "Python names are case-sensitive and must be defined before they are used.",
      solution: "Check the spelling and capitalization, then define the name before using it."
    },
    TypeError: {
      patterns: [/\bTypeError\b/i],
      cause: "An operation or function received a value of an incompatible type.",
      explanation: "Python cannot perform some operations on certain combinations of values, such as adding a number to a string.",
      solution: "Check the types of the values involved and convert them to compatible types where appropriate."
    },
    IndexError: {
      patterns: [/\bIndexError\b/i, /\blist index out of range\b/i, /\bstring index out of range\b/i],
      cause: "The program is trying to access a list or sequence position that does not exist.",
      explanation: "The index is outside the valid range of the sequence. Python indexes start at 0.",
      solution: "Check the sequence length and use a valid index, from 0 through len(sequence) - 1."
    },
    KeyError: {
      patterns: [/\bKeyError\b/i],
      cause: "The code tried to access a dictionary key that is not present.",
      explanation: "Using dictionary[key] raises KeyError when the key has not been added to the dictionary.",
      solution: "Check that the key exists first, or use dictionary.get(key) when a default is appropriate."
    },
    SyntaxError: {
      patterns: [/\bSyntaxError\b/i, /\binvalid syntax\b/i],
      cause: "Python could not parse the code because its syntax is incomplete or invalid.",
      explanation: "A SyntaxError happens before the program runs. Common causes include a missing colon, unmatched brackets, and indentation mistakes.",
      solution: "Review the reported line and the lines around it for missing punctuation, brackets, or indentation."
    },
    ZeroDivisionError: {
      patterns: [/\bZeroDivisionError\b/i, /\bdivision by zero\b/i],
      cause: "The program attempted to divide a number by zero.",
      explanation: "Division by zero is undefined, so Python raises ZeroDivisionError instead of producing a result.",
      solution: "Check that the divisor is not zero before dividing, and decide what the program should do when it is."
    },
    AttributeError: {
      patterns: [/\bAttributeError\b/i, /\bhas no attribute\b/i],
      cause: "The code tried to use an attribute or method that the value does not have.",
      explanation: "The value may be a different type than expected, or the attribute name may be misspelled.",
      solution: "Check the value's type and available attributes, and verify the spelling of the attribute or method."
    }
  },
  JavaScript: {
    ReferenceError: {
      patterns: [/\bReferenceError\b/i, /\bis not defined\b/i],
      cause: "The code refers to a variable or function that has not been declared in the current scope.",
      explanation: "JavaScript cannot resolve the identifier. Names are case-sensitive and scope affects where they are available.",
      solution: "Check the name's spelling and scope, and declare it with let or const before using it."
    },
    TypeError: {
      patterns: [/\bTypeError\b/i, /\bcannot read propert(?:y|ies) of\b/i, /\bundefined is not a function\b/i],
      cause: "The code tried to perform an operation that is not valid for the value's type.",
      explanation: "This often happens when calling something that is not a function or accessing a property on null or undefined.",
      solution: "Check the value before using it and confirm that it supports the property or operation."
    },
    SyntaxError: {
      patterns: [/\bSyntaxError\b/i, /\bUnexpected token\b/i, /\bmissing\s*[;){}\]]/i],
      cause: "JavaScript could not parse the code because its syntax is incomplete or invalid.",
      explanation: "The JavaScript engine found unexpected or missing punctuation while reading the code.",
      solution: "Review the reported line and nearby lines for unmatched brackets, quotes, commas, or semicolons."
    }
  },
  Java: {
    NullPointerException: {
      patterns: [/\bNullPointerException\b/i, /\bCannot invoke\b.*\bbecause\b.*\bis null\b/i],
      cause: "The code tried to use an object reference whose value is null.",
      explanation: "Java cannot call a method or access an instance field through a null reference.",
      solution: "Initialize the object before using it, or check that it is not null first."
    },
    ArrayIndexOutOfBoundsException: {
      patterns: [/\bArrayIndexOutOfBoundsException\b/i, /\bIndex\s+\d+\s+out of bounds for length\b/i],
      cause: "The code tried to access an array position outside the array's bounds.",
      explanation: "Java array indexes start at 0 and must be less than the array length.",
      solution: "Check the array length and use an index from 0 through array.length - 1."
    },
    NumberFormatException: {
      patterns: [/\bNumberFormatException\b/i, /\bFor input string\b/i],
      cause: "The program tried to convert text that is not a valid number into a numeric value.",
      explanation: "Methods such as Integer.parseInt require a string containing a number in the expected format.",
      solution: "Validate the input before parsing it, and handle invalid values with a try/catch block."
    }
  },
  C: {
    "Missing semicolon": {
      patterns: [/\bexpected\s+.{0,12};.{0,30}(?:before|at end)/i, /\bexpected\s+semicolon\b/i, /\bmissing\s+semicolon\b/i],
      cause: "A statement may be missing its terminating semicolon.",
      explanation: "C statements usually end with a semicolon. A missing one can cause a compiler error at the next token.",
      solution: "Check the reported line and add a semicolon at the end of the statement if it is missing."
    },
    "Undeclared identifier": {
      patterns: [/\bundeclared\b/i, /\bwas not declared in this scope\b/i, /\bunknown type name\b/i],
      cause: "The code uses a variable, function, or type that has not been declared or included.",
      explanation: "The compiler cannot find a declaration for this name at the point where it is used.",
      solution: "Check spelling, declare the name before use, and include the correct header when needed."
    },
    "Linker error": {
      patterns: [/\bundefined reference to\b/i, /\bunresolved external symbol\b/i],
      cause: "The code refers to a function or symbol that the linker could not find.",
      explanation: "Compilation may have succeeded, but a required function definition or library was not linked.",
      solution: "Provide the missing function definition and check that all required source files and libraries are included in the build."
    },
    "Segmentation fault": {
      patterns: [/\bsegmentation fault\b/i, /\baccess violation\b/i, /\bnull pointer dereference\b/i],
      cause: "The program tried to access memory it is not allowed to use.",
      explanation: "This can happen when dereferencing a null or invalid pointer, or when accessing memory outside an object.",
      solution: "Check pointer values before dereferencing and verify that array indexes and memory lifetimes are valid."
    },
    "Type conversion error": {
      patterns: [/\binvalid conversion\b/i, /\bcannot convert\b/i, /\bincompatible type\b/i],
      cause: "A value is being used where a different, incompatible type is expected.",
      explanation: "The compiler cannot safely convert the expression to the required type.",
      solution: "Check the types on both sides of the operation and use an appropriate conversion only when it is safe."
    },
    "Compilation syntax error": {
      patterns: [/\berror:\s*(?:expected|stray|missing)\b/i, /\bexpected\s+(?:expression|identifier|primary-expression)\b/i],
      cause: "The compiler found incomplete or invalid syntax in the source code.",
      explanation: "C compiler messages often point to the token where parsing became impossible, which may be just after the actual mistake.",
      solution: "Inspect the reported line and the line before it for missing punctuation, unmatched brackets, or a misspelled keyword."
    }
  },
  "C++": {
    "Missing semicolon": {
      patterns: [/\bexpected\s+.{0,12};.{0,30}(?:before|at end)/i, /\bexpected\s+semicolon\b/i, /\bmissing\s+semicolon\b/i],
      cause: "A statement or declaration may be missing its terminating semicolon.",
      explanation: "C++ statements and class declarations commonly end with semicolons; the compiler may report the error at a later token.",
      solution: "Check the reported line and the line immediately before it for a missing semicolon."
    },
    "Undeclared identifier": {
      patterns: [/\bnot declared in this scope\b/i, /\bundeclared\b/i, /\bwas not declared\b/i],
      cause: "The code uses a name that has not been declared or is not visible in this scope.",
      explanation: "C++ requires identifiers to be declared before they are used, and scope controls where declarations are visible.",
      solution: "Check the spelling and scope, declare the name before use, and include the correct header if needed."
    },
    "Linker error": {
      patterns: [/\bundefined reference to\b/i, /\bunresolved external symbol\b/i, /\bLNK\d{4}\b/i],
      cause: "The linker cannot find a required function definition or symbol.",
      explanation: "The declaration may exist, but the corresponding implementation or library was not linked.",
      solution: "Add the source file containing the definition and check the required linker libraries."
    },
    "Segmentation fault": {
      patterns: [/\bsegmentation fault\b/i, /\baccess violation\b/i, /\bnull pointer dereference\b/i],
      cause: "The program tried to read or write memory through an invalid address.",
      explanation: "Common causes include invalid pointers, out-of-bounds access, and using an object after its lifetime.",
      solution: "Validate pointers and indexes before use, and ensure objects remain alive for as long as they are accessed."
    },
    "Type conversion error": {
      patterns: [/\binvalid conversion\b/i, /\bcannot convert\b/i, /\bno known conversion\b/i],
      cause: "The code is using a value of a type that cannot be converted to the required type.",
      explanation: "The compiler could not find a valid conversion for the expression or function argument.",
      solution: "Check the expected and actual types, then use a compatible value or an explicit safe conversion."
    },
    "Compilation syntax error": {
      patterns: [/\berror:\s*(?:expected|stray|missing)\b/i, /\bexpected\s+(?:expression|identifier|primary-expression)\b/i],
      cause: "The compiler found incomplete or invalid syntax in the source code.",
      explanation: "Compiler syntax errors point to where parsing failed, which can be after the missing punctuation or typo.",
      solution: "Inspect the reported line and the line before it for missing punctuation, unmatched brackets, or a misspelled keyword."
    }
  }
};

const form = document.querySelector("#analyzer-form");
const languageSelect = document.querySelector("#language");
const codeInput = document.querySelector("#code-input");
const errorInput = document.querySelector("#error-input");
const analyzeButton = document.querySelector("#analyze-button");
const clearButton = document.querySelector("#clear-button");
const formMessage = document.querySelector("#form-message");
const resultsSection = document.querySelector("#results-section");
const copyButton = document.querySelector("#copy-button");
const copyMessage = document.querySelector("#copy-message");
const editorLanguage = document.querySelector("#editor-language");

// Update the editor's language hint whenever the dropdown selection changes.
languageSelect.addEventListener("change", () => {
  editorLanguage.textContent = languageSelect.value.toUpperCase();
});

// Search only the selected language's rules and return the first matching type.
function detectErrorType(message, language) {
  const rules = ERROR_RULES[language];
  if (!rules) return null;

  return Object.keys(rules).find((type) =>
    rules[type].patterns.some((pattern) => pattern.test(message))
  ) || null;
}

// Calculate how many single-character edits separate two names for typo hints.
function getEditDistance(first, second) {
  const row = Array.from({ length: second.length + 1 }, (_, index) => index);

  for (let i = 1; i <= first.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= second.length; j += 1) {
      const above = row[j];
      const cost = first[i - 1].toLowerCase() === second[j - 1].toLowerCase() ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + cost);
      diagonal = above;
    }
  }

  return row[second.length];
}

// Change code only for fixes that can be inferred with reasonable confidence.
function suggestCodeFix(code, language, errorType, message) {
  if (language === "Python" && errorType === "SyntaxError") {
    let changed = false;
    const fixedCode = code.split("\n").map((line) => {
      const blockHeader = line.match(/^(\s*(?:if|elif|else|for|while|def|class|try|except|finally|with)\b.*?)(\s+#.*)?$/);
      if (!blockHeader || blockHeader[1].trimEnd().endsWith(":")) return line;
      changed = true;
      return `${blockHeader[1].trimEnd()}:${blockHeader[2] || ""}`;
    }).join("\n");

    if (changed) {
      return { code: fixedCode, changes: "Added a colon to a Python block header that was missing one." };
    }
  }

  if ((language === "Python" && errorType === "NameError")
      || (language === "JavaScript" && errorType === "ReferenceError")) {
    const nameMatch = message.match(/(?:name\s+)?['"`]([A-Za-z_$][\w$]*)['"`]\s+is not defined/i)
      || message.match(/\b([A-Za-z_$][\w$]*) is not defined\b/i);
    if (nameMatch) {
      const missingName = nameMatch[1];
      const declarationPattern = language === "Python"
        ? /^\s*(?:def|class|for|with|import|from)\s+([A-Za-z_]\w*)|^\s*([A-Za-z_]\w*)\s*=|^\s*([A-Za-z_]\w*)\s*[:,)]/gm
        : /\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)\b/g;
      const declaredNames = new Set();
      let match;

      while ((match = declarationPattern.exec(code)) !== null) {
        const declaredName = match.slice(1).find(Boolean);
        if (declaredName) declaredNames.add(declaredName);
      }

      const closestName = [...declaredNames]
        .map((name) => ({ name, distance: getEditDistance(missingName, name) }))
        .sort((a, b) => a.distance - b.distance)[0];
      const allowedDistance = Math.max(1, Math.floor(missingName.length * 0.34));

      if (closestName && closestName.distance > 0 && closestName.distance <= allowedDistance) {
        const escapedName = missingName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const fixedCode = code.replace(new RegExp(`\\b${escapedName}\\b`, "g"), closestName.name);
        return {
          code: fixedCode,
          changes: `Replaced "${missingName}" with the similarly named "${closestName.name}" declared in your code. Review this suggestion before using it.`
        };
      }
    }
  }

  return {
    code,
    changes: "No automatic code change was made because the correct fix depends on your program's intended behavior."
  };
}

// Fill the existing result fields safely using textContent, not HTML insertion.
function displayResults(language, code, message) {
  const errorType = detectErrorType(message, language);
  const rule = errorType ? ERROR_RULES[language][errorType] : null;
  const unknownExplanation = ERROR_RULES[language]
    ? "This error is not currently in the rule database. The message may use a different format or describe an unsupported error."
    : `Rules for ${language} are not included yet. This error is not currently in the rule database.`;
  const fix = rule
    ? suggestCodeFix(code, language, errorType, message)
    : { code, changes: "The original code is shown unchanged because no matching rule was found." };

  document.querySelector("#result-error-type").textContent = errorType || "Unknown Error";
  document.querySelector("#result-cause").textContent = rule
    ? rule.cause
    : "The error message did not match a supported pattern for the selected language.";
  document.querySelector("#result-explanation").textContent = rule
    ? rule.explanation
    : unknownExplanation;
  document.querySelector("#result-solution").textContent = rule
    ? rule.solution
    : "Read the complete error message, inspect the reported line and nearby code, and check spelling, values, and program state.";
  document.querySelector("#fixed-code").textContent = fix.code;
  document.querySelector("#result-changes").textContent = fix.changes;
  copyMessage.hidden = true;
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Prevent empty submissions, then show a short loading state before analysis.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.hidden = true;
  formMessage.textContent = "";

  if (!codeInput.value.trim()) {
    formMessage.textContent = "Please paste your code before analyzing.";
    formMessage.hidden = false;
    codeInput.focus();
    return;
  }

  if (!errorInput.value.trim()) {
    formMessage.textContent = "Please paste the error message before analyzing.";
    formMessage.hidden = false;
    errorInput.focus();
    return;
  }

  const buttonLabel = analyzeButton.querySelector(".button-label");
  const originalLabel = buttonLabel.textContent;
  analyzeButton.disabled = true;
  buttonLabel.textContent = "Analyzing...";

  window.setTimeout(() => {
    try {
      displayResults(languageSelect.value, codeInput.value, errorInput.value);
    } catch (error) {
      formMessage.textContent = "Analysis could not be completed. Please check your input and try again.";
      formMessage.hidden = false;
      console.error("Error analysis failed:", error);
    } finally {
      analyzeButton.disabled = false;
      buttonLabel.textContent = originalLabel;
    }
  }, 400);
});

// Reset inputs, validation messages, and results to their initial state.
clearButton.addEventListener("click", () => {
  form.reset();
  editorLanguage.textContent = languageSelect.value.toUpperCase();
  formMessage.hidden = true;
  formMessage.textContent = "";
  resultsSection.hidden = true;
  copyMessage.hidden = true;
  codeInput.focus();
});

// Copy the displayed suggestion and show a useful message if clipboard access fails.
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector("#fixed-code").textContent);
    copyMessage.textContent = "Fixed code copied to your clipboard.";
  } catch (error) {
    copyMessage.textContent = "Clipboard access is unavailable. Select and copy the code above.";
  }
  copyMessage.hidden = false;
});
