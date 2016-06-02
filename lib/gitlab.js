const GitLabApi = require('gitlab');

var internals = {
    api: null
};

function gitlab(apiOptions) {

    internals.apiOptions = apiOptions;
    internals.api = new GitLabApi(apiOptions);
}

gitlab.prototype = {

    repos: {

        /**
          * Get Content from api
          *
          * Example option object {user: user, repo: repo, path: "package.json"}
          */
        getContent: (options, callback) => {

            //{user: user, repo: repo, path: "package.json"}

            internals.api.projects.repository.showFile({

                projectId: options.user + "/" + options.repo,
                ref: internals.apiOptions.defaultBranch,
                file_path: options.path
            }, function (file) {

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
        get: (options, callback) => {


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
module.exports = (gitlabConfig) => {

  const apiOpts = {
    url: gitlabConfig.api.url,
    token: gitlabConfig.token,
    defaultBranch: gitlabConfig.defaultBranch
  };

  const Gitlab = {
    getInstance: () => {
      var instance = new gitlab(apiOpts);
      return instance;
    }
  };

  return Gitlab
};
