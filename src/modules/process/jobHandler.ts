import { Job } from './job';
import { Logger } from '../../helpers/logger';
import { Pool } from './pool';
import { UDPSocket } from '../../entities/udpSocket';
import { ReaderMessageReceiver } from '../socketMessage/useCases/readerMessageReceiver';

export class JobHandler {
    private jobPool: Pool<Job>;

    constructor() {
        this.jobPool = new Pool<Job>({ maxPoolSize: 5 })
    }

    add(job: Job) {
        this.jobPool.add(job)
    }

    runJobs() {
        console.log(`jobPool size: ${JSON.stringify(this.jobPool)}`)
        while (this.jobPool.canAllocate()) {
            const job = this.jobPool.allocate();
            if (!job) { throw new Error("WHY NO JOB LOL") }
            Logger.log(`Running next job: ${job.id}`)
            this.start(job)
        }
    }

    private async start(job: Job) {
        const timeout = 1500
        const client = UDPSocket.create({ messageReceiver: new ReaderMessageReceiver(this), timeout: 1000 })
        setTimeout(() => { this.markIncomplete(job.id) }, timeout)
        return await job.execute(client)
    }

    isFinished() {
        return this.jobPool.size === 0;
    }

    markComplete(id: number) {
        Logger.log('Mark complete ' + id)
        this.jobPool.delete(id)
    }

    markIncomplete(id: number) {
        if (!this.jobPool.isActive(id)) { 
            return 
        }
        Logger.log('markIncomplete ' + id)
        this.jobPool.deactivateElement(id)
    }
}