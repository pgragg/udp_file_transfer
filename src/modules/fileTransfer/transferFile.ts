import fs from 'fs'
import { WriterMessageReceiver } from '../socketMessage/useCases/writerMessageReceiver'
import { UDPSocket } from '../../entities/udpSocket'
import { ReaderMessageReceiver } from '../socketMessage/useCases/readerMessageReceiver'
import { JobHandler } from '../process/jobHandler'
import { ChunkTransfer } from './chunkTransfer'
import { Job } from '../process/job'

export const transferFile = async ({ port, fileName, targetFileName }: {
    port: number, fileName: string, targetFileName: string
}) => {

    // Create n processes at once to read k bytes from the fileName
    // The server will receive the Message and verify the checksum 
    // if the checksum does not pass, the server will respond with a failure message
    // if the checksum does pass, the server will respond with a success message.
    const jobHandler = new JobHandler()

    const timeout = 5000;
    UDPSocket.create({ port, timeout, messageReceiver: new WriterMessageReceiver(targetFileName) })

    const stats = fs.statSync(fileName);
    const fileSizeInBytes = stats.size;
    console.log({ fileSizeInBytes })
    const chunkSize = 1000;
    let startByte = 0;

    let promises: Promise<any>[] = [];
    while (startByte < fileSizeInBytes) {
        console.log({ startByte })
        const endByte = startByte + chunkSize;
        const client = UDPSocket.create({ messageReceiver: new ReaderMessageReceiver(jobHandler) })
        const chunkTransfer = new ChunkTransfer({ client, port, fileName, startByte, endByte });
        const job = new Job({ id: startByte, jobTask: chunkTransfer })
        jobHandler.add(job)
        startByte += chunkSize;
    }
    jobHandler.runJobs();

}
