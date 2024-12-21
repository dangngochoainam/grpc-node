const {SumResponse} = require('../proto/sum_pb')

exports.sum = (call, callback) => {
    console.log('Sum was invoked');

    const result = call.request.getNumberFirst() + call.request.getNumberSecond()

    const res = new SumResponse().setResult(result)

    callback(null, res);
}
