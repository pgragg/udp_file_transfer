import fs from 'fs'
import { UDPSocket } from '../../entities/udpSocket'
import { ReaderMessageReceiver } from '../socketMessage/useCases/readerMessageReceiver'
import { JobHandler } from '../process/jobHandler'
import { ChunkTransfer } from './chunkTransfer'
import { Job } from '../process/job'
import { Logger } from '../../helpers/logger'

export const read = async ({ port, fileName, chunkSize }: {
    port: number, fileName: string, chunkSize: number
}) => {

    // Create n processes at once to read k bytes from the fileName
    // The server will receive the Message and verify the checksum 
    // if the checksum does not pass, the server will respond with a failure message
    // if the checksum does pass, the server will respond with a success message.
    const jobHandler = new JobHandler()

    const stats = fs.statSync(fileName);
    const fileSizeInBytes = stats.size;
    Logger.log({ fileSizeInBytes })

    let startByte = 0;
    Logger.log({ totalWorkers: fileSizeInBytes / chunkSize })
    while (startByte < fileSizeInBytes) {
        Logger.log({ startByte })
        const endByte = startByte + chunkSize;
        const chunkTransfer = new ChunkTransfer({ port, fileName, startByte, endByte });
        const job = new Job({ id: startByte, jobTask: chunkTransfer })
        jobHandler.add(job)
        startByte += chunkSize;
    }
    const jobRunnerId = setInterval(() => {
        jobHandler.runJobs()
    }, 2000)

    setInterval(() => {
        if (jobHandler.isFinished()) {
            clearInterval(jobRunnerId)
            process.exit(0);
        }
    }, 100)
}
