import { Message } from '../../entities/message'

export class Statistics {
    public successes: number;
    public failures: { [key: string]: number }
    public tries: number
    public successfulBytes: number;
    public totalBytes: number;

    constructor() {
        this.successes = 0;
        this.tries = 0;
        this.failures = {};
        this.successfulBytes = 0;
        // Start arbitrarily high
        this.totalBytes = 1000000;
    }

    failure(error: Error) {
        this.failures[error.message] = this.failures[error.message] || 0
        this.failures[error.message] += 1
    }

    success(message: Message) {
        this.successes += 1;
        if('data' in message.payload){
            this.totalBytes = message.payload.totalBytes
            this.successfulBytes += message.payload.data.length
        }
    }
}