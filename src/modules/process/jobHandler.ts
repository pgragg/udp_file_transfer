import { Job } from './job';
import { Pool } from './pool';
import { UDPSocket } from '../../entities/udpSocket';
import { ReaderMessageReceiver } from '../socketMessage/useCases/readerMessageReceiver';
import { Logger } from '../../helpers/logger';

class CircularArray<T> {
    private i: number;
    constructor(private array: T[]) {
        this.i = 0;
    }

    next() {
        const item = this.array[this.i]
        this.i = ((this.i + 1) === this.array.length ? 0 : this.i + 1)
        return item;
    }
}
export class JobHandler {
    private jobPool: Pool<Job>;
    private writerPorts: CircularArray<number>;

    constructor({ maxPoolSize, writerPorts }: { maxPoolSize: number, writerPorts: number[] }) {
        this.jobPool = new Pool<Job>({ maxPoolSize })
        this.writerPorts = new CircularArray<number>(writerPorts)
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
        const port = this.writerPorts.next()
        Logger.log(`Sending data to port ${port}`)
        return await job.execute(client, port)
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