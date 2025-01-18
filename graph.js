// Fetch data from the text file
let i=0
async function fetchSensorData() {
    try {
        const response = await fetch('sensor_readings.txt');
        const data = await response.text();
        const lines = data.split('\n').map(line => line.trim());
        const [waterFlow, pressure, temperature] = lines[i].split(',').map(value => parseFloat(value.trim()));
        return { waterFlow, pressure, temperature };
        i++
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        return null;
    }
}

// Chart.js configurations
const waterFlowChart = new Chart(document.getElementById('waterFlowChart'), {
    type: 'line',
    data: {
        labels: [], // Timestamps
        datasets: [{
            label: 'Water Flow (L/min)',
            data: [],
            backgroundColor: 'blue',
            borderColor: 'blue',
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Flow (L/min)' }, min: 0, max: 20 }
        }
    }
});

const pressureChart = new Chart(document.getElementById('pressureChart'), {
    type: 'line',
    data: {
        labels: [], // Timestamps
        datasets: [{
            label: 'Pressure (bar)',
            data: [],
            backgroundColor: 'green',
            borderColor: 'green',
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Pressure (bar)' }, min: 0, max: 8 }
        }
    }
});

const temperatureChart = new Chart(document.getElementById('temperatureChart'), {
    type: 'bar',
    data: {
        labels: [], // Timestamps
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            backgroundColor: 'orange',
            borderColor:'orange'
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Temperature (°C)' }, min: 0, max: 60 }
        }
    }
});

// Update charts every 1 minute
async function updateCharts() {
    const sensorData = await fetchSensorData();

    if (sensorData) {
        const currentTime = new Date().toLocaleTimeString();

        // Water Flow Chart
        waterFlowChart.data.labels.push(currentTime);
        waterFlowChart.data.datasets[0].data.push(sensorData.waterFlow);
        if (waterFlowChart.data.labels.length > 20) {
            waterFlowChart.data.labels.shift();
            waterFlowChart.data.datasets[0].data.shift();
        }
        waterFlowChart.update();

        // Pressure Chart
        pressureChart.data.labels.push(currentTime);
        pressureChart.data.datasets[0].data.push(sensorData.pressure);
        if (pressureChart.data.labels.length > 20) {
            pressureChart.data.labels.shift();
            pressureChart.data.datasets[0].data.shift();
        }
        pressureChart.update();

        // Temperature Chart
        temperatureChart.data.labels.push(currentTime);
        temperatureChart.data.datasets[0].data.push(sensorData.temperature);
        if (temperatureChart.data.labels.length > 20) {
            temperatureChart.data.labels.shift();
            temperatureChart.data.datasets[0].data.shift();
        }
        temperatureChart.update();
    }
}

// Refresh charts every minute
setInterval(updateCharts, 2000);
updateCharts(); // Initial update