import { WriterMessageReceiver } from '../socketMessage/useCases/writerMessageReceiver'
import { UDPSocket } from '../../entities/udpSocket'

export const write = async ({ port, targetFileName, timeout }: {
    port: number, targetFileName: string, timeout: number
}) => {
    UDPSocket.create({ port, timeout, messageReceiver: new WriterMessageReceiver(targetFileName) })
}
