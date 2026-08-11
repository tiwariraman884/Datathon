const API_URL = "http://127.0.0.1:8000";

// =========================================================
// THEME TOGGLE
// =========================================================

(function initTheme() {
    const html        = document.documentElement;
    const btn         = document.getElementById("themeToggleBtn");
    const STORAGE_KEY = "cs-theme";

    // Apply saved theme immediately (before paint) to avoid flash
    const saved = localStorage.getItem(STORAGE_KEY) || "dark";
    html.setAttribute("data-theme", saved);
    if (btn) btn.textContent = saved === "light" ? "☀️" : "🌙";

    if (!btn) return;

    btn.addEventListener("click", () => {
        const current = html.getAttribute("data-theme") || "dark";
        const next    = current === "dark" ? "light" : "dark";

        html.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE_KEY, next);

        // Spin animation
        btn.style.transform = "scale(0.85) rotate(360deg)";
        btn.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
        btn.textContent = next === "light" ? "☀️" : "🌙";

        setTimeout(() => {
            btn.style.transform = "";
            btn.style.transition = "";
        }, 420);
    });
})();


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
// DOCUMENT VERIFICATION ELEMENTS
// =========================================================

const documentFile =
    document.getElementById("documentFile");

const documentSelectBtn =
    document.getElementById("documentSelectBtn");

const verifyDocumentBtn =
    document.getElementById("verifyDocumentBtn");

const removeDocumentBtn =
    document.getElementById("removeDocumentBtn");

const documentDropZone =
    document.getElementById("documentDropZone");

const selectedDocument =
    document.getElementById("selectedDocument");

const documentFileName =
    document.getElementById("documentFileName");

const documentFileSize =
    document.getElementById("documentFileSize");

const documentVerificationResult =
    document.getElementById(
        "documentVerificationResult"
    );

const documentVerificationDetails =
    document.getElementById(
        "documentVerificationDetails"
    );

const documentEngineStatus =
    document.getElementById(
        "documentEngineStatus"
    );

const documentStatusBadge =
    document.getElementById(
        "documentStatusBadge"
    );

const documentScore =
    document.getElementById(
        "documentScore"
    );

const documentVerificationMessage =
    document.getElementById(
        "documentVerificationMessage"
    );

const resultFileName =
    document.getElementById(
        "resultFileName"
    );

const resultDocumentType =
    document.getElementById(
        "resultDocumentType"
    );

const resultDocumentSize =
    document.getElementById(
        "resultDocumentSize"
    );

const resultDocumentHash =
    document.getElementById(
        "resultDocumentHash"
    );    

// =========================================================
// NEW FEATURE DOM REFS
// =========================================================

// IP risk
const ipRiskBanner     = document.getElementById("ipRiskBanner");
const ipRiskBannerText = document.getElementById("ipRiskBannerText");
const ipRiskBannerDismiss = document.getElementById("ipRiskBannerDismiss");
const ipRiskBadge      = document.getElementById("ipRiskBadge");

// KYC stepper
const kycStep1      = document.getElementById("kycStep1");
const kycStep2      = document.getElementById("kycStep2");
const kycStep3      = document.getElementById("kycStep3");
const kycConnector1 = document.getElementById("kycConnector1");
const kycConnector2 = document.getElementById("kycConnector2");

// Customer onboarding
const rcName          = document.getElementById("rcName");
const rcEmail         = document.getElementById("rcEmail");
const rcPhone         = document.getElementById("rcPhone");
const rcAmount        = document.getElementById("rcAmount");
const rcCountry       = document.getElementById("rcCountry");
const runRiskCheckBtn = document.getElementById("runRiskCheckBtn");
const riskCheckResult = document.getElementById("riskCheckResult");

// Selfie
const selfieFile              = document.getElementById("selfieFile");
const selfieSelectBtn         = document.getElementById("selfieSelectBtn");
const verifySelfieBtn         = document.getElementById("verifySelfieBtn");
const removeSelfieBtn         = document.getElementById("removeSelfieBtn");
const selfieDropZone          = document.getElementById("selfieDropZone");
const selectedSelfie          = document.getElementById("selectedSelfie");
const selfieFileName          = document.getElementById("selfieFileName");
const selfieFileSize          = document.getElementById("selfieFileSize");
const selfiePreviewImg        = document.getElementById("selfiePreviewImg");
const selfieVerificationResult = document.getElementById("selfieVerificationResult");

let selectedSelfieFile = null;
let docVerified  = false;
let selfieVerified = false;


// =========================================================
// DISABLE BROWSER NATIVE VALIDATION
// =========================================================

if (transactionForm) {
    transactionForm.noValidate = true;
}


// =========================================================
// FETCH DASHBOARD DATA
// =========================================================


// =========================================================
// FEATURE 1 — IP COUNTRY RISK CHECK
// =========================================================

const HIGH_RISK_COUNTRIES = [
    "AF", "BY", "MM", "CF", "CD", "CU", "ET", "IR", "IQ",
    "LY", "ML", "NI", "KP", "RU", "SO", "SS", "SD", "SY",
    "TN", "UG", "UA", "VE", "YE", "ZW"
];

let detectedCountryCode = "";
let detectedCountryName = "Unknown";

async function checkIpRisk() {

    try {

        const res = await fetch(
            "http://ip-api.com/json/?fields=status,country,countryCode"
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.status !== "success") return;

        detectedCountryCode = data.countryCode || "";
        detectedCountryName = data.country    || "Unknown";

        // Auto-fill country field in onboarding form
        if (rcCountry) {
            rcCountry.value = detectedCountryName;
        }

        if (HIGH_RISK_COUNTRIES.includes(detectedCountryCode)) {

            if (ipRiskBanner) {
                ipRiskBanner.classList.add("visible");
                if (ipRiskBannerText) {
                    ipRiskBannerText.textContent =
                        `Connection from ${detectedCountryName} (${detectedCountryCode}) — flagged jurisdiction.`;
                }
            }

            if (ipRiskBadge) {
                ipRiskBadge.classList.add("visible");
            }

        }

    } catch {
        // Silently ignore if IP API is unreachable
    }
}

checkIpRisk();

// Dismiss banner
if (ipRiskBannerDismiss) {
    ipRiskBannerDismiss.addEventListener("click", () => {
        if (ipRiskBanner) ipRiskBanner.classList.remove("visible");
    });
}


// =========================================================
// FEATURE 3 — KYC STEP TRACKER
// =========================================================

function setKycStep(step) {

    const steps      = [kycStep1, kycStep2, kycStep3];
    const connectors = [kycConnector1, kycConnector2];

    steps.forEach((el, i) => {
        if (!el) return;
        el.classList.remove("active", "completed");
        if (i + 1 < step) {
            el.classList.add("completed");
        } else if (i + 1 === step) {
            el.classList.add("active");
        }
    });

    connectors.forEach((el, i) => {
        if (!el) return;
        el.style.width = (i + 1 < step) ? "100%" : "0%";
    });
}

// Start with step 1 active
setKycStep(1);


// =========================================================
// FEATURE 2 — CUSTOMER ONBOARDING RISK ENGINE
// =========================================================

const DISPOSABLE_EMAIL_DOMAINS = [
    "mailinator.com", "guerrillamail.com", "tempmail.com",
    "throwam.com", "yopmail.com", "sharklasers.com",
    "trashmail.com", "getnada.com", "fakeinbox.com",
    "dispostable.com", "maildrop.cc", "spam4.me"
];

async function runInitialRiskCheck() {

    const name   = (rcName   ? rcName.value.trim()   : "");
    const email  = (rcEmail  ? rcEmail.value.trim()  : "");
    const phone  = (rcPhone  ? rcPhone.value.trim()  : "");
    const amount = (rcAmount ? parseFloat(rcAmount.value) : 0);
    const countryName = detectedCountryName;
    const countryCode = detectedCountryCode;

    // Show loading state on button
    const btn = runRiskCheckBtn;
    if (btn) {
        btn.disabled = true;
        btn.textContent = "Checking Risk...";
    }

    try {
        const response = await fetch(`${API_URL}/api/onboard`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                amount: amount || 0,
                country_code: countryCode,
                country_name: countryName
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        
        // Render result from backend
        showRiskCheckResult(result.decision, result.flags || []);

        // Advance KYC stepper if passed
        if (result.decision === "pass") {
            setKycStep(2);
        }

    } catch (error) {
        console.error("Risk Check Error:", error);
        showRiskCheckResult("decline", [{ icon: "❌", text: "Failed to connect to risk engine API." }]);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = "Run Initial Risk Check";
        }
    }
}

function showRiskCheckResult(decision, flags) {

    if (!riskCheckResult) return;

    const icons  = { pass: "✓", review: "?", decline: "✕" };
    const labels = { pass: "PASS", review: "REVIEW", decline: "DECLINE" };
    const reasons = {
        pass:    "All checks passed. Proceed to identity verification.",
        review:  "Some fields require manual review before proceeding.",
        decline: "Application declined based on risk signals detected."
    };

    const flagsHtml = flags.length > 0
        ? `<ul class="decision-card-reasons">${
            flags.map(f =>
                `<li><span>${f.icon}</span><span>${f.text}</span></li>`
            ).join("")
          }</ul>`
        : "";

    riskCheckResult.innerHTML = `
        <div class="decision-card ${decision}">
            <div class="decision-card-icon">${icons[decision]}</div>
            <div class="decision-card-label">${labels[decision]}</div>
            <p class="decision-card-reason">${reasons[decision]}</p>
            ${flagsHtml}
        </div>
    `;
}

if (runRiskCheckBtn) {
    runRiskCheckBtn.addEventListener("click", runInitialRiskCheck);
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

function updateFraudAlert(fraudCount) {

    const fraudAlert =
        document.getElementById("fraudAlert");

    if (!fraudAlert) {
        return;
    }

    if (Number(fraudCount) > 0) {

        fraudAlert.style.display = "flex";

    } else {

        fraudAlert.style.display = "none";

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

    updateFraudAlert(
        overview.fraud_detected ?? 0
    );    

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
    // RISK ANALYSIS PAGE
    // -----------------------------------------------------

const highRisk =
    Number(riskDistribution.high ?? 0);

const mediumRisk =
    Number(riskDistribution.medium ?? 0);

const lowRisk =
    Number(riskDistribution.low ?? 0);

const totalRiskTransactions =
    highRisk + mediumRisk + lowRisk;


// Risk summary cards
const analysisHighRisk =
    document.getElementById("analysisHighRisk");

const analysisMediumRisk =
    document.getElementById("analysisMediumRisk");

const analysisLowRisk =
    document.getElementById("analysisLowRisk");

const analysisFraudCount =
    document.getElementById("analysisFraudCount");


// Update counts
if (analysisHighRisk) {
    analysisHighRisk.textContent =
        highRisk;
}

if (analysisMediumRisk) {
    analysisMediumRisk.textContent =
        mediumRisk;
}

if (analysisLowRisk) {
    analysisLowRisk.textContent =
        lowRisk;
}

if (analysisFraudCount) {
    analysisFraudCount.textContent =
        overview.fraud_detected ?? 0;
}


// -----------------------------------------------------
// RISK PERCENTAGES
// -----------------------------------------------------

const highPercentage =
    totalRiskTransactions > 0
        ? (highRisk / totalRiskTransactions) * 100
        : 0;

const mediumPercentage =
    totalRiskTransactions > 0
        ? (mediumRisk / totalRiskTransactions) * 100
        : 0;

const lowPercentage =
    totalRiskTransactions > 0
        ? (lowRisk / totalRiskTransactions) * 100
        : 0;


// Percentage text
const highRiskPercent =
    document.getElementById("highRiskPercent");

const mediumRiskPercent =
    document.getElementById("mediumRiskPercent");

const lowRiskPercent =
    document.getElementById("lowRiskPercent");


if (highRiskPercent) {
    highRiskPercent.textContent =
        `${highPercentage.toFixed(1)}%`;
}

if (mediumRiskPercent) {
    mediumRiskPercent.textContent =
        `${mediumPercentage.toFixed(1)}%`;
}

if (lowRiskPercent) {
    lowRiskPercent.textContent =
        `${lowPercentage.toFixed(1)}%`;
}


// -----------------------------------------------------
// RISK PROGRESS BARS
// -----------------------------------------------------

const highRiskBar =
    document.getElementById("highRiskBar");

const mediumRiskBar =
    document.getElementById("mediumRiskBar");

const lowRiskBar =
    document.getElementById("lowRiskBar");


if (highRiskBar) {
    highRiskBar.style.width =
        `${highPercentage}%`;
}

if (mediumRiskBar) {
    mediumRiskBar.style.width =
        `${mediumPercentage}%`;
}

if (lowRiskBar) {
    lowRiskBar.style.width =
        `${lowPercentage}%`;
}


// -----------------------------------------------------
// DETECTION THRESHOLD
// -----------------------------------------------------

const analysisThreshold =
    document.getElementById("analysisThreshold");

if (analysisThreshold) {
    analysisThreshold.textContent =
        "35%";
}


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


                const result = await response.json();

                console.log("Prediction result:", result);

                // Show the latest prediction immediately
                console.log("FINAL API RESULT:", result);
                console.log("Prediction:", result.prediction);
                console.log("Probability:", result.fraud_probability);
                console.log("Risk:", result.risk_level);

                showPredictionResult(result);

                // Refresh dashboard statistics
                if (typeof loadDashboard === "function") {
                    await loadDashboard();
                }

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

// =========================================================
// PAGE NAVIGATION
// =========================================================

function showPage(pageId) {
    const sections = document.querySelectorAll(".page-section");
    const navItems = document.querySelectorAll(".nav-item");

    // Hide every page
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Remove active state from every navigation item
    navItems.forEach(item => {
        item.classList.remove("active");
    });

    // Find requested page
    const target = document.getElementById(pageId);

    if (!target) {
        console.error("Page not found:", pageId);
        return;
    }

    // Show requested page
    target.classList.add("active");

    // Activate corresponding navigation button
    const activeNav = document.querySelector(
        `.nav-item[href="#${pageId}"]`
    );

    if (activeNav) {
        activeNav.classList.add("active");
    }

    console.log("Navigated to:", pageId);
}


// =========================================================
// NAVIGATION CLICK EVENTS
// =========================================================

document.querySelectorAll(".nav-item").forEach(item => {

    item.addEventListener("click", function (event) {

        event.preventDefault();

        const href = this.getAttribute("href");

        if (!href || !href.startsWith("#")) {
            return;
        }

        const pageId = href.substring(1);

        showPage(pageId);

        // Update URL without reloading
        history.replaceState(
            null,
            "",
            `#${pageId}`
        );
    });

});


// =========================================================
// INITIAL PAGE
// =========================================================

const initialPage =
    window.location.hash.substring(1) || "dashboard";

showPage(initialPage);

// =========================================================
// DOCUMENT VERIFICATION
// =========================================================

let selectedDocumentFile = null;


// ---------------------------------------------------------
// FORMAT FILE SIZE
// ---------------------------------------------------------

function formatDocumentSize(bytes) {

    if (!bytes) {
        return "0 KB";
    }

    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }

    return `${(
        bytes / (1024 * 1024)
    ).toFixed(2)} MB`;
}


// ---------------------------------------------------------
// RESET DOCUMENT RESULT
// ---------------------------------------------------------

function resetDocumentVerification() {

    selectedDocumentFile = null;

    if (documentFile) {
        documentFile.value = "";
    }

    if (selectedDocument) {
        selectedDocument.style.display = "none";
    }

    if (verifyDocumentBtn) {
        verifyDocumentBtn.disabled = true;
        verifyDocumentBtn.textContent =
            "Verify Document";
    }

    if (documentEngineStatus) {
        documentEngineStatus.textContent =
            "READY";
    }

    if (documentVerificationResult) {

        documentVerificationResult.style.display =
            "flex";

        documentVerificationResult.innerHTML = `
            <div class="document-result-icon">
                ✓
            </div>

            <strong>
                No document analyzed
            </strong>

            <p>
                Upload a document to begin verification.
            </p>
        `;
    }

    if (documentVerificationDetails) {
        documentVerificationDetails.style.display =
            "none";
    }
}


// ---------------------------------------------------------
// SELECT DOCUMENT
// ---------------------------------------------------------

if (documentSelectBtn && documentFile) {

    documentSelectBtn.addEventListener(
        "click",
        () => {

            documentFile.click();

        }
    );

}


// ---------------------------------------------------------
// FILE SELECTED
// ---------------------------------------------------------

if (documentFile) {

    documentFile.addEventListener(
        "change",
        () => {

            const file =
                documentFile.files?.[0];

            if (!file) {
                resetDocumentVerification();
                return;
            }

            handleSelectedDocument(file);

        }
    );

}


// ---------------------------------------------------------
// HANDLE SELECTED DOCUMENT
// ---------------------------------------------------------

function handleSelectedDocument(file) {

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    const maxSize =
        5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {

        alert(
            "Unsupported document type. Please select PDF, JPG or PNG."
        );

        resetDocumentVerification();

        return;
    }


    if (file.size === 0) {

        alert(
            "The selected document is empty."
        );

        resetDocumentVerification();

        return;
    }


    if (file.size > maxSize) {

        alert(
            "Document size must not exceed 5 MB."
        );

        resetDocumentVerification();

        return;
    }


    selectedDocumentFile = file;


    if (selectedDocument) {

        selectedDocument.style.display =
            "flex";
    }


    if (documentFileName) {

        documentFileName.textContent =
            file.name;
    }


    if (documentFileSize) {

        documentFileSize.textContent =
            formatDocumentSize(file.size);
    }


    if (verifyDocumentBtn) {

        verifyDocumentBtn.disabled =
            false;
    }


    if (documentVerificationResult) {
        documentVerificationResult.style.display = "flex";
        documentVerificationResult.innerHTML = `
            <div class="document-result-icon">
                ↑
            </div>
            <strong>
                Document ready
            </strong>
            <p>
                Click "Verify Document" to begin.
            </p>
        `;
    }

    if (documentVerificationDetails) {
        documentVerificationDetails.style.display = "none";
    }

    docVerified = false;
    checkKycCompletion();
}

// ---------------------------------------------------------
// HANDLE SELECTED SELFIE
// ---------------------------------------------------------

function handleSelectedSelfie(file) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        alert("Unsupported selfie type. Please select JPG or PNG.");
        resetSelfieVerification();
        return;
    }

    if (file.size === 0) {
        alert("The selected selfie is empty.");
        resetSelfieVerification();
        return;
    }

    if (file.size > maxSize) {
        alert("Selfie exceeds the maximum size of 5 MB.");
        resetSelfieVerification();
        return;
    }

    selectedSelfieFile = file;

    if (selfieFileName) {
        selfieFileName.textContent = file.name;
    }
    if (selfieFileSize) {
        selfieFileSize.textContent = formatDocumentSize(file.size);
    }

    if (selectedSelfie) {
        selectedSelfie.style.display = "flex";
    }

    if (selfiePreviewImg) {
        selfiePreviewImg.src = URL.createObjectURL(file);
        selfiePreviewImg.classList.add("visible");
    }

    if (verifySelfieBtn) {
        verifySelfieBtn.disabled = false;
    }
    
    selfieVerified = false;
    checkKycCompletion();
}

function resetSelfieVerification() {
    selectedSelfieFile = null;
    selfieVerified = false;
    
    if (selfieFile) selfieFile.value = "";
    if (selectedSelfie) selectedSelfie.style.display = "none";
    if (selfiePreviewImg) {
        selfiePreviewImg.classList.remove("visible");
        selfiePreviewImg.src = "";
    }
    if (verifySelfieBtn) {
        verifySelfieBtn.disabled = true;
        verifySelfieBtn.textContent = "Verify Selfie";
    }
    if (selfieVerificationResult) {
        selfieVerificationResult.innerHTML = "";
    }
    checkKycCompletion();
}


// ---------------------------------------------------------
// SELECT SELFIE
// ---------------------------------------------------------

if (selfieSelectBtn && selfieFile) {
    selfieSelectBtn.addEventListener("click", () => {
        selfieFile.click();
    });
}

if (selfieFile) {
    selfieFile.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleSelectedSelfie(e.target.files[0]);
        }
    });
}

if (removeSelfieBtn) {
    removeSelfieBtn.addEventListener("click", resetSelfieVerification);
}

// ---------------------------------------------------------
// SELFIE DRAG AND DROP
// ---------------------------------------------------------

if (selfieDropZone) {
    selfieDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        selfieDropZone.classList.add("drag-over");
    });
    selfieDropZone.addEventListener("dragleave", () => {
        selfieDropZone.classList.remove("drag-over");
    });
    selfieDropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        selfieDropZone.classList.remove("drag-over");
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleSelectedSelfie(e.dataTransfer.files[0]);
        }
    });
}


// ---------------------------------------------------------
// CHECK KYC COMPLETION
// ---------------------------------------------------------

function checkKycCompletion() {
    // If both document and selfie are verified, go to step 3
    if (docVerified && selfieVerified) {
        setKycStep(3);
    }
}


// ---------------------------------------------------------
// REMOVE DOCUMENT
// ---------------------------------------------------------

if (removeDocumentBtn) {

    removeDocumentBtn.addEventListener(
        "click",
        () => {

            resetDocumentVerification();

        }
    );

}


// ---------------------------------------------------------
// DRAG & DROP
// ---------------------------------------------------------

if (documentDropZone) {

    documentDropZone.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();

            documentDropZone.classList.add(
                "drag-over"
            );

        }
    );


    documentDropZone.addEventListener(
        "dragleave",
        () => {

            documentDropZone.classList.remove(
                "drag-over"
            );

        }
    );


    documentDropZone.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();

            documentDropZone.classList.remove(
                "drag-over"
            );

            const file =
                event.dataTransfer.files?.[0];

            if (!file) {
                return;
            }

            handleSelectedDocument(file);

        }
    );

}


// ---------------------------------------------------------
// VERIFY DOCUMENT
// ---------------------------------------------------------

if (verifyDocumentBtn) {

    verifyDocumentBtn.addEventListener(
        "click",
        async () => {

            if (!selectedDocumentFile) {

                alert(
                    "Please select a document first."
                );

                return;
            }


            verifyDocumentBtn.disabled =
                true;

            verifyDocumentBtn.textContent =
                "Verifying...";


            if (documentEngineStatus) {

                documentEngineStatus.textContent =
                    "PROCESSING";
            }


            if (documentVerificationResult) {

                documentVerificationResult.style.display =
                    "flex";

                documentVerificationResult.innerHTML = `
                    <div class="document-result-icon">
                        ...
                    </div>

                    <strong>
                        Analyzing document
                    </strong>

                    <p>
                        Running CardSentinel validation checks...
                    </p>
                `;
            }


            try {

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    selectedDocumentFile
                );


                const response =
                    await fetch(
                        `${API_URL}/verify-document`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                if (!response.ok) {

                    let message =
                        `Verification API error: ${response.status}`;

                    try {

                        const errorData =
                            await response.json();

                        if (errorData.detail) {

                            message =
                                typeof errorData.detail === "string"
                                    ? errorData.detail
                                    : JSON.stringify(
                                        errorData.detail
                                    );
                        }

                    } catch {
                        // Ignore parsing failure
                    }

                    throw new Error(message);
                }


                const result =
                    await response.json();


                console.log(
                    "Document verification result:",
                    result
                );


                showDocumentVerificationResult(
                    result
                );
                
                docVerified = result.verified === true;
                checkKycCompletion();


            } catch (error) {

                console.error(
                    "Document verification error:",
                    error
                );


                if (documentEngineStatus) {

                    documentEngineStatus.textContent =
                        "ERROR";
                }


                if (documentVerificationResult) {

                    documentVerificationResult.style.display =
                        "flex";

                    documentVerificationResult.innerHTML = `
                        <div class="document-result-icon">
                            !
                        </div>

                        <strong>
                            Verification failed
                        </strong>

                        <p>
                            ${error.message}
                        </p>
                    `;
                }

            } finally {

                verifyDocumentBtn.disabled =
                    false;

                verifyDocumentBtn.textContent =
                    "Verify Document";

            }

        }
    );

}


// ---------------------------------------------------------
// VERIFY SELFIE
// ---------------------------------------------------------

if (verifySelfieBtn) {
    verifySelfieBtn.addEventListener("click", async () => {
        if (!selectedSelfieFile) {
            alert("Please select a selfie first.");
            return;
        }

        verifySelfieBtn.disabled = true;
        verifySelfieBtn.textContent = "Verifying...";
        if (selfieVerificationResult) {
            selfieVerificationResult.innerHTML = `<span class="selfie-status-tag" style="background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2);">Processing liveness...</span>`;
        }

        try {
            const formData = new FormData();
            formData.append("file", selectedSelfieFile);

            // Use the new /verify-selfie endpoint
            const response = await fetch(`${API_URL}/verify-selfie`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const detail = typeof errorData.detail === "string" ? errorData.detail : (errorData.detail?.[0]?.msg || response.statusText);
                throw new Error(`Verification error: ${detail}`);
            }

            const result = await response.json();
            
            if (result.verified) {
                if (selfieVerificationResult) {
                    selfieVerificationResult.innerHTML = `<span class="selfie-status-tag verified">✓ LIVENESS VERIFIED (${result.score}%)</span>`;
                }
                selfieVerified = true;
                checkKycCompletion();
            } else {
                throw new Error("Liveness check failed");
            }

        } catch (error) {
            console.error("Selfie verification error:", error);
            if (selfieVerificationResult) {
                selfieVerificationResult.innerHTML = `<span class="selfie-status-tag error">✕ ${error.message}</span>`;
            }
            selfieVerified = false;
        } finally {
            verifySelfieBtn.disabled = false;
            verifySelfieBtn.textContent = "Verify Selfie";
        }
    });
}


// ---------------------------------------------------------
// SHOW DOCUMENT VERIFICATION RESULT
// ---------------------------------------------------------

function showDocumentVerificationResult(
    result
) {
    // Backend returns: { verified, status, score, message, file: { name, type, size, size_formatted, sha256 } }

    const fileInfo = result.file || {};

    const status =
        String(
            result.status || "REVIEW"
        ).toUpperCase();

    const score =
        Number(result.score ?? 0);

    const isApproved = result.verified === true;


    if (documentEngineStatus) {
        documentEngineStatus.textContent = status;
    }


    if (documentVerificationResult) {
        documentVerificationResult.style.display = "none";
    }


    if (documentVerificationDetails) {
        documentVerificationDetails.style.display = "block";
        
        // Find or create the decision card container
        let decisionContainer = document.getElementById("docDecisionContainer");
        if (!decisionContainer) {
            decisionContainer = document.createElement("div");
            decisionContainer.id = "docDecisionContainer";
            // Insert it at the top of documentVerificationDetails
            documentVerificationDetails.insertBefore(decisionContainer, documentVerificationDetails.firstChild);
        }
        
        const decisionClass = isApproved ? "approved" : "declined";
        const decisionIcon  = isApproved ? "✓" : "✕";
        const decisionLabel = isApproved ? "APPROVED" : "DECLINED";
        const decisionSub   = isApproved ? "Document authenticity verified" : "Failed authenticity checks";
        
        decisionContainer.innerHTML = `
            <div class="doc-decision-card ${decisionClass}">
                <div class="doc-decision-icon">${decisionIcon}</div>
                <div class="doc-decision-label">${decisionLabel}</div>
                <p class="doc-decision-sub">${decisionSub}</p>
            </div>
        `;
    }


    if (documentStatusBadge) {
        documentStatusBadge.textContent = status;
        documentStatusBadge.className =
            `document-status-badge ${status.toLowerCase()}`;
    }


    if (documentScore) {
        documentScore.textContent = `${score}%`;
    }


    if (documentVerificationMessage) {
        documentVerificationMessage.textContent =
            result.message || "Document verification completed.";
    }


    if (resultFileName) {
        resultFileName.textContent = fileInfo.name || "-";
    }


    if (resultDocumentType) {
        resultDocumentType.textContent = fileInfo.type || "-";
    }


    if (resultDocumentSize) {
        resultDocumentSize.textContent =
            fileInfo.size_formatted ||
            formatDocumentSize(Number(fileInfo.size ?? 0));
    }


    if (resultDocumentHash) {
        resultDocumentHash.textContent = fileInfo.sha256 || "-";
        resultDocumentHash.title = fileInfo.sha256 || "";
    }

}