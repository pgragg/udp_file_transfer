How does this work? 

dist/index.js starts a process to transfer a file to a targetFileName over a port using UDP. 

It does this by creating a master process and attaching a number of "client" processes, each of which is assigned a startByte and endByte to transfer over UDP to the 'writerMessageReceiver', which then writes the bytes. 

Each client process is identified by its startByte. When a successful write occurs on the other end, a Status is sent back with Status.status === 'success' for a given startByte. This updates the master process. Once the master process is assured that all startBytes are 'success'es, it closes.

The write server, when it receives the Message, verifies the checksum of the message.
if the checksum does not pass, the server will respond with a failure message
if the checksum does pass, the server will respond with a success message.

TODO: reuse clients in a clientPool
TODO: retry any jobs which don't succeed within a timeframe.