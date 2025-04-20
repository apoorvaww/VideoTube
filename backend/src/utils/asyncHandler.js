
// The idea behind an asyncHandler is to wrap asynchronous route handlers so that errors can be caught and passed to the next middleware (typically an error handler). In Express, asynchronous route handlers often need a try-catch block to catch errors and pass them to next() for error handling. The asyncHandler function simplifies this process.

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err));
  };
};

export { asyncHandler };



//second way to handle asynchronous functions:

// asyncHandler is a higher-order function that takes a function func (an asynchronous route handler) as its argument.

// const asyncHandler = (func) = async (req, res, next) => {
//   try {
//     await func(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// Simplifies Error Handling: It eliminates the need to use try-catch blocks in each asynchronous route handler, which can be repetitive and error-prone.
