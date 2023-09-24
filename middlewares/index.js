export const includeMiddleware = (originalController, middlewares = []) => {
  return async (req, res) => {
    for (const middleware of middlewares) {
      await middleware(req, res);  
    }
    await originalController(req, res);
  };
};
