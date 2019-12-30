import crypto from 'crypto'
import { Result } from '../helpers/result'
import { SimpleResult } from '../helpers/SimpleResult'

const checksum = (str: string) => {
    return crypto
        .createHash('md5')
        .update(str, 'utf8')
        .digest('hex')
}

export const MessageCheckSumMismatchMessage = 'Error: Message checksum mismatch.'

export class Document {
    public startByte: number;
    public endByte: number;
    public data: string;
    constructor({ startByte, endByte, data }: { startByte: number, endByte: number, data: string}) {
        this.startByte = startByte;
        this.endByte = endByte;
        this.data = data;
    }
}

export class Status {
    public status: 'success' | 'failure'
    public startByte: number | undefined;
    constructor({status, startByte}: {status: 'success' | 'failure', startByte?: number}){
        this.status = status;
        this.startByte = startByte;
    }
}

export class Message {
    public checksum: string | undefined;
    constructor(public payload: Document | Status) {
        this.checksum = Message.calculateChecksum(this)
        Object.freeze(this);
    }

    toString() {
        return JSON.stringify(this)
    }

    public static fromString(docString: string): SimpleResult<Message, Error> {
        const doc = JSON.parse(docString)
        if (doc.checksum === Message.calculateChecksum(doc)) {
            return Result.Success(doc as Message)
        }
        return Result.Failure(new Error(MessageCheckSumMismatchMessage))
    }

    private static calculateChecksum(doc: any) {
        const docCopy = JSON.parse(JSON.stringify(doc));
        delete docCopy.checksum;
        return checksum(docCopy.toString())
    }
}