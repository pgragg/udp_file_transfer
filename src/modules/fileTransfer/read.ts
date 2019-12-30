import fs from 'fs'
import { JobHandler } from '../process/jobHandler'
import { ChunkTransfer } from './chunkTransfer'
import { Job } from '../process/job'

export const read = async ({ writerPorts, fileName, chunkSize, maxPoolSize }: {
    writerPorts: number[], fileName: string, chunkSize: number, maxPoolSize: number
}) => {

    const jobHandler = new JobHandler({maxPoolSize, writerPorts})

    const totalBytes = fs.statSync(fileName).size

    let startByte = 0;
    while (startByte < (1.5 * totalBytes)) {
        const endByte = startByte + chunkSize;
        const chunkTransfer = new ChunkTransfer({ fileName, startByte, endByte, totalBytes });
        const job = new Job({ id: startByte, jobTask: chunkTransfer })
        jobHandler.add(job)
        startByte += chunkSize 
    }

    const jobRunnerId = setInterval(() => {
        jobHandler.runJobs()
    }, 30)

    setInterval(() => {
        if (jobHandler.isFinished()) {
            clearInterval(jobRunnerId)
            process.exit(0);
        }
    }, 100)
}
