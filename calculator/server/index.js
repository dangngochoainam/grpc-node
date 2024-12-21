const grpc = require('@grpc/grpc-js')
const serviceImpl = require('./service_impl');
const {CalculatorServiceService} = require("../proto/calculator_grpc_pb");

const addr = '0.0.0.0:50052'

async function cleanup(server) {
    console.log('Cleanup');

    if (server) {
        server.forceShutdown();
    }
}

function main() {
    const server = new grpc.Server();

    process.on('SIGINT', () => {
        console.log('Caught interrupt signal');
        cleanup(server);
    });

    server.addService(CalculatorServiceService, serviceImpl);
    server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, _) => {
        if (err) {
            console.error(err)
            cleanup(server)
        }
        server.start();
    });

    console.log('Listening on: ' + addr);
}

main()
