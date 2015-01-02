open-dis
========

Javascript implementation of IEEE-1278.1, Distributed Interactive Simulation protocol, widely used in military simulations

This is intended to be used with node.js, primarily on the server side. However it can also be used on the web browser
side with no modifications. Typically this will be used in conjunction with websockets or webrtc on the web server, 
or with node.js networking (native UDP sockets) on the server side. 

It is an implementation of IEEE 1278.1, Distributed Interactive Simulation (DIS), which is widely used in military
virtual simulations. dis6.js is an implementation of version 6 (1998), the most widely used version, and dis7.js is 
an implementation of version 7, which is less widely used.

Don McGregor
mcgredo@nps.edu
