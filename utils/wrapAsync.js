module.exports = (func) => {
  return (req, res, next) => {
      func(req, res, next).catch(next); // Catch async errors and pass them to the next middleware
  };
};
