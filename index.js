import { readdirSync } from "fs";
import { includeMiddleware } from "./middlewares/index.js";
class BlockRouter {
  routerMap = new Map();
  middlewareMap = new Map();

  configureMiddleware(key, controller) {
    this.middlewareMap.set(key, controller);
  }

  get(path, controller, middlewareKeys = []) {
    const getMethods = this.routerMap.get("GET") || new Map();
    const middlewares = middlewareKeys.map((middlewareKey) =>
      this.middlewareMap.get(middlewareKey)
    );
    getMethods.set(path, includeMiddleware(controller, middlewares));
    this.routerMap.set("GET", getMethods);
  }
  post(path, controller, middlewareKeys = []) {
    const postMethods = this.routerMap.get("POST") || new Map();
    const middlewares = middlewareKeys.map((middlewareKey) =>
      this.middlewareMap.get(middlewareKey)
    );
    postMethods.set(path, includeMiddleware(controller, middlewares));
    this.routerMap.set("POST", postMethods);
  }
  put(path, controller, middlewareKeys = []) {
    const putMethods = this.routerMap.get("PUT") || new Map();
    const middlewares = middlewareKeys.map((middlewareKey) =>
      this.middlewareMap.get(middlewareKey)
    );
    putMethods.set(path, includeMiddleware(controller, middlewares));
    this.routerMap.set("PUT", putMethods);
  }
  delete(path, controller, middlewareKeys = []) {
    const deleteMethods = this.routerMap.get("DELETE") || new Map();
    const middlewares = middlewareKeys.map((middlewareKey) =>
      this.middlewareMap.get(middlewareKey)
    );
    deleteMethods.set(path, includeMiddleware(controller, middlewares));
    this.routerMap.set("DELETE", deleteMethods);
  }
  static(rootPath) {
    const files = readdirSync(rootPath);
    for (const file of files) {
      this.get(`/${file}`, (req, res) => {
        res.sendFile(file, { root: rootPath });
      });
    }
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

    handlerFn(this.req, this.res);
  }
}

export default BlockRouter;
