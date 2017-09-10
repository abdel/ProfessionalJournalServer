module.exports = function (res, statusCode, message) {
  return res.status(statusCode).send({
    StatusCode: statusCode,
    Message: message
  })
}
