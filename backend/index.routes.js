import { Router } from "express";

import nOSRoutes from "./endpoints/nOS/nOS.route";

export default Router()
  /** GET /health-check - Check service health */
  .get("/health-check", (req, res) =>
    res.send("backend for nOS flip is up and running!")
  )
  .use("/nos", nOSRoutes);
