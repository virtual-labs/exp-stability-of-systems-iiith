### Procedure

#### PID Controller

This section aims to visualize the s-plane plot of a PID controller. This requires the filling in of kp, ki and kd constants of a PID controller. The transfer function H(s) of a PID controller is given as $H(s) = k_{p} + \frac{1}{s} k_{i} + s k_{d} $. The system (Task) is a room, in a noiseless case (no external influence on temperature). Click on the "**Plot**" button to visualize the s-plane plot and the magnitude response of the system. Steps to be done are as follows

1. Enter value for kp (proportional constant)
2. Enter value for ki (integral constant) 
3. Enter value for kd (differential constant)
4. Click on the "Plot" button to visualise the s-plane plot for the PID controller

The plots are obtained and they are the s-plane plot ('+' for poles and 'o' for zeros) and the magnitude response of the specified PID controller based system.

#### PID Temperature

This section aims to visualize the live temperature changes and the time-dynamics of a PID-based temperature controlled room. This requires the filling in of current temperature, set temperature (target) and kp, ki and kd constants of the PID-based temperature controller. The transfer function H(s) of a PID controller is given as $H(s) = k_{p} + \frac{1}{s} k_{i} + s k_{d} $. The system (Task) is a room, in a gaussian noise case, that is, it is assumed that the room randomly changes its current temperature. Click on the "**Simulate**" button to visualize the live plotting of the temperature of the room. Steps to be done are as follows

1. Enter value for current temperature (start temperature for the controller)
2. Enter value for set temperature (target temperature for the controller)
3. Enter value for kp (proportional constant)
4. Enter value for ki (integral constant)
5. Enter value for kd (differential constant)
6. Click on the "Plot" button to visualise a live simulation and plotting of the time dynamics of a PID controlled temperature controller
								

The plot is obtained and it shows the live temperature changes based on the given parameters for the PID-based temperature controller. The blue curve is the current temperature and the red line is the target temperature.

#### Quiz 1

This section aims to test the understanding of stability of systems from an s-transform based perspective. There is a system provided in the figure. Firstly, it is expected that the transfer function of the same is calculated. Further, the following questions should be answered with the steps as follows

1. Select if the system given in the figure with the provided constants (in blue below) is stable or not
2. Enter the poles separated with commas
3. Truncate the values to 2 decimal places, i.e., 2.348 should be 2.34
4. Click on the "Check" button to verify your answer and get feedback observations on the right
								
Feedback is obtained on the right side in the observations panel.

#### Quiz 2

This section aims to test the understanding of speed of operation of the PID-based temparature control of a room. The transfer function H(s) of a PID controller is given as $H(s) = k_{p} + \frac{1}{s} k_{i} + s k_{d} $. The system (Task) is a room, in a gaussian noise case, that is, it is assumed that the room randomly changes its current temperature. The target is to reach the goal in 100 seconds. Click on the "**Simulate**" button to visualize the live plotting of the temperature of the room. Steps to be done are as follows

1. Enter value for kp (proportional constant)
2. Enter value for ki (integral constant) 
3. Enter value for kd (differential constant)
4. For the given current temperature, you are expected to reach the given set temperature within 100 seconds
5. Click on the "Simulate & Check" button to see a live simulation and verify your answer and get feedback observations on the right
								
								
Feedback and live temperature plot are obtained on the right side in the observations panel.