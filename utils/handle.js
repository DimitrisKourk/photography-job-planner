// Wraps an async route handler: if anything throws (e.g. a failed query),
// the error is logged and the client gets a 500 with the error message.
function handle(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) res.status(500).json(error.message);
    }
  };
}

module.exports = handle;
