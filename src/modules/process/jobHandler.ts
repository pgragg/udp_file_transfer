import { Job } from './job';

export class JobHandler {
    private inactiveJobs: { [key: number]: Job }
    private activeJobs: { [key: number]: Job }
    private maxActiveJobs: number;

    constructor() {
        this.inactiveJobs = {}
        this.activeJobs = {}
        this.maxActiveJobs = 5;
    }

    add(job: Job) {
        this.inactiveJobs[job.id] = job
    }

    runJobs() {
        while (this.shouldRunMoreJobs) {
            const job = Object.values(this.inactiveJobs)[0]
            console.log(`Running next job: ${job.id}`)
            this.start(job.id)
        }
    }

    private get shouldRunMoreJobs() {
        console.log({activeJobs: this.activeJobs})
        console.log({inactiveJobs: this.inactiveJobs})

        return (Object.keys(this.activeJobs).length < this.maxActiveJobs) && 
            Object.keys(this.inactiveJobs).length > 0
    }

    private async start(id: number) {
        // If this process times out, we have no way of marking the job inactive :/ 
        this.markActive(id);
        return await this.getJob(id, this.activeJobs).execute()
    }

    private getJob(id: number, jobPool = this.inactiveJobs) {
        const job = jobPool[id];
        if (!job) { throw new Error('Expected job but found none.') }
        return job;
    }

    private markActive(id: number) {
        this.activeJobs[id] = this.getJob(id, this.inactiveJobs)
        delete this.inactiveJobs[id]
    }

    markComplete(id: number) {
        console.log('Mark complete ' + id)
        delete this.activeJobs[id]
    }
}