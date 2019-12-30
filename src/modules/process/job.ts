import * as udp from 'dgram'
interface JobTask {
    execute: (client: udp.Socket, port: number) => Promise<void>;
}
export class Job {
    private _id: number
    private jobTask: JobTask
    constructor({ id, jobTask }: { id: number, jobTask: JobTask }) {
        this._id = id;
        this.jobTask = jobTask;
    }

    async execute(client: udp.Socket, port: number) {
        return await this.jobTask.execute(client, port);
    }

    get id() {
        return Number(this._id)
    }
}