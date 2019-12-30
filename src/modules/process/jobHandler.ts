import { Job } from './job';
import { Logger } from '../../helpers/logger';
import { Pool } from './pool';

export class JobHandler {
    private jobPool: Pool<Job>;

    constructor() {
        this.jobPool = new Pool<Job>({ maxPoolSize: 5 })
    }

    add(job: Job) {
        this.jobPool.add(job)
    }

    runJobs() {
        while (this.jobPool.isUnderMaxAllocation()) {
            const job = this.jobPool.allocate();
            if (!job) { break }
            Logger.log(`Running next job: ${job.id}`)
            this.start(job)
        }
    }

    private async start(job: Job) {
        return await job.execute()
    }

    markComplete(id: number) {
        Logger.log('Mark complete ' + id)
        this.jobPool.delete(id)
    }
}