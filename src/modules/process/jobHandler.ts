import { Job } from './job';
import { Pool } from './pool';
import { UDPSocket } from '../../entities/udpSocket';
import { ReaderMessageReceiver } from '../socketMessage/useCases/readerMessageReceiver';

export class JobHandler {
    private jobPool: Pool<Job>;

    constructor({maxPoolSize}: {maxPoolSize: number}) {
        this.jobPool = new Pool<Job>({ maxPoolSize })
    }

    add(job: Job) {
        this.jobPool.add(job)
    }

    runJobs() {
        while (this.jobPool.canAllocate()) {
            const job = this.jobPool.allocate();
            if (!job) { throw new Error("No job found.") }
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
        this.jobPool.delete(id)
    }

    markIncomplete(id: number) {
        if (!this.jobPool.isActive(id)) { 
            return 
        }
        this.jobPool.deactivateElement(id)
    }
}