import { WriterMessageReceiver } from '../socketMessage/useCases/writerMessageReceiver'
import { UDPSocket } from '../../entities/udpSocket'

export const write = async ({ port, targetFileName }: {
    port: number, targetFileName: string
}) => {

    const timeout = 60000;
    UDPSocket.create({ port, timeout, messageReceiver: new WriterMessageReceiver(targetFileName) })
}
