module.exports = function (res, statusCode, message, payload) {
  const response = { StatusCode: statusCode, Payload: payload }

  if (statusCode === 200) {
    response.Message = message
  } else {
    response.Error = message
  }

  return res.status(statusCode).send(response)
}
