import fs from 'fs'
import { JobHandler } from '../process/jobHandler'
import { ChunkTransfer } from './chunkTransfer'
import { Job } from '../process/job'

export const read = async ({ port, fileName, chunkSize, maxPoolSize }: {
    port: number, fileName: string, chunkSize: number, maxPoolSize: number
}) => {

    // Create n processes at once to read k bytes from the fileName
    // The server will receive the Message and verify the checksum 
    // if the checksum does not pass, the server will respond with a failure message
    // if the checksum does pass, the server will respond with a success message.
    const jobHandler = new JobHandler({maxPoolSize})

    const stats = fs.statSync(fileName);
    const fileSizeInBytes = stats.size;

    let startByte = 0;
    while (startByte < fileSizeInBytes) {
        const endByte = startByte + chunkSize;
        const chunkTransfer = new ChunkTransfer({ port, fileName, startByte, endByte });
        const job = new Job({ id: startByte, jobTask: chunkTransfer })
        jobHandler.add(job)
        startByte += chunkSize;
    }

    const jobRunnerId = setInterval(() => {
        jobHandler.runJobs()
    }, 500)

    setInterval(() => {
        if (jobHandler.isFinished()) {
            clearInterval(jobRunnerId)
            process.exit(0);
        }
    }, 100)
}
