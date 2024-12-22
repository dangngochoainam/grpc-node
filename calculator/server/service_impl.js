const {SumResponse} = require('../proto/sum_pb')
const {PrimesResponse} = require('../proto/primes_pb')
const {AvgResponse} = require('../proto/avg_pb')
const {MaxResponse} = require('../proto/max_pb')
const {DeadlineResponse} = require('../proto/deadline_pb')



exports.sum = (call, callback) => {
    console.log('Sum was invoked');

    const result = call.request.getNumberFirst() + call.request.getNumberSecond()

    const res = new SumResponse().setResult(result)

    callback(null, res);
}

exports.primes = (call, _) => {
    console.log('Primes was invoked');
    let number = call.request.getNumber();
    let divisor = 2;

    while (number > 1) {
        const res = new PrimesResponse();
        if (number % divisor == 0) {
            res.setOutput(divisor);
            call.write(res);
            number /= divisor;
        } else {
            ++divisor;
        }
    }

    call.end();
};


exports.avg = (call, callback) => {
    console.log('Avg was invoked');

    const listNumber = []

    call.on('data', (req) => {
        listNumber.push(req.getNumber());
    })

    call.on('end', () => {
        const avg = listNumber.reduce((acc, number) => acc + number, 0)/listNumber.length;
        const res = new AvgResponse().setOutput(avg);
        callback(null, res);
    })
}

exports.max = (call, callback) => {
    console.log('Max was invoked');

    const output = []
    let max = 0;

    call.on('data', (req) => {
        const number = req.getNumber();
        const findMax = Math.max(number, ...output)
        if (findMax > max) {
            max = findMax;
            output.push(number);
            call.write(new MaxResponse().setOutput(number));
        }
    })

    call.on('end', () => {
        console.log(output)
        call.end()
    })
}

exports.deadline = async (call, callback) => {
    console.log('Deadline was invoked');

    const result = call.request.getNumber()

    for (let i = 0; i < result; i++) {
        if (call.cancelled) {
            return console.log('The client cancelled the request!');
        }
        await delay(1000)
    }

    const res = new DeadlineResponse().setOutput(1)

    callback(null, res);
}

const delay = (ms) => {
    return new Promise(rs => setTimeout(rs, ms));
}
