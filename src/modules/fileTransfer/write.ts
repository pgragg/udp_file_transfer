import { WriterMessageReceiver } from '../socketMessage/useCases/writerMessageReceiver'
import { UDPSocket } from '../../entities/udpSocket'
import { Logger } from '../../helpers/logger'
import { Statistics } from '../statistics/statistics'
import { SingleBar } from 'cli-progress'
import { Presets } from 'cli-progress'

class View {
    private bar: SingleBar;
    constructor(private statistics: Statistics) {
        this.bar = new SingleBar({}, Presets.shades_classic);
        this.bar.start(statistics.totalBytes, statistics.successfulBytes);
    }

    render(){
        this.bar.setTotal(this.statistics.totalBytes)
        this.bar.update(this.statistics.successfulBytes)
        // this.bar.stop if successfulBytes == totalBytes.
    }

}

export const write = async ({ ports, targetFileName, timeout }: {
    ports: number[], targetFileName: string, timeout: number
}) => {
    try {
        const statistics = new Statistics()
        const view = new View(statistics)
        setInterval(() => {
            view.render()
            console.log({statistics})
        }, 1000)
        return ports.map((port) => {
            return UDPSocket.create({ port, timeout, messageReceiver: new WriterMessageReceiver(targetFileName, statistics) })
        })
        
    } catch (error) {
        Logger.log({ error })
    }
}


