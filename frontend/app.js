const API_URL = "http://127.0.0.1:8000";

// =========================================================
// DOM ELEMENTS
// =========================================================

const totalTransactionsEl =
    document.getElementById("totalTransactions");

const fraudDetectedEl =
    document.getElementById("fraudDetected");

const legitimateTransactionsEl =
    document.getElementById("legitimateTransactions");

const fraudRateEl =
    document.getElementById("fraudRate");

const highRiskEl =
    document.getElementById("highRisk");

const mediumRiskEl =
    document.getElementById("mediumRisk");

const lowRiskEl =
    document.getElementById("lowRisk");

const transactionTable =
    document.getElementById("transactionTable");

const transactionCountEl =
    document.getElementById("transactionCount");

const refreshBtn =
    document.getElementById("refreshBtn");

const transactionForm =
    document.getElementById("transactionForm");

const featuresGrid =
    document.getElementById("featuresGrid");

const predictionResult =
    document.getElementById("predictionResult");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const sampleBtn =
    document.getElementById("sampleBtn");

const fraudSampleBtn =
    document.getElementById("fraudSampleBtn");

// =========================================================
// DISABLE BROWSER NATIVE VALIDATION
// =========================================================

if (transactionForm) {
    transactionForm.noValidate = true;
}


// =========================================================
// FETCH DASHBOARD DATA
// =========================================================

async function loadDashboard() {

    try {

        setLoadingState();

        const response = await fetch(
            `${API_URL}/dashboard`
        );

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Dashboard data:", data);

        updateDashboard(data);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showError();
    }
}


// =========================================================
// UPDATE DASHBOARD
// =========================================================

function updateDashboard(data) {

    const overview = data.overview || {};

    // -----------------------------------------------------
    // KPI CARDS
    // -----------------------------------------------------

    totalTransactionsEl.textContent =
        overview.total_transactions ?? 0;

    fraudDetectedEl.textContent =
        overview.fraud_detected ?? 0;

    legitimateTransactionsEl.textContent =
        overview.legitimate_transactions ?? 0;

    fraudRateEl.textContent =
        `${Number(
            overview.fraud_rate ?? 0
        ).toFixed(2)}%`;


    // -----------------------------------------------------
    // RISK DISTRIBUTION
    // -----------------------------------------------------

    const riskDistribution =
        data.risk_distribution || {};

    highRiskEl.textContent =
        riskDistribution.high ?? 0;

    mediumRiskEl.textContent =
        riskDistribution.medium ?? 0;

    lowRiskEl.textContent =
        riskDistribution.low ?? 0;


    // -----------------------------------------------------
    // RECENT TRANSACTIONS
    // -----------------------------------------------------

    const transactions =
        data.recent_transactions || [];

    transactionCountEl.textContent =
        `${transactions.length} transaction${
            transactions.length === 1
                ? ""
                : "s"
        }`;

    renderTransactions(transactions);
}


// =========================================================
// RENDER TRANSACTIONS
// =========================================================

function renderTransactions(transactions) {

    if (!transactions.length) {

        transactionTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No transactions available
                </td>
            </tr>
        `;

        return;
    }


    transactionTable.innerHTML =
        transactions.map(transaction => {

            const probability =
                Number(
                    transaction.fraud_probability ?? 0
                ) * 100;

            const prediction =
                transaction.prediction || "UNKNOWN";

            const risk =
                transaction.risk_level || "LOW";


            // -------------------------------------------------
            // PREDICTION CSS CLASS
            // -------------------------------------------------

            const predictionClass =
                prediction === "FRAUD"
                    ? "prediction-fraud"
                    : "prediction-legitimate";


            // -------------------------------------------------
            // RISK CSS CLASS
            // -------------------------------------------------

            const riskClass =
                risk === "HIGH"
                    ? "risk-high"
                    : risk === "MEDIUM"
                        ? "risk-medium"
                        : "risk-low";


            return `
                <tr>

                    <td>
                        #${transaction.transaction_id ?? "-"}
                    </td>

                    <td>
                        $${Number(
                            transaction.amount ?? 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${probability.toFixed(2)}%
                    </td>

                    <td>
                        <span
                            class="prediction-badge ${predictionClass}"
                        >
                            ${prediction}
                        </span>
                    </td>

                    <td>
                        <span
                            class="risk-badge ${riskClass}"
                        >
                            ${risk}
                        </span>
                    </td>

                </tr>
            `;

        }).join("");
}


// =========================================================
// LOADING STATE
// =========================================================

function setLoadingState() {

    if (!transactionTable) return;

    transactionTable.innerHTML = `
        <tr>
            <td colspan="5" class="empty-state">
                Loading transactions...
            </td>
        </tr>
    `;
}


// =========================================================
// ERROR STATE
// =========================================================

function showError() {

    if (!transactionTable) return;

    transactionTable.innerHTML = `
        <tr>
            <td colspan="5" class="empty-state">
                Unable to connect to fraud detection API.
            </td>
        </tr>
    `;
}


// =========================================================
// REFRESH BUTTON
// =========================================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async () => {

            refreshBtn.disabled = true;

            refreshBtn.textContent =
                "↻ Loading...";

            await loadDashboard();

            refreshBtn.disabled = false;

            refreshBtn.textContent =
                "↻ Refresh";
        }
    );
}


// =========================================================
// GENERATE V1 → V28 INPUTS
// =========================================================

if (featuresGrid) {

    for (let i = 1; i <= 28; i++) {

        // Avoid duplicate inputs if script gets loaded again
        if (document.getElementById(`V${i}`)) {
            continue;
        }

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "form-group";

        wrapper.innerHTML = `
            <label for="V${i}">
                V${i}
            </label>

            <input
                type="number"
                id="V${i}"
                step="any"
                value="0"
            >
        `;

        featuresGrid.appendChild(wrapper);
    }
}


// =========================================================
// HELPERS
// =========================================================

function getNumberValue(id) {

    const input =
        document.getElementById(id);

    if (!input) {
        return 0;
    }

    const rawValue =
        input.value.trim();

    // Empty field = 0
    if (rawValue === "") {
        return 0;
    }

    const value =
        Number(rawValue);

    return Number.isFinite(value)
        ? value
        : 0;
}


// =========================================================
// TRANSACTION FORM SUBMISSION
// =========================================================

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // -------------------------------------------------
            // BUTTON STATE
            // -------------------------------------------------

            if (analyzeBtn) {

                analyzeBtn.disabled = true;

                analyzeBtn.textContent =
                    "Analyzing...";
            }


            // -------------------------------------------------
            // BUILD TRANSACTION OBJECT
            // -------------------------------------------------

            const transaction = {

                Time:
                    getNumberValue("time"),

                Amount:
                    getNumberValue("amount")
            };


            // -------------------------------------------------
            // ADD V1 → V28
            // -------------------------------------------------

            for (let i = 1; i <= 28; i++) {

                transaction[`V${i}`] =
                    getNumberValue(`V${i}`);
            }


            console.log(
                "Transaction being sent:",
                transaction
            );


            try {

                // -------------------------------------------------
                // SEND TO FASTAPI
                // -------------------------------------------------

                const response =
                    await fetch(
                        `${API_URL}/predict`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    transaction
                                )
                        }
                    );


                // -------------------------------------------------
                // HANDLE API ERROR
                // -------------------------------------------------

                if (!response.ok) {

                    let errorMessage =
                        `API error: ${response.status}`;

                    try {

                        const errorData =
                            await response.json();

                        if (errorData.detail) {
                            errorMessage =
                                JSON.stringify(
                                    errorData.detail
                                );
                        }

                    } catch {
                        // Ignore JSON parsing error
                    }

                    throw new Error(
                        errorMessage
                    );
                }


                // -------------------------------------------------
                // READ PREDICTION
                // -------------------------------------------------

                const result =
                    await response.json();

                console.log(
                    "Prediction result:",
                    result
                );


                // -------------------------------------------------
                // SHOW RESULT
                // -------------------------------------------------

                showPredictionResult(
                    result
                );


                // -------------------------------------------------
                // REFRESH DASHBOARD
                // -------------------------------------------------

                await loadDashboard();

            } catch (error) {

                console.error(
                    "Prediction error:",
                    error
                );


                if (predictionResult) {

                    predictionResult.className =
                        "prediction-result error";

                    predictionResult.innerHTML = `
                        <h3>
                            Unable to analyze transaction
                        </h3>

                        <p>
                            ${error.message}
                        </p>
                    `;
                }

            } finally {

                // -------------------------------------------------
                // RESTORE BUTTON
                // -------------------------------------------------

                if (analyzeBtn) {

                    analyzeBtn.disabled = false;

                    analyzeBtn.textContent =
                        "Analyze Transaction";
                }
            }
        }
    );
}


// =========================================================
// SHOW PREDICTION RESULT
// =========================================================

function showPredictionResult(result) {

    if (!predictionResult) {
        return;
    }


    const probability =
        Number(
            result.fraud_probability ?? 0
        ) * 100;


    const prediction =
        result.prediction || "UNKNOWN";


    const riskLevel =
        result.risk_level || "LOW";


    const threshold =
        Number(
            result.threshold ?? 0
        ) * 100;


    const isFraud =
        prediction === "FRAUD";


    // -----------------------------------------------------
    // RESULT CONTAINER CLASS
    // -----------------------------------------------------

    predictionResult.className =
        `prediction-result ${
            isFraud
                ? "fraud"
                : "legitimate"
        }`;


    // -----------------------------------------------------
    // RESULT HTML
    // -----------------------------------------------------

    predictionResult.innerHTML = `

        <div class="result-header">

            <span class="result-label">
                ANALYSIS RESULT
            </span>

            <h2>
                ${prediction}
            </h2>

        </div>


        <div class="result-details">

            <div class="result-item">

                <span>
                    Fraud Probability
                </span>

                <strong>
                    ${probability.toFixed(2)}%
                </strong>

            </div>


            <div class="result-item">

                <span>
                    Risk Level
                </span>

                <strong>
                    ${riskLevel}
                </strong>

            </div>


            <div class="result-item">

                <span>
                    Detection Threshold
                </span>

                <strong>
                    ${threshold.toFixed(2)}%
                </strong>

            </div>

        </div>
    `;
}


// =========================================================
// INITIALIZE EMPTY INPUTS
// =========================================================

function initializeInputs() {

    if (!transactionForm) {
        return;
    }


    const inputs =
        transactionForm.querySelectorAll(
            'input[type="number"]'
        );


    inputs.forEach(input => {

        if (input.value.trim() === "") {

            input.value =
                input.defaultValue || "0";
        }

    });
}


// =========================================================
// INITIAL LOAD
// =========================================================

initializeInputs();

loadDashboard();

// =========================================================
// LOAD REAL SAMPLE TRANSACTION
// =========================================================

sampleBtn.addEventListener("click", async () => {

    sampleBtn.disabled = true;
    sampleBtn.textContent = "Loading...";

    try {

        const response = await fetch(
            `${API_URL}/sample-transaction`
        );

        if (!response.ok) {
            throw new Error(
                `Sample API error: ${response.status}`
            );
        }

        const transaction = await response.json();

        // Fill Time
        document.getElementById("time").value =
            transaction.Time;

        // Fill Amount
        document.getElementById("amount").value =
            transaction.Amount;

        // Fill V1 - V28
        for (let i = 1; i <= 28; i++) {

            document.getElementById(`V${i}`).value =
                transaction[`V${i}`];

        }

        console.log(
            "Sample transaction loaded:",
            transaction
        );

    } catch (error) {

        console.error(
            "Sample transaction error:",
            error
        );

        alert(
            "Unable to load sample transaction."
        );

    } finally {

        sampleBtn.disabled = false;
        sampleBtn.textContent =
            "Load Sample Transaction";

    }
});


// =========================================================
// LOAD REAL FRAUD TRANSACTION
// =========================================================

fraudSampleBtn.addEventListener("click", async () => {

    fraudSampleBtn.disabled = true;
    fraudSampleBtn.textContent = "Loading Fraud...";

    try {

        const response = await fetch(
            `${API_URL}/sample-fraud-transaction`
        );

        if (!response.ok) {
            throw new Error(
                `Fraud sample API error: ${response.status}`
            );
        }

        const transaction = await response.json();

        // Fill Time
        document.getElementById("time").value =
            transaction.Time;

        // Fill Amount
        document.getElementById("amount").value =
            transaction.Amount;

        // Fill V1 - V28
        for (let i = 1; i <= 28; i++) {

            document.getElementById(`V${i}`).value =
                transaction[`V${i}`];

        }

        console.log(
            "Fraud transaction loaded:",
            transaction
        );

    } catch (error) {

        console.error(
            "Fraud transaction error:",
            error
        );

        alert(
            "Unable to load fraud transaction."
        );

    } finally {

        fraudSampleBtn.disabled = false;
        fraudSampleBtn.textContent =
            "Load Fraud Transaction";

    }
});

sampleBtn.addEventListener("click", async () => {
    try {
        sampleBtn.disabled = true;
        sampleBtn.textContent = "Loading...";

        const response = await fetch(
            `${API_URL}/sample-transaction`
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const transaction = await response.json();

        // Fill Amount
        document.getElementById("amount").value =
            transaction.Amount ?? 0;

        // Fill Time
        document.getElementById("time").value =
            transaction.Time ?? 0;

        // Fill V1 - V28
        for (let i = 1; i <= 28; i++) {
            document.getElementById(`V${i}`).value =
                transaction[`V${i}`] ?? 0;
        }

        console.log("Sample transaction loaded:", transaction);

    } catch (error) {
        console.error("Sample transaction error:", error);
        alert("Unable to load sample transaction.");

    } finally {
        sampleBtn.disabled = false;
        sampleBtn.textContent = "Load Sample Transaction";
    }
});
