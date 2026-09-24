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

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const rollNumber = input.value.trim();

    message.textContent = "";
    resultBox.classList.add("hidden");

    if (!/^\d{11}$/.test(rollNumber)) {
        message.textContent = "Enter a valid 11-digit roll number.";
        return;
    }

    button.disabled = true;
    button.textContent = "Searching...";

    try {
        const url = API_URL + "/result/" + rollNumber;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Result not found");
        }

        const data = await response.json();

        roll.textContent = data.roll_number;
        application.textContent = data.application_number;
        score.textContent = data.score + " / 720";
        rank.textContent = Number(data.rank).toLocaleString("en-IN");

        resultBox.classList.remove("hidden");

    } catch (error) {
        console.error("API ERROR:", error);
        message.textContent = "Something went wrong while loading the result.";
    }

    button.disabled = false;
    button.textContent = "Search";
});
