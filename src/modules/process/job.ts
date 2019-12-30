interface JobTask {
    execute: () => Promise<void>;
}
export class Job {
    private _id: number
    private jobTask: JobTask
    constructor({ id, jobTask }: { id: number, jobTask: JobTask }) {
        this._id = id;
        this.jobTask = jobTask;
    }
    async execute() {
        return await this.jobTask.execute();
    }

    get id(){
        return Number(this._id)
    }
}