var GitLabApi = require("gitlab"),
    config = require("config");

var apiOptions = {
  url: config.gitlab.api.url,
  token: config.gitlab.token
};

var internals = {
    api: null
};

function gitlab(apiOptions) {

    internals.api = new GitLabApi(apiOptions);
}

gitlab.prototype = {

    repos: {

        /**
          * Get Content from api
          *
          * Example option object {user: user, repo: repo, path: "package.json"}
          */
        getContent: function(options, callback) {

            //{user: user, repo: repo, path: "package.json"}

            internals.api.projects.repository.showFile({

                projectId: options.user + "/" + options.repo,
                ref: "develop",
                file_path: options.path
            }, function(file) {

                if(file)
                    callback(null, { content: file.content, encoding: "base64" });
                else
                    callback("No such file", null);
            });
        },

        /**
          * Get Project infos.
          *
          * Example option object {user: user, repo: repo}
          */
        get: function(options, callback) {


            internals.api.projects.show(options.user + "/" + options.repo, function(project) {

                if(project)
                {
                    project.private = !project.public;
                    callback(null, project);
                }
                else
                    callback("no such project", null);
            });
        }
    }

};

/**
 * Create an authenticated instance of the GitLab API accessor.
 */
module.exports.getInstance = function () {
  var instance = new gitlab(apiOptions);
  return instance;
}