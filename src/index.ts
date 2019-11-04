// Import for types only, not a production dependency
import { Octokit } from "@octokit/core";

import { VERSION } from "./version";

export function enterpriseCompatibility(octokit: Octokit) {
  // see https://github.com/octokit/rest.js/blob/15.x/lib/routes.json#L3046-L3068
  octokit.hook.before("request", options => {
    if (!["POST", "PUT"].includes(options.method)) {
      return;
    }
    if (!/\/repos\/[^/]+\/[^/]+\/issues\/[^/]+\/labels/.test(options.url)) {
      return;
    }

    options.data = options.labels;
    delete options.labels;

    // for @octokit/rest v16.x, remove validation of labels option
    if (options.request.validate) {
      delete options.request.validate.labels;
    }
  });
}

enterpriseCompatibility.VERSION = VERSION;
