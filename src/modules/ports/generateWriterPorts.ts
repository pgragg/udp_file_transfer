
export const generateWriterPorts = ({ maxPoolSize }: { maxPoolSize: number }) => {
    const ports: number[] = []

    for (let poolSize = 0; poolSize < maxPoolSize; poolSize++) {
        const port = 2222 + poolSize
        ports.push(port)
    }

    return ports
}