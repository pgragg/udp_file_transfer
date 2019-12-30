import { Job } from './job';
import { Pool } from './pool';
import { UDPSocket } from '../../entities/udpSocket';
import { ReaderMessageReceiver } from '../socketMessage/useCases/readerMessageReceiver';
import { Logger } from '../../helpers/logger';
import * as udp from 'dgram'

class CircularArray<T> {
    private i: number;
    constructor(private array: T[]) {
        this.i = 0;
    }

    push(item: T){
        this.array.push(item)
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
    private clients: CircularArray<udp.Socket>;

    constructor({ maxPoolSize, writerPorts }: { maxPoolSize: number, writerPorts: number[] }) {
        this.jobPool = new Pool<Job>({ maxPoolSize })
        this.writerPorts = new CircularArray<number>(writerPorts)
        this.clients = new CircularArray<udp.Socket>([])
        for(let clientCount = 0; clientCount < maxPoolSize; clientCount ++){
            const client = UDPSocket.create({ messageReceiver: new ReaderMessageReceiver(this), timeout: 120000 })
            this.clients.push(client)
        }
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
        const timeout = 100
        
        setTimeout(() => { this.markIncomplete(job.id) }, timeout)
        const port = this.writerPorts.next()
        Logger.log(`Sending data to port ${port}`)
        return await job.execute(this.clients.next(), port)
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