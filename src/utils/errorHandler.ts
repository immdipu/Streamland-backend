import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const stausCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(stausCode);
  res.json(error.message);
};

export default errorHandler;
