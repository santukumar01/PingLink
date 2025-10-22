const response = (res, statusCode, message, data = null) => {
  if (!res) {
    console.error("Response Object is null");
    return;
  }
  const responseObject = {
    status: statusCode < 400 ? "success" : "error",
    message,
    data,
  };

  return res.status(statusCode).json(responseObject);
};

module.export = response;
