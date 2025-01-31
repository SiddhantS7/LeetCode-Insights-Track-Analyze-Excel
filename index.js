// app.js

// Get references to the DOM elements
const solvedElem = document.getElementById('solved');
const easyElem = document.getElementById('easy');
const mediumElem = document.getElementById('medium');
const hardElem = document.getElementById('hard');

const solvedInput = document.getElementById('solvedInput');
const easyInput = document.getElementById('easyInput');
const mediumInput = document.getElementById('mediumInput');
const hardInput = document.getElementById('hardInput');
const updateButton = document.getElementById('updateButton');

// Load saved metrics from localStorage
function loadMetrics() {
    const savedMetrics = JSON.parse(localStorage.getItem('metrics'));
    if (savedMetrics) {
        solvedElem.textContent = savedMetrics.solved || 0;
        easyElem.textContent = savedMetrics.easy || 0;
        mediumElem.textContent = savedMetrics.medium || 0;
        hardElem.textContent = savedMetrics.hard || 0;
    }
}

// Save metrics to localStorage
function saveMetrics() {
    const metrics = {
        solved: parseInt(solvedElem.textContent),
        easy: parseInt(easyElem.textContent),
        medium: parseInt(mediumElem.textContent),
        hard: parseInt(hardElem.textContent)
    };
    localStorage.setItem('metrics', JSON.stringify(metrics));
}

// Function to update metrics
function updateMetrics() {
    const solved = parseInt(solvedInput.value) || 0;
    const easy = parseInt(easyInput.value) || 0;
    const medium = parseInt(mediumInput.value) || 0;
    const hard = parseInt(hardInput.value) || 0;

    // Smoothly update the metrics
    animateMetricUpdate(solvedElem, solved);
    animateMetricUpdate(easyElem, easy);
    animateMetricUpdate(mediumElem, medium);
    animateMetricUpdate(hardElem, hard);

    // Save the updated metrics to localStorage
    saveMetrics();
}

// Animation for updating metrics
function animateMetricUpdate(element, newValue) {
    const currentValue = parseInt(element.textContent);
    let increment = (newValue - currentValue) / 10;
    let counter = currentValue;

    const interval = setInterval(() => {
        counter += increment;
        if (Math.abs(counter - newValue) <= Math.abs(increment)) {
            clearInterval(interval);
            counter = newValue;
        }
        element.textContent = Math.round(counter);
    }, 50);
}

// Fetch LeetCode data from an unofficial API
const username = "your_username"; // Replace with actual LeetCode username
const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`; // Use an unofficial API

async function fetchLeetCodeData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.totalProblems) {
            // Smoothly update the metrics with data fetched from LeetCode
            animateMetricUpdate(solvedElem, data.totalProblems);
            animateMetricUpdate(easyElem, data.easyProblems);
            animateMetricUpdate(mediumElem, data.mediumProblems);
            animateMetricUpdate(hardElem, data.hardProblems);

            // Save the updated metrics to localStorage
            saveMetrics();
        }
    } catch (error) {
        console.error("Error fetching LeetCode data:", error);
    }
}

// Load metrics and fetch LeetCode data when the page is loaded
window.onload = function() {
    loadMetrics();
    fetchLeetCodeData();  // Fetch data from LeetCode API on page load
};

// Add event listener to the update button
updateButton.addEventListener('click', updateMetrics);
