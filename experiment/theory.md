

# Laplace transform # 

 The Laplace transform of a continuous time signal $\text{x}(t)$ can be expressed as: 
$$\text{X}(s) = \int_{-\infty}^{\infty} \text{x}(t) e^{-st} dt$$

Where $s = \sigma + j \omega$ represent a complex frequency on a complex number plane. 

$$ e^{-st} = e^{-(\sigma+j\omega)t} = e^{-\sigma t} e^{-j\omega t} $$ 

We can clearly see that  

$Re\{e^{-s t}\} = e^{-\sigma t} \cos(\omega t)  $

$Im\{e^{-s t}\} =  - e^{-\sigma t} \sin(\omega t)$ 

## Eigenfunctions of LTI systems ##

Let the system $h(t)$ be a linear and time invariant (LTI) system and the input $\text{x}(t) = e^{st}$. The output $\text{y}(t)$ of this system can be written as 

 <p align="center"><img src="Block_diag_1.drawio.png" alt="drawing" width="300"/>

$ \text{y}(t) = e^{st} * h(t) $

$~~~~~~~ =  \int_{-\infty}^{\infty} h(\tau) e^{s(t-\tau)} d\tau $

$~~~~~~~ =  \int_{-\infty}^{\infty}~ h(\tau) ~e^{st}~ e^{-s\tau} ~d\tau $

$~~~~~~~=  e^{st}   \int_{-\infty}^{\infty}~ h(\tau)~ e^{-s\tau} d\tau $

$~~~~~~~       =  H(s) e^{st}  $

$e^{st}$ is known as eigen function for LTI system and it preserved the shape of the input signal. 

Note: 
1)  All RLC circuits are LTI systems 

2) Any AC source always gives sinusoidal voltage/current across any part of the circuit 

3) The amplitude and phase might change but the shape remains the same 
 
The Laplace transform has always two parts:  

1) Mathematical expression 

2) Region of convergence: the region in s-plane, where the mathematical expression is valid. 

## Example: ##

1) $\text{x}(t) = e^{-t} u(t) $

    Solution: We know that Laplace tranform is given as:

 $~~~~~~~~~~~~~~~~~~~~~~\text{X}(s) = \int_{-\infty}^{\ infty} \text{x}(t) e^{-st} dt $

$~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  =  \int_{0}^{\infty} e^{-t}  e^{-st} dt $

$~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ = \int_{0}^{\ infity}  e^{-(s+1)t} dt $

$~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~= \frac{1}{s+1} $    

* Region of convergence (ROC) is region in the s-plane where the above expression is valid.  

* The expression is valid if $Re{\{s+1\}} > 0$   i.e. $Re{\{s\}} > -1$. $ s = -1$ is a point of singularity. 

 <p align="center"><img src="roc1.png" alt="drawing" width="300"/>

 Let $\text{X}(s)$ be the polynomials in $s$ variable as below: 

$$\text{X}(s) = \frac{\text{A}(s)}{\text{B}(s)}$$			 

Roots of $\text{A}(s)$ i.e. $ \text{A}(s) = 0 \rightarrow $ zeros 

Roots of $\text{B}(s)$  i.e. $\text{A}(s) = 0 \rightarrow $ poles 

Note: Poles play important role to decide ROC nit ROC cannot have poles within them. 

## Exercise: ##

 What is the ROC in above example? 
  <p align="center"><img src="roc2.png" alt="drawing" width="300"/>

## Linear constant coefficient differential equations (LCCDE): ##  

Any linear constant coefficient differential equations (LCCDE) in Laplace domain can be expressed as ratio of polynomials. 

Example: Let $\text{x}(t) = \frac{d\text{y}}{dt} + a~\text{y}(t)$ 

Taking Laplace transform of the above equation: 

$ ~~~~~~~~~~~\text{X}(s) = s\text{Y}(s) + a \text{Y}(s)$

$~~~~~~~~~~~ \text{X}(s) = (s + a)~ \text{Y}(s)$

$~~~~~~~~~~~\text{Y}(s) =  \frac{\text{X}(s)}{s + a}$

$~~~~~~~~~~~ \text{H}(s) = \frac{\text{Y}(s)}{\text{X}(s)} =  \frac{1}{s + a}$  

Here $\text{H}(s)$ is known as transfer function or system function. 

## Application of Laplace transform for system analysis – Causality and stability  ## 


<p align="center"><img src="Block_diag_1.drawio.png" alt="drawing" width="300"/>


Let $h(t)$ be the system with input $\text{x}(t)$ and output being $\text{y}(t)$.  

$~~~~~\text{y}(t) = \text{x}(t) * h(t)$ 

The system input-output relationship in Laplace transform can be expressed as: 

$~~~\text{Y}(s) = \text{X}(s) \text{H}(s)$ 

We are interested in additional system properties and their effect on impulse response and system function 

## Causality of LTI system:  ##

For LTI system to be causal, we should have 

$~~~~h(t) =0, ~~\forall~ t<0 $ 

$~~~~ \text{y}(t) = \text{x}(t)*h(t) = \int_{-\infty}^{\infty} \text{x}(\tau) h(t-\tau) d\tau$ 

For Causality: we should only use $\text{x}(\tau)$ for $\tau \leq t$ 

$\tau > t,~ h(t-\tau) = 0 $ 

$h(t) = 0~~ \forall~ t<0$ 

* For a causal system ($h(t)$ is a right-sided signal) , what is nature of $\text{H}(s)$ ? 

* ROC of $\text{H}(s)$ will be right-sided plane. (Converse is not true in general) 

* For a system with rational system function, causality is equivalent to the ROC being right-sided plane to the right of right most pole. 


Example:
 1) $\text{H}(s) = \frac{1}{s+1}~\text{and}~ Re\{s\} > -1$ 

$~~~~~~~~~~h(t) = e^{-t} u(t)$		(Causal) 

2) $\text{H}(s) = \frac{e^s}{s+1}$ and $Re\{s\} > -1$ 

$~~~~~~~~~~h(t) = e^{-(t+1)} u(t+1)$		(Non-causal) 

 

## Stability of LTI system (bounded input bounded output): ##


An LTI system is said to be stable if 

$$\int_{\infty}^{\infty} |h(t)| dt < \infty$$ 

i.e. $h(t)$ is absolutely integrable 

We know Laplace transform is given as: 

$$~~~~\text{H}(s) = \int_{\infty}^{\infty} h(t) e^{-st} dt$$ 

$$ \text{H}(s)|_{s=0} = \int_{\infty}^{\infty} h(t) dt < \infty$$ 

Laplace transform converges at $s=0$, In fact, for any $s=j\omega = 0+j\omega, ~\text{H}(s)|_{s=j\omega} < \infty \rightarrow $ system is stable 

Note: $j\omega$-axis i.e. $Re\{s\} = 0$ is part of the ROC 

Example:

 1) Shifting operator:  $h(t) = \delta(t-t_0)$
 
    Taking Laplace transform: $  \text{H}(s) =  e^{st_0}$ 
    
    ROC: Full $s$-plane (stable)   
 2) Integrator: $h(t) = u(t)$  
  Taking Laplace transform:  $\text{H}(s) = \frac{1}{s}$ 
  
    ROC:  $Re\{s\} > 0$ (Not stable)

Note: A causal system with rational system function is stable if and only if: all the poles have negative real part  
## Frequency analysis and geometric interpretation: ##


Let $ \text{H}(s) = \frac{1}{s+1} $ 

The pole-zero plot on $s$-plane is  

<p align="center"><img src="roc3.png" alt="drawing" width="300"/>

Evaluating $\text{H}(s)$ at any point at $s = s_0$ in the $s$-plane 

$\text{H}(s)|_{s=s_0} = \frac{1}{s_0 +1}$ 

<p align="center"><img src="roc4.png" alt="drawing" width="300"/>

$\text{H}(s)|_{s=s_0} = |\text{H}(s_0)| e^{j\angle \text{H}(s_0)}$ 

$|\text{H}(s_0)|  =  \frac{1}{|s_0 + 1|}$ and $\angle \text{H}(s_0) = \theta$ 

 

Given a rational system function:  

$\text{H}(s) = \frac{\prod_{i=1}^{M} (s-z_i)}{\prod_{i=1}^{N } (s-p_i)} \quad \text{and ROC~}  N>M $

$|\text{H}(s)|_{s=s_0} = \frac{\prod_{i=1}^{M} (s-z_i)}{\prod_{i=1}^{N }|s_0 -  P_i|}$ 

$\angle \text{H}(s)|_{s=s_0} = \sum_{i=1}^{M} \angle(s_0 – \text{z}_i) - \sum_{i=1}^{N} \angle (s_0 – P_i) $

Example:
Let $\text{x}(t) = \cos(\omega_0 t)$ for given $\text{H}(s) = \frac{1}{s+1}$ and $Re\{s\} > -1$

$\cos(\omega_0 t) \rightarrow  \frac{1}{\sqrt{1+\omega_0^2}} \cos({\omega_ot-\theta})$

where $\theta = tan^{-1}({\omega_0})$

$|\text{H}(j\omega_o)| =  \frac{1}{\sqrt{1+\omega_0^2}} \rightarrow$ Low pass filter

For any LTI system $ \cos({\omega_o}) \rightarrow |\text{H}(j\omega_o)|\cos({\omega_ot-\theta})$

and $\theta = \angle ~\text{H}{(j\omega_0})$

where $|\text{H}(j\omega_o)| \rightarrow \text{magnitude response}$ and $\angle \text{H}(j\omega_o) \rightarrow \text{phase response}$

The $\text{H}(s) = \frac{s}{s+1} \rightarrow$ High Pass filter