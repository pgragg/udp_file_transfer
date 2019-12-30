export class Job {
    public id: number
    private task: Promise<void>
    constructor({id, task}: {id: number, task: Promise<void>}) {
        this.id = id;
        this.task = task;
     }
    async execute() {
        return await this.task;
    }
}

export class JobHandler {
    private inactiveJobs: Map<number, Job>
    private activeJobs: Map<number, Job>
    private maxActiveJobs: number;

    constructor() {
        this.inactiveJobs = new Map()
        this.activeJobs = new Map()
        this.maxActiveJobs = 5;
    }

    add(job: Job) {
        this.inactiveJobs.set(job.id, job)
    }

    runJobs(){
        while(this.shouldRunMoreJobs){
            const job = this.inactiveJobs.values().next().value
            job.execute()
        }
    }

    private get shouldRunMoreJobs(){
        return (this.activeJobs.size < this.maxActiveJobs) && this.inactiveJobs.size > 0
    }

    private async start(id: number) {
        // If this process times out, we have no way of marking the job inactive :/ 
        this.markActive(id);
        return await this.getJob(id, this.activeJobs).execute()
    }

    private getJob(id: number, jobPool = this.inactiveJobs) {
        const job = jobPool.get(id);
        if (!job) { throw new Error('Expected job but found none.') }
        return job;
    }

    private markActive(id: number) {
        this.activeJobs.set(id, this.getJob(id, this.inactiveJobs))
    }

    markComplete(id: number) {
        this.activeJobs.delete(id)
    }
}