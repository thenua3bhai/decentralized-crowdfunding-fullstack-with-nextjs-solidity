const routes = require("next-routes")();
routes
  .add("/campaigns/New", "/campaigns/New")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests", "/campaigns/requests/index")
  .add("/campaigns/:address/requests/new", "/campaigns/requests/new");
module.exports = routes;
