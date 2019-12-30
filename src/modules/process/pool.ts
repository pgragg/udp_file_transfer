import { Logger } from '../../helpers/logger';
import { Result } from '../../helpers/result';
import { SimpleResult } from '../../helpers/SimpleResult';

interface Poolable {
    id: number
}

export class Pool<T extends Poolable> {
    private inactiveElements: { [key: number]: T }
    private activeElements: { [key: number]: T }
    public maxPoolSize: number;

    constructor({ maxPoolSize }: { maxPoolSize?: number | undefined }) {
        this.inactiveElements = {}
        this.activeElements = {}
        this.maxPoolSize = maxPoolSize || 5;
    }

    add(element: T) {
        this.inactiveElements[element.id] = element
    }

    public canAllocate() {
        return (Object.keys(this.activeElements).length < this.maxPoolSize) &&
            Object.keys(this.inactiveElements).length > 0
    }

    private get(id: number, jobPool = this.inactiveElements): SimpleResult<T, Error> {
        const job = jobPool[id];
        if (!job) { return Result.Failure(new Error('Expected job but found none.')) }
        return Result.Success(job);
    }

    public allocate(id?: number | undefined) {
        if (!this.canAllocate()) {
            throw new Error("Expected to be able to allocate but cannot.")
        }
        if (typeof id === 'undefined') {
            const keys = Object.keys(this.inactiveElements)
            id = Number(keys[0])
        }
        const element = this.get(id, this.inactiveElements)
        if (element.failure) {
            throw element.failure;
        }
        this.activateElement(id)
        return element.success;
    }

    public activateElement(id: number) {
        const inactiveElement = this.get(id, this.inactiveElements)
        if (inactiveElement.failure) { throw inactiveElement.failure }
        this.activeElements[id] = inactiveElement.success
        delete this.inactiveElements[id]
    }

    public deactivateElement(id: number) {
        const activeElement = this.get(id, this.activeElements)
        if (activeElement.failure) { 
            Logger.log(`Failed to deactivate element ${id}`)
            return 
        }
        this.inactiveElements[id] = activeElement.success
        delete this.activeElements[id]
    }

    public delete(id: number) {
        Logger.log('Mark complete ' + id)
        delete this.activeElements[id]
        delete this.inactiveElements[id]
    }

    public isActive(id: number) {
        return this.activeElements[id] !== undefined
    }

    public get size() {
        return Object.keys(this.inactiveElements).length + Object.keys(this.activeElements).length
    }
}