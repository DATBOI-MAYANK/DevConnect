const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res, next);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};
export { asyncHandler };
