module.exports = (app, manifest, brains) => {
  const withManifestAndInfo = require('../helpers/with-manifest-and-info')(manifest, brains)

  app.get('/:user/:repo/:ref?/dev-info.json', (req, res) => {
    withManifestAndInfo(req, res, {dev: true}, (manifest, info) => {
      res.json(info)
    })
  })

  app.get('/:user/:repo/:ref?/info.json', (req, res) => {
    withManifestAndInfo(req, res, (manifest, info) => {
      res.json(info)
    })
  })

  app.get('/:user/:repo/:ref?/peer-info.json', (req, res) => {
    withManifestAndInfo(req, res, {peer: true}, (manifest, info) => {
      res.json(info)
    })
  })

  app.get('/:user/:repo/:ref?/optional-info.json', (req, res) => {
    withManifestAndInfo(req, res, {optional: true}, (manifest, info) => {
      res.json(info)
    })
  })

  app.get('/r/:remote/:user/:repo/:ref?/dev-info.json', (req, res) => {
    withManifestAndInfo(req, res, {driver: req.params.remote, dev: true}, (manifest, info) => {
      res.json(info)
    })
  })

  app.get('/r/:remote/:user/:repo/:ref?/info.json', (req, res) => {
    withManifestAndInfo(req, res, {driver: req.params.remote}, (manifest, info) => {
      res.json(info)
    })
  })

  app.get('/r/:remote/:user/:repo/:ref?/peer-info.json', (req, res) => {
    withManifestAndInfo(req, res, {driver: req.params.remote, peer: true}, (manifest, info) => {
      res.json(info)
    })
  })

  app.get('/r/:remote/:user/:repo/:ref?/optional-info.json', (req, res) => {
    withManifestAndInfo(req, res, {driver: req.params.remote, optional: true}, (manifest, info) => {
      res.json(info)
    })
  })
}
