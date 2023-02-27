class BlockRouter {
  routerMap = new Map();
  middlewares = [];

  use(middleware) {
    this.middlewares.push(middleware);
  }
  get(path, controller) {
    const getMethods = this.routerMap.get("GET") || new Map();
    getMethods.set(path, controller);
    this.routerMap.set("GET", getMethods);
  }
  post(path, controller) {
    const postMethods = this.routerMap.get("POST") || new Map();
    postMethods.set(path, controller);
    this.routerMap.set("POST", postMethods);
  }
  put(path, controller) {
    const putMethods = this.routerMap.get("PUT") || new Map();
    putMethods.set(path, controller);
    this.routerMap.set("PUT", putMethods);
  }
  delete(path, controller) {
    const deleteMethods = this.routerMap.get("DELETE") || new Map();
    deleteMethods.set(path, controller);
    this.routerMap.set("DELETE", deleteMethods);
  }
  route(req, res) {
    this.req = req;
    this.res = res;

    let path = "/" + req.url.split("/").pop();
    if (Object.keys(req.query).length !== 0) {
      path = path.split("?")[0];
    }

    const methodRouteMap = this.routerMap.get(req.method);
    if (!methodRouteMap) {
      this.res.send("No method definition available for this route");
      return;
    }
    const handlerFn = methodRouteMap.get(path);
    if (!handlerFn) {
      this.res.send("No function definition available for this route");
      return;
    }
    //apply middlewares;
    this.middlewares.forEach((middleware) => {
      middleware(this.req, this.res);
    });
    handlerFn(this.req, this.res);
  }
}

module.exports = BlockRouter;
