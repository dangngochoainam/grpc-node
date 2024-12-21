const grpc = require('@grpc/grpc-js')
const {CalculatorServiceClient} = require("../proto/calculator_grpc_pb");
const {SumRequest} = require('../proto/sum_pb');

const doSum = (client) => {
    console.log('doSum was invoked');
    const req = new SumRequest().setNumberFirst(3).setNumberSecond(10)

    client.sum(req, (err, res) => {
        if (err) {
            console.error(err)
        }

        console.log(`Sum: ${res.getResult()}`);
    })
}

function main() {
    const client = new CalculatorServiceClient('localhost:50052',
        grpc.credentials.createInsecure());

    doSum(client)

    // client.close()
}

main()
