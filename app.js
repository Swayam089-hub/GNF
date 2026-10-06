let grammar = {};
let nonTerminals = new Set();

function parseGrammar(text) {

    grammar = {};
    nonTerminals = new Set();

    const lines = text
        .split("\n")
        .map(x => x.trim())
        .filter(x => x.length > 0);

    for (let line of lines) {

        line = line.replace(/→/g, "->");

        const parts = line.split("->");

        if (parts.length !== 2) {
            continue;
        }

        const lhs = parts[0].trim();

        const rhs = parts[1]
            .split("|")
            .map(x => x.trim())
            .filter(x => x.length > 0);

        grammar[lhs] = rhs;
        nonTerminals.add(lhs);
    }

    return grammar;
}

function showGrammar(g, elementId) {

    const element = document.getElementById(elementId);

    element.innerHTML = "";

    for (let nt in g) {

        const div = document.createElement("div");

        div.className = "production";

        div.innerHTML =
            "<strong>" + nt + " → </strong>" +
            g[nt].join(" | ");

        element.appendChild(div);
    }
}

function createMatrix() {

    const table = document.getElementById("matrixTable");

    table.innerHTML = "";

    const nts = Array.from(nonTerminals);

    let header = "<tr><th>Variable</th>";

    nts.forEach(nt => {
        header += "<th>" + nt + "</th>";
    });

    header += "</tr>";

    table.innerHTML += header;

    nts.forEach(row => {

        let tr = "<tr>";
        tr += "<th>" + row + "</th>";

        nts.forEach(col => {

            let value = "∅";

            if (row === col && grammar[row]) {
                value = grammar[row].join(" | ");
            }

            tr += "<td>" + value + "</td>";
        });

        tr += "</tr>";

        table.innerHTML += tr;
    });
}

function isNonTerminal(symbol) {
    return nonTerminals.has(symbol);
}

function firstSymbol(production) {

    if (!production) return "";

    return production.trim().charAt(0);
}

function substituteLeadingVariables() {

    let result = {};

    for (let nt in grammar) {
        result[nt] = [...grammar[nt]];
    }

    let steps = [];

    let changed = true;
    let iteration = 0;

    while (changed && iteration < 20) {

        changed = false;
        iteration++;

        for (let A in result) {

            let newProductions = [];

            for (let prod of result[A]) {

                let first = firstSymbol(prod);

                if (isNonTerminal(first) && result[first]) {

                    changed = true;

                    for (let replacement of result[first]) {

                        newProductions.push(
                            replacement + prod.substring(1)
                        );
                    }

                    steps.push({
                        variable: A,
                        old: prod,
                        replacement: first
                    });

                } else {

                    newProductions.push(prod);
                }
            }

            result[A] = removeDuplicates(newProductions);
        }
    }

    return {
        grammar: result,
        steps: steps
    };
}

function removeDuplicates(arr) {
    return [...new Set(arr)];
}

function validateGNF(g) {

    let results = [];
    let valid = true;

    for (let A in g) {

        for (let production of g[A]) {

            const first = firstSymbol(production);

            const startsWithTerminal = !isNonTerminal(first);

            const remaining = production.substring(1);

            let remainingValid = true;

            for (let ch of remaining) {

                if (!isNonTerminal(ch)) {

                    remainingValid = false;
                    break;
                }
            }

            const ruleValid =
                startsWithTerminal && remainingValid;

            results.push({
                rule: A + " → " + production,
                valid: ruleValid
            });

            if (!ruleValid) {
                valid = false;
            }
        }
    }

    return {
        valid: valid,
        results: results
    };
}

function convertGNF() {

    const input =
        document.getElementById("grammarInput").value.trim();

    if (!input) {

        alert("Please enter a CFG first.");

        return;
    }

    parseGrammar(input);

    document.getElementById("output")
        .classList.remove("hidden");

    showGrammar(grammar, "originalGrammar");

    createMatrix();

    const transformation =
        substituteLeadingVariables();

    const finalGrammar =
        transformation.grammar;

    showSteps(transformation.steps);

    showGrammar(finalGrammar, "finalGrammar");

    const validation =
        validateGNF(finalGrammar);

    showValidation(validation);
}

function showSteps(steps) {

    const container =
        document.getElementById("steps");

    container.innerHTML = "";

    if (steps.length === 0) {

        container.innerHTML =
            `<div class="info">
            No leading-variable substitution was required.
            </div>`;

        return;
    }

    steps.forEach((step, index) => {

        const div =
            document.createElement("div");

        div.className = "step";

        div.innerHTML = `
            <div class="step-title">
                Step ${index + 1}
            </div>

            <div>
                <strong>${step.variable}</strong>
                → ${step.old}
            </div>

            <div style="margin-top:6px;">
                Substitute productions of
                <strong>${step.replacement}</strong>
            </div>
        `;

        container.appendChild(div);
    });
}

function showValidation(validation) {

    const container =
        document.getElementById("validation");

    container.innerHTML = "";

    validation.results.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            item.valid ? "success" : "warning";

        div.style.marginBottom = "8px";

        div.innerHTML =
            item.valid
            ? "✓ " + item.rule + " — Valid GNF"
            : "✗ " + item.rule + " — Not GNF";

        container.appendChild(div);
    });

    const summary =
        document.createElement("div");

    summary.style.marginTop = "15px";

    if (validation.valid) {

        summary.className = "success";

        summary.innerHTML =
            "✓ SUCCESS: The resulting grammar satisfies the GNF terminal-first condition.";

    } else {

        summary.className = "warning";

        summary.innerHTML =
            "⚠ Some productions are still not in GNF. More transformation is required.";
    }

    container.appendChild(summary);
}

function loadExample() {

    document.getElementById("grammarInput").value =
`S -> AB
A -> aA | a
B -> bB | b`;

}

function resetAll() {

    document.getElementById("grammarInput").value = "";

    document.getElementById("output")
        .classList.add("hidden");

    grammar = {};

    nonTerminals = new Set();
}

let deferredInstallPrompt;
const installBtn=document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;installBtn.style.display="inline-block";});
installBtn?.addEventListener("click",async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;installBtn.style.display="none";});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
function downloadResult(){const final=document.getElementById("finalGrammar");if(!final||!final.innerText.trim()){alert("Please convert a grammar first.");return;}const text="Greibach Normal Form Converter\n\nOriginal Grammar:\n"+document.getElementById("originalGrammar").innerText+"\n\nFinal GNF:\n"+final.innerText+"\n\nValidation:\n"+document.getElementById("validation").innerText;const blob=new Blob([text],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="GNF_Result.txt";a.click();URL.revokeObjectURL(a.href);}