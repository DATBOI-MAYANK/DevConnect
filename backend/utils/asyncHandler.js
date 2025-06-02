const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res, next);
  } catch (error) {
    const code = typeof error.code === 'number' ? error.code : 500;
    res.status(code).json({
      success: false,
      message: error.message,
    });
  }
};
export { asyncHandler };
