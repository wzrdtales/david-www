module.exports = (app, manifest, brains) => {
  const withManifestAndInfo = require('./helpers/with-manifest-and-info')(manifest, brains)

  app.get('/:user/:repo/:ref?', (req, res) => {
    withManifestAndInfo(req, res, {noCache: !!res.locals.user}, (manifest, info) => {
      res.render('status', {
        user: req.params.user,
        repo: req.params.repo,
        path: req.query.path,
        ref: req.params.ref ? '/' + req.params.ref : '',
        manifest,
        info
      })
    })
  })

  app.get('/r/:remote/:user/:repo/:ref?', (req, res) => {
    withManifestAndInfo(req, res, {driver: req.params.remote, noCache: !!res.locals.user}, (manifest, info) => {
      res.render('status', {
        user: 'r/' + req.params.remote + '/' + req.params.user,
        repo: req.params.repo,
        path: req.query.path,
        ref: req.params.ref ? '/' + req.params.ref : '',
        manifest,
        info
      })
    })
  })
}
