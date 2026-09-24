const API_URL = "http://127.0.0.1:8000";

const form = document.getElementById("resultForm");
const input = document.getElementById("rollNumber");
const button = document.getElementById("searchButton");

const message = document.getElementById("message");
const resultBox = document.getElementById("result");

const roll = document.getElementById("roll");
const application = document.getElementById("application");
const score = document.getElementById("score");
const rank = document.getElementById("rank");


form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const rollNumber = input.value.trim();

    resultBox.classList.add("hidden");
    message.textContent = "";

    if (!/^\d{11}$/.test(rollNumber)) {
        message.textContent = "Please enter a valid 11-digit roll number.";
        return;
    }

    button.disabled = true;
    button.textContent = "Searching...";

    try {

        const response = await fetch(
            `${API_URL}/result/${rollNumber}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail?.error || "Result not found."
            );
        }

        roll.textContent = data.roll_number;
        application.textContent = data.application_number;
        score.textContent = `${data.score} / 720`;
        rank.textContent = data.rank.toLocaleString();

        resultBox.classList.remove("hidden");

    } catch (error) {

        message.textContent = error.message;

    } finally {

        button.disabled = false;
        button.textContent = "Search Result";
    }
});
