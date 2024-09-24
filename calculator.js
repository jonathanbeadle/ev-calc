function toggleCustomElectricityCost() {
    const costPerKwhSelect = document.getElementById('costPerKwhSelect');
    const costPerKwhInput = document.getElementById('costPerKwh');

    if (costPerKwhSelect.value === 'custom') {
        costPerKwhInput.style.display = 'block';
        costPerKwhInput.value = ''; 
    } else {
        costPerKwhInput.style.display = 'none';
        costPerKwhInput.value = costPerKwhSelect.value;
    }
}

function toggleHireRateInputs() {
    const includeHireRates = document.getElementById('includeHireRates').checked;
    document.getElementById('hireRateInputs').style.display = includeHireRates ? 'block' : 'none';
}

function getNumberValue(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function populateDieselVehicleData() {
    const dieselVehicleSelect = document.getElementById('dieselVehicleSelect').value;
    const mpgDieselInput = document.getElementById('mpgDiesel');

    if (dieselVehicleSelect === 'ford_transit_diesel') {
        mpgDieselInput.value = 27.7;
        mpgDieselInput.disabled = true;
    } else if (dieselVehicleSelect === 'vauxhall_vivaro_diesel') {
        mpgDieselInput.value = 41.5;
        mpgDieselInput.disabled = true;
    } else if (dieselVehicleSelect === 'volkswagen_transporter_diesel') {
        mpgDieselInput.value = 32.5;
        mpgDieselInput.disabled = true;
    } else if (dieselVehicleSelect === 'peugeot_partner_diesel') {
        mpgDieselInput.value = 52;
        mpgDieselInput.disabled = true;
    } else if (dieselVehicleSelect === 'vauxhall_combo_diesel') {
        mpgDieselInput.value = 50.5;
        mpgDieselInput.disabled = true;
    } else {
        mpgDieselInput.value = '';
        mpgDieselInput.disabled = false;
    }
}

function populateEVVehicleData() {
    const evVehicleSelect = document.getElementById('evVehicleSelect').value;
    const batterySizeInput = document.getElementById('batterySize');
    const evRangeInput = document.getElementById('evRange');

    if (evVehicleSelect === 'ford_transit_ev') {
        batterySizeInput.value = 68;
        evRangeInput.value = 157;
        batterySizeInput.disabled = true;
        evRangeInput.disabled = true;
    } else if (evVehicleSelect === 'vauxhall_vivaro_ev') {
        batterySizeInput.value = 75;
        evRangeInput.value = 196;
        batterySizeInput.disabled = true;
        evRangeInput.disabled = true;
    } else if (evVehicleSelect === 'volkswagen_id_buzz_ev') {
        batterySizeInput.value = 77;
        evRangeInput.value = 252;
        batterySizeInput.disabled = true;
        evRangeInput.disabled = true;
    } else if (evVehicleSelect === 'peugeot_e_partner_ev') {
        batterySizeInput.value = 50;
        evRangeInput.value = 205;
        batterySizeInput.disabled = true;
        evRangeInput.disabled = true;
    } else if (evVehicleSelect === 'vauxhall_combo_ev') {
        batterySizeInput.value = 50;
        evRangeInput.value = 175;
        batterySizeInput.disabled = true;
        evRangeInput.disabled = true;
    } else {
        batterySizeInput.value = '';
        evRangeInput.value = '';
        batterySizeInput.disabled = false;
        evRangeInput.disabled = false;
    }
}

function calculateSavings() {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';
    const co2SummaryContent = document.getElementById('co2SummaryContent');
    co2SummaryContent.innerHTML = '';

    const annualMileage = Math.round(getNumberValue('annualMileage'));
    const costPerLitre = getNumberValue('costPerLitre');
    const mpgDiesel = getNumberValue('mpgDiesel');
    const includeHireRates = document.getElementById('includeHireRates').checked;
    let dieselWeeklyHireRate = 0;
    let evWeeklyHireRate = 0;

    if (includeHireRates) {
        dieselWeeklyHireRate = getNumberValue('dieselWeeklyHireRate');
        evWeeklyHireRate = getNumberValue('evWeeklyHireRate');
    }

    let costPerKwh;
    const costPerKwhSelect = document.getElementById('costPerKwhSelect').value;
    if (costPerKwhSelect === 'custom') {
        costPerKwh = getNumberValue('costPerKwh');
    } else {
        costPerKwh = parseFloat(costPerKwhSelect);
    }

    const batterySize = getNumberValue('batterySize');
    const evRange = getNumberValue('evRange');

    // Diesel Calculations
    const litresPerGallon = 4.54609;
    const costPerGallon = costPerLitre * litresPerGallon;
    const annualGallons = annualMileage / mpgDiesel;
    const annualFuelCost = annualGallons * costPerGallon;
    const weeklyFuelCostDiesel = annualFuelCost / 52;
    const totalWeeklyCostDiesel = weeklyFuelCostDiesel + dieselWeeklyHireRate;

    // BEV Calculations
    const milesPerKwh = evRange / batterySize;
    const annualElectricityCost = (annualMileage / milesPerKwh) * costPerKwh;
    const weeklyElectricityCostBEV = annualElectricityCost / 52;
    const totalWeeklyCostBEV = weeklyElectricityCostBEV + evWeeklyHireRate;

    // Calculate savings
    const weeklySavings = totalWeeklyCostDiesel - totalWeeklyCostBEV;
    const annualSavings = annualFuelCost - annualElectricityCost;

    // Diesel CO2 emissions calculation
    const dieselLitresUsed = annualGallons * litresPerGallon;
    const dieselCO2Emissions = dieselLitresUsed * 2.67;

    // EV CO2 emissions calculation (assuming zero tailpipe emissions)
    const evCO2Emissions = 0;

    // CO2 savings calculation
    const co2Savings = dieselCO2Emissions - evCO2Emissions;

    const dieselVehicleTable = `
        <table class="result-table">
            <tr><th>Diesel Vehicle</th><th>Value</th></tr>
            <tr><td>Annual Mileage</td><td>${annualMileage} miles</td></tr>
            <tr><td>Cost per Gallon</td><td>£${costPerGallon.toFixed(2)}</td></tr>
            <tr><td>Annual Gallons Used</td><td>${annualGallons.toFixed(2)} gallons</td></tr>
            <tr><td>Weekly Fuel Cost</td><td>£${weeklyFuelCostDiesel.toFixed(2)}</td></tr>
            ${includeHireRates ? `<tr><td>Diesel Weekly Hire Rate</td><td>£${dieselWeeklyHireRate.toFixed(2)}</td></tr>` : ''}
            <tr><td><strong>Total Weekly Cost (Diesel)</strong></td><td><strong>£${totalWeeklyCostDiesel.toFixed(2)}</strong></td></tr>
        </table>
    `;

    const bevVehicleTable = `
        <table class="result-table">
            <tr><th>BEV Vehicle</th><th>Value</th></tr>
            <tr><td>Annual Mileage</td><td>${annualMileage} miles</td></tr>
            <tr><td>Miles per kWh</td><td>${milesPerKwh.toFixed(2)} miles/kWh</td></tr>
            <tr><td>Annual Electricity Cost</td><td>£${annualElectricityCost.toFixed(2)}</td></tr>
            <tr><td>Weekly Electricity Cost</td><td>£${weeklyElectricityCostBEV.toFixed(2)}</td></tr>
            ${includeHireRates ? `<tr><td>EV Weekly Hire Rate</td><td>£${evWeeklyHireRate.toFixed(2)}</td></tr>` : ''}
            <tr><td><strong>Total Weekly Cost (BEV)</strong></td><td><strong>£${totalWeeklyCostBEV.toFixed(2)}</strong></td></tr>
        </table>
    `;

    const resultsTable = `
        <table class="result-table">
            <tr><th>Results</th><th>Value</th></tr>
            <tr><td><strong>Weekly Savings</strong></td><td><strong>£${weeklySavings.toFixed(2)}</strong></td></tr>
            <tr><td><strong>Annual Savings</strong></td><td><strong>£${annualSavings.toFixed(2)}</strong></td></tr>
        </table>
    `;

    const co2Table = `
        <table class="result-table">
            <tr><th>CO2 Comparison</th><th>Value</th></tr>
            <tr><td>Diesel CO2 Emissions</td><td>${dieselCO2Emissions.toFixed(2)} kg</td></tr>
            <tr><td>EV CO2 Emissions</td><td>${evCO2Emissions.toFixed(2)} kg</td></tr>
            <tr><td><strong>CO2 Savings</strong></td><td><strong>${co2Savings.toFixed(2)} kg</strong></td></tr>
        </table>
    `;

    const resultTableClass = weeklySavings > 0 ? 'highlight-green' : 'highlight-red';
    const co2TableClass = co2Savings > 0 ? 'highlight-green' : 'highlight-red';

    summaryContent.innerHTML = `
    <h3>Savings Summary</h3>
        ${dieselVehicleTable}
        ${bevVehicleTable}
        <div class="${resultTableClass}">
            ${resultsTable}
        </div>
    `;

    co2SummaryContent.innerHTML = `
    <h3>Tailpipe CO2 Emission Savings</h3>
        <div class="${co2TableClass}">
            ${co2Table}
        </div>
    `;

    summaryContent.style.display = 'block';
    co2SummaryContent.style.display = 'block';
    summaryContent.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('annualMileage').value = 20000;
    document.getElementById('dieselVehicleSelect').value = 'custom';
    document.getElementById('mpgDiesel').value = '';
    document.getElementById('mpgDiesel').disabled = false;
    document.getElementById('costPerLitre').value = 1.49;

    document.getElementById('evVehicleSelect').value = 'custom';
    document.getElementById('batterySize').value = '';
    document.getElementById('batterySize').disabled = false;
    document.getElementById('evRange').value = '';
    document.getElementById('evRange').disabled = false;
    document.getElementById('costPerKwhSelect').value = '0.45';
    document.getElementById('costPerKwh').style.display = 'none';
    document.getElementById('costPerKwh').value = '';

    document.getElementById('includeHireRates').checked = false;
    toggleHireRateInputs();
    document.getElementById('dieselWeeklyHireRate').value = 125;
    document.getElementById('evWeeklyHireRate').value = 128;

    document.getElementById('summaryContent').style.display = 'none';
    document.getElementById('co2SummaryContent').style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
