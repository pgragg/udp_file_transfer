import { Logger } from '../../helpers/logger';

interface Poolable {
    id: number
}

export class Pool<T extends Poolable> {
    private inactiveElements: { [key: string]: T }
    private activeElements: { [key: string]: T }
    private maxPoolSize: number;

    constructor({ maxPoolSize }: { maxPoolSize?: number | undefined }) {
        this.inactiveElements = {}
        this.activeElements = {}
        this.maxPoolSize = maxPoolSize || 5;
    }

    add(element: T) {
        this.inactiveElements[String(element.id)] = element
        console.log({inactiveThis: this})
    }

    public isUnderMaxAllocation() {
        return (Object.keys(this.activeElements).length < this.maxPoolSize) &&
            Object.keys(this.inactiveElements).length > 0
    }

    private get(id: number, jobPool = this.inactiveElements) {
        const job = jobPool[String(id)];
        if (!job) { throw new Error('Expected job but found none.') }
        return job;
    }

    public allocate(id?: number | undefined) {
        if(!this.isUnderMaxAllocation()){
            return;
        }
        if (typeof id !== 'number') {
            const keys = Object.keys(this.inactiveElements)
            console.log({keys})
            id = Number(keys[0])
        }
        if(typeof id !== 'number'){
            Logger.log("--- Could not find job id --- " + id)
            Logger.log(`${JSON.stringify(this)}`)
            return;
        }
        const element = this.get(id, this.inactiveElements)
        this.activeElements[String(id)] = this.get(id, this.inactiveElements)
        delete this.inactiveElements[id]
        return element;
    }

    public delete(id: number) {
        Logger.log('Mark complete ' + id)
        delete this.activeElements[String(id)]
    }
}