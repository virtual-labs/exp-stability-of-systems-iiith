// TODO: errata correct that it's 100 steps and not 100 seconds
// TODO: system stability quiz is for descrete and not continuos mention that!
function openPart(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";

    if(!name.localeCompare('FR'))
    {
        sPlane();
    }
    else if(!name.localeCompare('MVG'))
    {
        ROCQuizInit();
    }
    else if(!name.localeCompare('PIDT'))
    {
        PIDTemperatureQuiz();
    }
    else if(!name.localeCompare('CST'))
    {
        simulateCustomSystem();
    }
    else if(!name.localeCompare('SOST'))
    {
        simulateSecondOrderSystem();
    }
    else if(!name.localeCompare('SecondOrderQuiz')){
        generateRandomSystem();
    }
    else if(!name.localeCompare('CustomSystemQuiz')){
        generateRandomCustomSystem();
    }
}

var k;
var p;
var sigChoice;
var scaleChoice;
var delayChoice;
var boxChoice;
var yValues;
var inValues;

const figure = document.querySelector('.expandable-figure');

figure.addEventListener('click', () => {
    figure.classList.toggle('expanded');
});

// ------------------------------------------ PID Intro ----------------------------------------------------------

function sPlane() {
    var kp1 = document.getElementById("kp").value;
    var ki1 = document.getElementById("ki").value;
    var kd1 = document.getElementById("kd").value;
    var kp = parseFloat(kp1);
    var ki = parseFloat(ki1);
    var kd = parseFloat(kd1);

    var polesReal = [];
    var polesImag = [];
    var zerosReal = [];
    var zerosImag = [];

    if (kd === 0) {
        // Handle the case when kd is zero
        polesReal.push(-ki / kp);
        polesImag.push(0);
        zerosReal.push(-kp / ki);
        zerosImag.push(0);
    } else {
        var inside = ((1 + kp) * (1 + kp)) - 4 * kd * ki;

        if (inside < 0) {
            polesReal.push(-(1 + kp) / (2 * kd));
            polesReal.push(-(1 + kp) / (2 * kd));
            polesImag.push(Math.sqrt(-inside) / (2 * kd));
            polesImag.push(-Math.sqrt(-inside) / (2 * kd));
        } else {
            polesReal.push(-(1 + kp + Math.sqrt(inside)) / (2 * kd));
            polesReal.push(-(1 + kp - Math.sqrt(inside)) / (2 * kd));
            polesImag.push(0);
            polesImag.push(0);
        }

        inside = (kp * kp) - 4 * kd * ki;

        if (inside < 0) {
            zerosReal.push(-kp / (2 * kd));
            zerosReal.push(-kp / (2 * kd));
            zerosImag.push(Math.sqrt(-inside) / (2 * kd));
            zerosImag.push(-Math.sqrt(-inside) / (2 * kd));
        } else {
            zerosReal.push(-(kp + Math.sqrt(inside)) / (2 * kd));
            zerosReal.push(-(kp - Math.sqrt(inside)) / (2 * kd));
            zerosImag.push(0);
            zerosImag.push(0);
        }
    }

    var trace1 = {
        x: zerosReal,
        y: zerosImag,
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                width: 1
            }
        }
    };
    var trace2 = {
        x: polesReal,
        y: polesImag,
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'cross',
            size: 10,
            line: {
                width: 1
            }
        }
    };

    var data = [trace1, trace2];

    var config = { responsive: true };
    var layout2 = {
        title: 's-Plane',
        showlegend: false,
        shapes: [{
            type: 'line',
            x0: 0,
            y0: -0.1,
            x1: 0,
            yref: 'paper',
            y1: 1,
            line: {
                width: 2,
                dash: 'dot'
            }
        }]
    };

    Plotly.newPlot('figure1', data, layout2, config);

    if (screen.width < 400) {
        var update = {
            width: 0.7 * screen.width,
            height: 400
        };
    } else {
        var update = {
            width: 350,
            height: 400
        };
    }

    Plotly.relayout('figure1', update);
}

function makeArr(start, end, num) {
    var arr = [];
    var step = (end - start) / (num - 1);
    for (var i = 0; i < num; i++) {
        arr.push(start + (step * i));
    }
    return arr;
}
// ------------------------------------------------- PID Working Temperature -----------------------------------------------

var setpoint = 0;
var currentTemperature = 0;
var interval = 500;
var iter = 0;

var temperatures = [];

function PIDTemperature(){

    iter = 0;

    var plotDiv = document.getElementById("figure3");
    Plotly.purge(plotDiv);


    temperatures = [];
    var currentTemp = document.getElementById("temp").value;
    currentTemperature = parseFloat(currentTemp);

    var kp1 = document.getElementById("kp1").value;
    kp = parseFloat(kp1);
    var ki1 = document.getElementById("ki1").value;
    ki = parseFloat(ki1);
    var kd1 = document.getElementById("kd1").value;
    kd = parseFloat(kd1);

    var setpointTemp = document.getElementById("tempSet").value;
    setpoint = parseFloat(setpointTemp);

    temperatures.push(currentTemp);
    var flag = 0;

    // Main control loop
    const intervalId = setInterval(() => {
    // Update the error and calculate the PID output
    var error = setpoint - currentTemperature;

    if(iter>50)
    {
        var element = document.getElementById("result1")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'The system is unstable! Set point cannot be reached';
    }

    if((Math.abs(error) < 1e-2))
    {
        var xt = [];

        for(var i=0; i<=iter; i++)
        {
            xt.push(i/2);
        }

        var yt = [];

        var N = xt.length;
        for(var i=0; i<N; i++)
        {
            yt.push(setpoint);
        }

        var trace = {
            x: xt,
            y: temperatures,
            type: 'scatter',
            mode: 'line'
        };
        var trace2 = {
            x: xt,
            y: yt,
            mode: 'line',
            line: {
                dash: 'dot', // Set the line style to "dot" (dotted line)
                color: 'red', // Line color
                width: 2       // Line width
            }
        };

        var data = [trace,trace2];

        //var config = {responsive: true}
        var layout1 = {
            title: 'Temperature Control',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Temperature (°C)'
            }
        };

        Plotly.newPlot('figure3', data, layout1);

        if(screen.width < 400)
        {
            var update = {
                width: 0.7*screen.width,
                height: 400
            };
        }
        else
        {
            var update = {
                width: 350,
                height: 400
            };
        }

        Plotly.relayout('figure3', update);
        flag = 1;
        var element = document.getElementById("result1")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Setpoint Temperature reached! (' + setpoint.toString() + ')';
        clearInterval(intervalId);
    }

    var output = calculatePIDOutput(error, kp, ki, kd);

    // Apply the output to control the system (e.g., adjust heating/cooling power)
    adjustSystem(output);

    // Simulate the system's response by updating the current temperature
    simulateSystemResponse();

    if(flag==0)
    {
        // Log the current temperature and PID output for demonstration
        var element = document.getElementById("result1")
        element.style.color = "#0000FF";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Calculating... Current Temperature - ' + (Math.round(currentTemperature*100)/100).toString() + '°C';

        var xt = [];

        for(var i=0; i<=iter; i++)
        {
            xt.push(i/2);
        }

        var yt = [];

        var N = xt.length;
        for(var i=0; i<N; i++)
        {
            yt.push(setpoint);
        }

        var trace = {
            x: xt,
            y: temperatures,
            type: 'scatter',
            mode: 'line'
        };
        var trace2 = {
            x: xt,
            y: yt,
            mode: 'line',
            line: {
                dash: 'dot', // Set the line style to "dot" (dotted line)
                color: 'red', // Line color
                width: 2       // Line width
            }
        };

        var data = [trace,trace2];

        //var config = {responsive: true}
        var layout1 = {
            title: 'Temperature Control',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Temperature (°C)'
            }
        };

        Plotly.newPlot('figure3', data, layout1);

        if(screen.width < 400)
        {
            var update = {
                width: 0.7*screen.width,
                height: 400
            };
        }
        else
        {
            var update = {
                width: 350,
                height: 400
            };
        }

        Plotly.relayout('figure3', update);
    }

    iter++;
    temperatures.push(currentTemperature);

    }, interval);
}

// Function to calculate the PID output with proper integration and derivative terms
function calculatePIDOutput(error, kp, ki, kd) {
    // Static variables to maintain state between calls
    if (typeof this.integral === 'undefined') this.integral = 0;
    if (typeof this.lastError === 'undefined') this.lastError = error;

    // Calculate PID terms
    const proportional = kp * error;

    // Integrate error over time (use trapezoidal integration)
    this.integral += error * (interval/1000); // interval is in ms, convert to seconds
    const integral = ki * this.integral;

    // Calculate derivative (rate of change)
    const derivative = kd * (error - this.lastError) / (interval/1000);
    this.lastError = error;

    // Return combined PID output
    return proportional + integral + derivative;
  }

  // Function to adjust the system with more realistic behavior
  function adjustSystem(output) {
    // Add thermal mass simulation - system can't change temperature instantly
    const thermalMass = 0.1; // Lower = faster response
    const maxDeltaT = 5.0; // Maximum temperature change per interval

    // Calculate desired temperature change
    let deltaT = output * thermalMass;

    // Limit maximum temperature change per interval
    deltaT = Math.min(Math.max(deltaT, -maxDeltaT), maxDeltaT);

    // Update current temperature
    currentTemperature += deltaT;
  }

  // Function to simulate the system's response with noise and disturbances
  function simulateSystemResponse() {
    const noiseLevels = {
        'none': 0,
        'low': 0.05,
        'medium': 1,
        'high': 5
    };

    // Get selected noise level
    const noiseLevel = document.getElementById("noiseLevel").value;
    const noiseFactor = noiseLevels[noiseLevel];

    // Add random noise based on selected level
    const noise = (Math.random() - 0.5) * noiseFactor;

    // Add environmental influence
    const environmentalFactor = (setpoint - currentTemperature) * 0.01;

    // Update temperature with noise and environmental factors
    currentTemperature += noise + environmentalFactor;
}

function simulateSystemResponseQ() {

    // Add environmental influence
    const environmentalFactor = (setpoint - currentTemperature) * 0.01;

    // Update temperature with noise and environmental factors
    currentTemperature += environmentalFactor;
}
// -------------------------------------------- Separate -------------------------------------------------------------------

function separate(input,select)
{
    var l = input.length;
    var temp = "";
    var final = [];
    for(var i=0; i<l; i++)
    {
        if(input[i]==',')
        {
            var h;
            if(temp=="Inf")
            {
                h = 99999;
            }
            if(temp=="-Inf")
            {
                h = -99999;
            }
            if(select==1)
            {
                h = parseInt(temp);
            }
            else
            {
                h = parseFloat(temp);
            }
            final.push(h);
            temp = "";
        }
        else
        {
            temp = temp + input[i];
        }
    }
    if(select==1)
    {
        var o = parseInt(temp);
        final.push(o);
        if(temp=="Inf")
        {
            o = 99999;
        }
        if(temp=="-Inf")
        {
            o = -99999;
        }
    }
    else
    {
        var o = parseFloat(temp);
        final.push(o);
        if(temp=="Inf")
        {
            o = 99999;
        }
        if(temp=="-Inf")
        {
            o = -99999;
        }
    }
    return final;
}


// ----------------------------------------- Custom System -----------------------------------------------------------


function generateRandomSystem() {
    const zeta = (Math.random() * 2 - 1).toFixed(2); // Random value between -1 and 1
    const wn = (Math.random() * 2).toFixed(2); // Random value between 0 and 2

    document.getElementById("zetaQuiz").value = zeta;
    document.getElementById("wnQuiz").value = wn;

    document.getElementById("secondOrderQuizResult").innerHTML = '';
    Plotly.newPlot('secondOrderQuizPlot', []);
    Plotly.newPlot('poleZeroQuizPlot', []);
}


function checkStability() {
    const zeta = parseFloat(document.getElementById("zetaQuiz").value);
    const wn = parseFloat(document.getElementById("wnQuiz").value);
    const resultDiv = document.getElementById("secondOrderQuizResult");

    // Discrete simulation via simple Euler integration (always plot, even if unstable)
    const dt = 0.01;
    const totalTime = 10.0; // Extend simulation time to 10 seconds
    const steps = Math.round(totalTime / dt);
    let x = 0;
    let xdot = 0; // system states
    const tData = [];
    const yData = [];

    for (let i = 0; i <= steps; i++) {
        const t = i * dt;
        tData.push(t);

        // x'' + 2*zeta*wn*x' + wn^2*x = wn^2 (unit step input)
        const xddot = wn * wn - 2 * zeta * wn * xdot - wn * wn * x;

        // Euler update
        xdot += xddot * dt;
        x += xdot * dt;

        yData.push(x);
    }

    // Plot step response
    const trace = {
        x: tData,
        y: yData,
        type: 'scatter',
        mode: 'lines'
    };
    const layout = {
        title: 'Second-Order Step Response',
        xaxis: { title: 'Time (s)' },
        yaxis: { title: 'Output' }
    };
    Plotly.newPlot('secondOrderQuizPlot', [trace], layout);

    // Calculate poles
    const realPart = -zeta * wn;
    const imagPart = wn * Math.sqrt(1 - zeta * zeta);

    const poles = [
        { x: realPart, y: imagPart },
        { x: realPart, y: -imagPart }
    ];

    // Plot poles and zeros
    const poleTrace = {
        x: poles.map(p => p.x),
        y: poles.map(p => p.y),
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'x',
            size: 10,
            color: 'red'
        },
        name: 'Poles'
    };

    const zeroTrace = {
        x: [0],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'circle',
            size: 10,
            color: 'blue'
        },
        name: 'Zero'
    };

    const poleZeroLayout = {
        title: 'Poles and Zeros',
        xaxis: { title: 'Real Part' },
        yaxis: { title: 'Imaginary Part' },
        showlegend: true
    };

    Plotly.newPlot('poleZeroQuizPlot', [poleTrace, zeroTrace], poleZeroLayout);

    // Check user answer
    const stabilityForm = document.getElementById("stabilityForm");
    const userAnswer = stabilityForm.elements["stability"].value;
    const isStable = zeta > 0 && wn > 0;

    if ((isStable && userAnswer === "yes") || (!isStable && userAnswer === "no")) {
        resultDiv.innerHTML = '<span style="color:green;font-weight:bold;">Correct! The system is ' + (isStable ? 'stable' : 'unstable') + '.</span>';
    } else {
        resultDiv.innerHTML = '<span style="color:red;font-weight:bold;">Incorrect. The system is ' + (isStable ? 'stable' : 'unstable') + '.</span>';
    }
}


function generateRandomCustomSystem() {
    const stabilityFactor = Math.random();
    let aVal, bVal, cVal, dVal;

    if (stabilityFactor > 0.5) {
        aVal = (Math.random() * 4 - 2).toFixed(2);
        bVal = (Math.random() * 4 - 2).toFixed(2);
        cVal = (Math.random() * 4 - 2).toFixed(2);
        dVal = (Math.random() * 4 - 2).toFixed(2);
    } else {

        aVal = (Math.random() * 2 - 1).toFixed(2);
        bVal = (Math.random() * 2 - 1).toFixed(2);
        cVal = (Math.random() * 2 - 1).toFixed(2);
        dVal = (Math.random() * 2 - 1).toFixed(2);
    }

    document.getElementById("aValQuiz").value = aVal;
    document.getElementById("bValQuiz").value = bVal;
    document.getElementById("cValQuiz").value = cVal;
    document.getElementById("dValQuiz").value = dVal;

    document.getElementById("customSystemQuizResult").innerHTML = '';
    Plotly.newPlot('customSystemQuizPlot', []);
}

function checkCustomSystemStability() {
    const aVal = parseFloat(document.getElementById("aValQuiz").value);
    const bVal = parseFloat(document.getElementById("bValQuiz").value);
    const cVal = parseFloat(document.getElementById("cValQuiz").value);
    const dVal = parseFloat(document.getElementById("dValQuiz").value);
    const resultDiv = document.getElementById("customSystemQuizResult");

    var nData = [];
    var xData = [];

    // Generate x(n) for n=0..30
    for (var n = 0; n <= 30; n++) {
        var xVal = math.add(math.pow(math.complex(aVal, bVal), n), math.pow(math.complex(cVal, dVal), n));
        nData.push(n);
        xData.push(xVal);
    }

    // Plot results
    var trace = {
        x: nData,
        y: xData.map(val => math.abs(val)),
        type: 'scatter',
        mode: 'lines'
    };
    var layout = {
        title: 'Absolute Impulse Response',
        xaxis: { title: 'n' },
        yaxis: { title: '|x[n]|' }
    };
    Plotly.newPlot('customSystemQuizPlot', [trace], layout);

    // Check stability: simple check if |a|<1 and |b|<1
    var moda = math.sqrt(aVal * aVal + bVal * bVal);
    var modc = math.sqrt(cVal * cVal + dVal * dVal);
    const isStable = moda < 1 && modc < 1;

    // Check user answer
    const stabilityForm = document.getElementById("customStabilityForm");
    const userAnswer = stabilityForm.elements["customStability"].value;

    if ((isStable && userAnswer === "yes") || (!isStable && userAnswer === "no")) {
        resultDiv.innerHTML = '<span style="color:green;font-weight:bold;">Correct! The system is ' + (isStable ? 'stable' : 'unstable') + '.</span>';
    } else {
        resultDiv.innerHTML = '<span style="color:red;font-weight:bold;">Incorrect. The system is ' + (isStable ? 'stable' : 'unstable') + '.</span>';
    }
}



function simulateCustomSystem() {
    var c1 = parseFloat(document.getElementById("c1").value);
    var c2 = parseFloat(document.getElementById("c2").value);
    var aVal = parseFloat(document.getElementById("aVal").value);
    var bVal = parseFloat(document.getElementById("bVal").value);

    var nData = [];
    var xData = [];

    // Generate x(n) for n=0..30
    for (var n = 0; n <= 30; n++) {
        var xVal = c1 * Math.pow(aVal, n) + c2 * Math.pow(bVal, n);
        nData.push(n);
        xData.push(xVal);
    }

    // Plot results
    var trace = {
        x: nData,
        y: xData,
        type: 'scatter',
        mode: 'lines'
    };
    var layout = {
        title: 'Custom System Response',
        xaxis: { title: 'n' },
        yaxis: { title: 'x(n)' }
    };
    Plotly.newPlot('customSystemPlot', [trace], layout);

    // Check stability: simple check if |a|<1 and |b|<1
    var res = document.getElementById("customSystemResult");
    if (Math.abs(aVal) < 1 && Math.abs(bVal) < 1) {
        res.innerHTML = '<span style="color: green; font-weight:bold;">System is stable</span>';
    } else {
        res.innerHTML = '<span style="color: red; font-weight:bold;">System is NOT stable</span>';
    }
}

function simulateSecondOrderSystem() {
    // Read user inputs
    const zeta = parseFloat(document.getElementById("zeta").value);
    const wn = parseFloat(document.getElementById("wn").value);
    const resultDiv = document.getElementById("secondOrderResult");

    // Discrete simulation via simple Euler integration (always plot, even if unstable)
    const dt = 0.01;
    const totalTime = 10.0; // Extend simulation time to 10 seconds
    const steps = Math.round(totalTime / dt);
    let x = 0;
    let xdot = 0; // system states
    const tData = [];
    const yData = [];

    for (let i = 0; i <= steps; i++) {
        const t = i * dt;
        tData.push(t);

        // x'' + 2*zeta*wn*x' + wn^2*x = wn^2 (unit step input)
        const xddot = wn * wn - 2 * zeta * wn * xdot - wn * wn * x;

        // Euler update
        xdot += xddot * dt;
        x += xdot * dt;

        yData.push(x);
    }

    // Plot step response
    const trace = {
        x: tData,
        y: yData,
        type: 'scatter',
        mode: 'lines'
    };
    const layout = {
        title: 'Second-Order Step Response',
        xaxis: { title: 'Time (s)' },
        yaxis: { title: 'Output' }
    };
    Plotly.newPlot('secondOrderQuizPlot', [trace], layout);

    // Calculate poles
    const realPart = -zeta * wn;
    const imagPart = wn * Math.sqrt(1 - zeta * zeta);

    const poles = [
        { x: realPart, y: imagPart },
        { x: realPart, y: -imagPart }
    ];

    // Plot poles and zeros
    const poleTrace = {
        x: poles.map(p => p.x),
        y: poles.map(p => p.y),
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'x',
            size: 10,
            color: 'red'
        },
        name: 'Poles'
    };

    const zeroTrace = {
        x: [0],
        y: [0],
        type: 'scatter',
        mode: 'markers',
        marker: {
            symbol: 'circle',
            size: 10,
            color: 'blue'
        },
        name: 'Zero'
    };

    const poleZeroLayout = {
        title: 'Poles and Zeros',
        xaxis: { title: 'Real Part' },
        yaxis: { title: 'Imaginary Part' },
        showlegend: true
    };

    Plotly.newPlot('poleZeroQuizPlot', [poleTrace, zeroTrace], poleZeroLayout);

    // Display result: stable or not
    if (zeta > 0 && wn > 0) {
        resultDiv.innerHTML = '<span style="color:green;font-weight:bold;">System simulated. For ζ>0 and ωn>0, system is stable.</span>';
    } else {
        resultDiv.innerHTML = '<span style="color:red;font-weight:bold;">Parameters indicate an unstable or invalid system.</span>';
    }
}

// ----------------------------------------------------- ROC QUiz -------------------------------------------------

var pole11 = 0;
var pole21 = 0;

function ROCQuizInit()
{
    var k1 = 0;
    while(k1==0)
    {
        k1 = (Math.random()-0.5)*2;
    }
    var k2 = 0;
    while(k2==0)
    {
        k2 = (Math.random()-0.5)*2;
    }
    var k3 = 0;
    while(k3==0)
    {
        k3 = (Math.random()-0.5)*2;
    }

    var element = document.getElementById("result2")
    element.style.color = "#0000FF";
    element.style.fontWeight = "bold";
    element.innerHTML = 'k1 = ' + (Math.round(k1*100)/100).toString() + ', k2 = ' + (Math.round(k2*100)/100).toString() + ', k3 = ' + (Math.round(k3*100)/100).toString();

    if((k3-1)/k2 < 0)
    {
        pole11 = Math.round(((k3-1)/k2)*100)/100;
        pole21 = 0;
    }
    else
    {
        pole21 = Math.round(((k3-1)/k2)*100)/100;
        pole11 = 0;
    }
}

function ROCQuiz()
{
    var flag1 = 1;
    var flag2 = 1;

    var flag = 1;


    const yesRadio = document.querySelector('input[name="yesno"][value="yes"]');
    const noRadio = document.querySelector('input[name="yesno"][value="no"]');

    if(!yesRadio.checked && !noRadio.checked)
    {
        flag = 0;
    }
    else
    {
        if(yesRadio.checked)
        {
            flag1 = 0;
        }
    }

    if(flag)
    {
        var polesString = document.getElementById("poles").value;
        var temp = separate(polesString,2);
        console.log(temp);
        if(temp.length!=2){
            flag2=0;
        }
        p1 = temp[0];
        p2 = temp[1];

        if(p1>p2)
        {
            var t = p1;
            p1 = p2;
            p2 = t;
        }

        if(Math.abs(p1-pole11)>1e-2 || Math.abs(p2-pole21)>1e-2)
        {
            flag2 = 0;
        }

        if(flag1 & flag2)
        {
            var element = document.getElementById("result3")
            element.style.color = "#006400";
            element.style.fontWeight = "bold";
            element.innerHTML = 'Both are Correct!!';
        }
        else if(!flag1 & flag2)
        {
            var element = document.getElementById("result3")
            element.style.color = "#FF0000";
            element.style.fontWeight = "bold";
            element.innerHTML = 'Wrong Option Selected, but right poles entered!!';
        }
        else if(flag1 & !flag2)
        {
            var element = document.getElementById("result3")
            element.style.color = "#FF0000";
            element.style.fontWeight = "bold";
            element.innerHTML = 'Right Option Selected, but wrong poles entered!!';
        }
        else if(!flag1 & !flag2)
        {
            var element = document.getElementById("result3")
            element.style.color = "#FF0000";
            element.style.fontWeight = "bold";
            element.innerHTML = 'Wrong Option Selected, and wrong poles entered!!';
        }
    }
    else
    {
        var element = document.getElementById("result3")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Please select an option!!';
    }
}

// ------------------------------------- Temp PID Quiz -----------------------------------------------

function PIDTemperatureQuiz(){

    iter = 0;

    var plotDiv = document.getElementById("figure4");
    Plotly.purge(plotDiv);


    temperatures = [];
    currentTemperature = 10;

    var kp1 = document.getElementById("kpq").value;
    kp = parseFloat(kp1);
    var ki1 = document.getElementById("kiq").value;
    ki = parseFloat(ki1);
    var kd1 = document.getElementById("kdq").value;
    kd = parseFloat(kd1);

    setpoint = 30;

    temperatures.push(currentTemperature);
    var flag = 0;

    // Main control loop
    const intervalId = setInterval(() => {
    // Update the error and calculate the PID output
    var error = setpoint - currentTemperature;

    if(iter>60)
    {
        var element = document.getElementById("result4")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'The system is did not reach setpoint in 100 steps!!';
        flag = 1;
        clearInterval(intervalId);
    }

    if((Math.abs(error) < 1e-2))
    {
        var xt = [];

        for(var i=0; i<=iter; i++)
        {
            xt.push(i/2);
        }

        var yt = [];

        var N = xt.length;
        for(var i=0; i<N; i++)
        {
            yt.push(setpoint);
        }

        var trace = {
            x: xt,
            y: temperatures,
            type: 'scatter',
            mode: 'line'
        };
        var trace2 = {
            x: xt,
            y: yt,
            mode: 'line',
            line: {
                dash: 'dot', // Set the line style to "dot" (dotted line)
                color: 'red', // Line color
                width: 2       // Line width
            }
        };

        var data = [trace,trace2];

        //var config = {responsive: true}
        var layout1 = {
            title: 'Temperature Control',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Temperature (°C)'
            }
        };

        Plotly.newPlot('figure4', data, layout1);

        if(screen.width < 400)
        {
            var update = {
                width: 0.7*screen.width,
                height: 400
            };
        }
        else
        {
            var update = {
                width: 350,
                height: 400
            };
        }

        Plotly.relayout('figure4', update);
        flag = 1;
        var element = document.getElementById("result4")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Setpoint Temperature reached within 100sec!!';
        clearInterval(intervalId);
    }

    var output = calculatePIDOutput(error, kp, ki, kd);

    // Apply the output to control the system (e.g., adjust heating/cooling power)
    adjustSystem(output);

    // Simulate the system's response by updating the current temperature
    simulateSystemResponseQ();

    if(flag==0)
    {
        // Log the current temperature and PID output for demonstration
        var element = document.getElementById("result4")
        element.style.color = "#0000FF";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Calculating... Current Temperature - ' + (Math.round(currentTemperature*100)/100).toString() + '°C';

        var xt = [];

        for(var i=0; i<=iter; i++)
        {
            xt.push(i/2);
        }

        var yt = [];

        var N = xt.length;
        for(var i=0; i<N; i++)
        {
            yt.push(setpoint);
        }

        var trace = {
            x: xt,
            y: temperatures,
            type: 'scatter',
            mode: 'line'
        };
        var trace2 = {
            x: xt,
            y: yt,
            mode: 'line',
            line: {
                dash: 'dot', // Set the line style to "dot" (dotted line)
                color: 'red', // Line color
                width: 2       // Line width
            }
        };

        var data = [trace,trace2];

        //var config = {responsive: true}
        var layout1 = {
            title: 'Temperature Control',
            showlegend: false,
            xaxis: {
                title: 'Time (s)'
            },
            yaxis: {
                title: 'Temperature (°C)'
            }
        };

        Plotly.newPlot('figure4', data, layout1);

        if(screen.width < 400)
        {
            var update = {
                width: 0.7*screen.width,
                height: 400
            };
        }
        else
        {
            var update = {
                width: 350,
                height: 400
            };
        }

        Plotly.relayout('figure4', update);
    }

    iter++;
    temperatures.push(currentTemperature);

    }, interval);
}


/* ---------------------------- LinSpace -------------------------------------- */

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

// ------------------------------------------ On startup ----------------------------------------------------------

function startup()
{
    document.getElementById("default").click();
}

window.onload = startup;
