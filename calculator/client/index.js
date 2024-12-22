const grpc = require('@grpc/grpc-js')
const {CalculatorServiceClient} = require("../proto/calculator_grpc_pb");
const {PrimesRequest} = require('../proto/primes_pb');
const {AvgRequest} = require('../proto/avg_pb');
const {MaxRequest} = require('../proto/max_pb');
const {DeadlineRequest} = require('../proto/deadline_pb');


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

const doPrimes = (client) => {
    console.log('doPrimes was invoked');
    const req = new PrimesRequest();

    req.setNumber(120);
    const call = client.primes(req);

    call.on('data', (res) => {
        console.log(`Primes: ${res.getOutput()}`);
    });
}

const doAvg = (client) => {
    console.log('doAvg was invoked');

    const listNumber = [1,2,3,4];

    const call = client.avg((err, res) => {
        if (err) {
            console.error(err)
        }
        console.log(`Sum: ${res.getOutput()}`);
    })

    listNumber.forEach(number => call.write(new AvgRequest().setNumber(number)))

    call.end()

}

const doMax = (client) => {
    console.log('doMax was invoked');

    const call = client.max()

    call.on('data', (res) => {
        console.log(`Max: ${res.getOutput()}`);
    })
    const listNumber = [1,5,3,6,2,20]

    listNumber.forEach(number => call.write(new MaxRequest().setNumber(number)))

    call.end()
}

const doDeadline = (client, ms) => {
    console.log('doDeadline was invoked');
    const req = new DeadlineRequest().setNumber(3)

    client.deadline(req, {
        deadline: new Date(Date.now() + ms),
    }, (err, res) => {
        if (err) {
            console.error(err)
        }

        console.log(`No Deadline: ${res.getOutput()}`);
    })
}

function main() {
    const client = new CalculatorServiceClient('localhost:50052',
        grpc.credentials.createInsecure());

    // doSum(client)
    // doPrimes(client)
    // doAvg(client)
    // doMax(client)
    doDeadline(client, 1000)
    // doDeadline(client, 4000)
    // client.close()
}

main()
