## UDP File Transfer 

## Is it useful? 
No 

## Is it an improvement on anything? 
No 

## Is it, um, a useful proof of concept? 
No 

## Was it fun to build at least? 
Yeah. 

### Quickstart: 
Open two terminal windows. 

In one, run `npm run write`. This will start a localhost server which listens for udp connections on port 2222.

In another terminal window, run `npm run read`. This will start many client processes which communicate with the write server.


#### How does this work? 

`dist/read.js` starts a process to transfer a file to a targetFileName over a port using UDP. 

It does this by creating a master process and attaching a number of "client" processes, each of which is assigned a startByte and endByte to transfer over UDP to the 'writerMessageReceiver', which then writes the bytes. 

Each client process is identified by its startByte. When a successful write occurs on the other end, a Status is sent back with Status.status === 'success' for a given startByte. This updates the master process. Once the master process is assured that all startBytes are 'success'es, it closes.

The write server, when it receives the Message, verifies the checksum of the message.
if the checksum does not pass, the server will respond with a failure message
if the checksum does pass, the server will respond with a success message.

We do not reuse clients, but rather create new clients for each new job. (A client pool may improve performance)
We retry any jobs which don't succeed within a timeout. 
We use multiple writer sockets to receive data.

Job size seems capped at around 1500-2000 bytes.


BUGS: 
- Copying over a PDF seems to end at 96% completion instead of full completion, which is strange because copying over a small bit of text seems fine.

TODO: 
- Performance is molasses.
- Spawn multiple writer sockets from a third process, then take their ports and pass them in as targets for the read process.
- Writer servers should timeout only n seconds after the last received message