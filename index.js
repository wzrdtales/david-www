var express = require("express")
var compress = require("compression")
var consolidate = require("consolidate")
var config = require("config")
var statics = require("./statics")
var nsp = require("./lib/nsp")
var middleware = require("./middleware")
var routes = require("./routes")

nsp.updateAdvisories(function (er, advisories) {
  if (er) return console.error("Failed to update advisories", er)
  console.log("Updated", Object.keys(advisories).length, "NSP advisories")
  nsp.updateAdvisoriesPeriodically(config.nsp && config.nsp.advisoriesUpdateInterval)
})

var app = express()

app.engine("html", consolidate.handlebars)
app.set("view engine", "html")
app.set("views", __dirname + "/dist")
app.use(compress())

statics(app)

app.use(middleware.session)
app.use(middleware.user)
app.use(middleware.generateCsrf)
app.use(middleware.globals)
app.use(middleware.cors)

app.get("/auth/callback", routes.session.oauthCallback)
app.get("/news/rss.xml", routes.rss.news)
app.get("/dependency-counts.json", routes.api.dependencyCounts)
app.get("/stats", routes.stats)
app.get("/search", routes.search)
app.get("/search.json", routes.api.search)
app.get("/package/:pkg/changes.json", routes.api.changelog)
app.get("/:user/:repo/:ref?/dev-info.json", routes.api.info.dev)
app.get("/:user/:repo/:ref?/info.json", routes.api.info)
app.get("/:user/:repo/:ref?/peer-info.json", routes.api.info.peer)
app.get("/:user/:repo/:ref?/optional-info.json", routes.api.info.optional)
app.get("/:user/:repo/:ref?/graph.json", routes.api.graph)
app.get("/:user/:repo/:ref?/dev-graph.json", routes.api.graph.dev)
app.get("/:user/:repo/:ref?/peer-graph.json", routes.api.graph.peer)
app.get("/:user/:repo/:ref?/optional-graph.json", routes.api.graph.optional)
app.get("/:user/:repo/:ref?/rss.xml", routes.rss.feed)
app.get("/:user/:repo/:ref?/dev-rss.xml", routes.rss.feed.dev)
app.get("/:user/:repo/:ref?/status.svg", routes.badge)
app.get("/:user/:repo/:ref?/status.png", routes.badge.png)
app.get("/:user/:repo/:ref?/status@2x.png", routes.badge.retina)
app.get("/:user/:repo/:ref?/dev-status.svg", routes.badge.dev)
app.get("/:user/:repo/:ref?/dev-status.png", routes.badge.dev.png)
app.get("/:user/:repo/:ref?/dev-status@2x.png", routes.badge.dev.retina)
app.get("/:user/:repo/:ref?/peer-status.png", routes.badge.peer.png)
app.get("/:user/:repo/:ref?/peer-status@2x.png", routes.badge.peer.retina)
app.get("/:user/:repo/:ref?/peer-status.svg", routes.badge.peer)
app.get("/:user/:repo/:ref?/optional-status.svg", routes.badge.optional)
app.get("/:user/:repo/:ref?/optional-status.png", routes.badge.optional.png)
app.get("/:user/:repo/:ref?/optional-status@2x.png", routes.badge.optional.retina)
app.get("/:user/:repo/:ref?.svg", routes.badge)
app.get("/:user/:repo/:ref?@2x.png", routes.badge.retina)
app.get("/:user/:repo/:ref?.png", routes.badge.png)
app.get("/:user/:repo/:ref?", routes.status)
app.get("/:user", routes.profile)
app.get("/", routes.homepage)

app.use(middleware["404"])

var port = process.env.PORT || 1337

var server = app.listen(port, function () {
  console.log("David started", server.address())
})
