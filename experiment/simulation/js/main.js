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

function sPlane(){

    var kp1 = document.getElementById("kp").value;
    kp = parseFloat(kp1);
    var ki1 = document.getElementById("ki").value;
    ki = parseFloat(ki1);
    var kd1 = document.getElementById("kd").value;
    kd = parseFloat(kd1);

    N = 1001;

    var inside = ((1+kp)*(1+kp)) - 4*kd*ki;
    var polesReal = [];
    var polesImag = [];

    if(inside<0)
    {
        polesReal.push(-(1+kp)/(2*kd));
        polesReal.push(-(1+kp)/(2*kd));
        polesImag.push(Math.sqrt(-inside)/(2*kd));
        polesImag.push(-Math.sqrt(-inside)/(2*kd));
    }
    else
    {
        polesReal.push(-(1+kp+(Math.sqrt(inside)))/(2*kd));
        polesReal.push(-(1+kp-(Math.sqrt(inside)))/(2*kd));
        polesImag.push(0);
        polesImag.push(0);
    }

    var inside = ((kp)*(kp)) - 4*kd*ki;

    var zerosReal = [];
    var zerosImag = [];

    if(inside<0)
    {
        zerosReal.push(-(kp)/(2*kd));
        zerosReal.push(-(kp)/(2*kd));
        zerosImag.push(Math.sqrt(-inside)/(2*kd));
        zerosImag.push(-Math.sqrt(-inside)/(2*kd));
    }
    else
    {
        zerosReal.push(-(kp+(Math.sqrt(inside)))/(2*kd));
        zerosReal.push(-(kp-(Math.sqrt(inside)))/(2*kd));
        zerosImag.push(0);
        zerosImag.push(0);
    }

    w = makeArr(-math.PI,math.PI,N);
    plty = [];

    for(var i=0; i<N; i++)
    {
        plty.push(((ki-(kd*w[i]))*(ki-(kd*w[i]))+(w[i]*kp)*(w[i]*kp))/((ki-(kd*w[i]))*(ki-(kd*w[i]))+(w[i]*(kp+1))*(w[i]*(kp+1))));
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
    var trace3 = {
        x: w,
        y: plty,
        type: 'scatter',
        mode: 'line',
    };
      
    var data = [trace1, trace2];
    var data1 = [trace3];

    var config = {responsive: true}
    var layout1 = {
        title: '|H(s)|',
        showlegend: false,
        xaxis: {
            title: 'Frequency'
        },
        yaxis: {
            title: 'Magnitude'
        }
    };
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

    Plotly.relayout('figure1', update);
    Plotly.newPlot('figure2', data1, layout1, config);
            
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

    Plotly.relayout('figure2', update);
}

// ------------------------------------------------- PID Working Temperature -----------------------------------------------

var setpoint = 0;
var currentTemperature = 0;
var interval = 500;
var iter = 0;

var temperatures = [];

function PIDTemperature(){
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
    
    if(Math.abs(error) < 1e-2)
    {
        var xt = [];

        for(var i=0; i<=iter; i++)
        {
            xt.push(i);
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
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Calculating... Current Temperature - ' + (Math.round(currentTemperature*100)/100).toString() + '°C';
    }
  
    iter++;
    temperatures.push(currentTemperature);
  
    }, interval);
}

// Function to calculate the PID output
function calculatePIDOutput(error, kp, ki, kd) {
  const proportional = kp * error;
  const integral = ki * error;
  const derivative = kd * error;

  // Return the sum of the PID components
  return proportional + integral + derivative;
}

// Function to adjust the system based on the PID output
function adjustSystem(output) {
  // Replace this with your code to adjust the system based on the output
  // For this temperature example, you can simulate heating/cooling actions
  if (output > 0) {
    currentTemperature += output;
  } else {
    currentTemperature -= Math.abs(output);
  }
}

// Function to simulate the system's response over time
function simulateSystemResponse() {
  // Replace this with your code to simulate the system's response over time
  // For this temperature example, you can introduce variations, delays, etc.
  // In this simplified example, we'll assume a gradual approach to the setpoint
  if (currentTemperature < setpoint) {
    currentTemperature += Math.random() * 0.5;
  } else {
    currentTemperature -= Math.random() * 0.5;
  }
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

// ----------------------------------------------------- ROC QUiz -------------------------------------------------

var pole11 = 0;
var pole21 = 0;
var pole12 = 0;
var pole22 = 0;

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

    // Assuming you have a form with the id "myForm"
    const form = document.getElementById("myForm");
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
        var enteredROC = document.getElementById("ROC").value;
        const trimmedString = enteredROC.trim();
        const str = "none";
        if(trimmedString.toLowerCase() != str.toLowerCase())
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
            element.innerHTML = 'Wrong Option Selected, but right ROC entered!!';
        }
        else if(flag1 & !flag2)
        {
            var element = document.getElementById("result3")
            element.style.color = "#FF0000";
            element.style.fontWeight = "bold";
            element.innerHTML = 'Right Option Selected, but wrong ROC entered!!';
        }
        else if(!flag1 & !flag2)
        {
            var element = document.getElementById("result3")
            element.style.color = "#FF0000";
            element.style.fontWeight = "bold";
            element.innerHTML = 'Wrong Option Selected, and wrong ROC entered!!';
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

// ---------------------------------------------------- Poles Quiz --------------------------------------------------------

function polesQuizInit()
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

    var element = document.getElementById("result4")
    element.style.color = "#0000FF";
    element.style.fontWeight = "bold";
    element.innerHTML = 'k1 = ' + (Math.round(k1*100)/100).toString() + ', k2 = ' + (Math.round(k2*100)/100).toString() + ', k3 = ' + (Math.round(k3*100)/100).toString();

    if((k3-1)/k2 < 0)
    {
        pole12 = Math.round((((Math.round(k3*100)/100)-1)/(Math.round(k2*100)/100))*100)/100;
        pole22 = 0;
    }
    else
    {
        pole22 = Math.round((((Math.round(k3*100)/100)-1)/(Math.round(k2*100)/100))*100)/100;
        pole12 = 0;
    }
}

function polesQuiz()
{
    var polesString = document.getElementById("poles").value;
    var temp = separate(polesString,2);

    p1 = temp[0];
    p2 = temp[1];

    if(p1>p2)
    {
        var t = p1;
        p1 = p2;
        p2 = t;
    }

    if(Math.abs(p1-pole12)<1e-3 && Math.abs(p2-pole22)<1e-3)
    {
        var element = document.getElementById("result5")
        element.style.color = "#006400";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Right Answer!!';
    }
    else
    {
        var element = document.getElementById("result5")
        element.style.color = "#FF0000";
        element.style.fontWeight = "bold";
        element.innerHTML = 'Wrong Answer!!';
    }
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
    sPlane();
    polesQuizInit();
    ROCQuizInit();
    document.getElementById("default").click();
}

window.onload = startup;