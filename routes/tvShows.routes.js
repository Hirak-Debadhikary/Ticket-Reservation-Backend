const tvShowRouter = require("express").Router();
const tvShows = require("../controller/TVShows.controller");

tvShowRouter.route("/addTvShows").post(tvShows.addTVShows);
tvShowRouter.route("/getAllTvShows").get(tvShows.getTVShows);
tvShowRouter.route("/:id").get(tvShows.getTVShowsById);

module.exports = {
  tvShowRouter,
};
