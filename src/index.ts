// Import for types only, not a production dependency
import { Octokit } from "@octokit/core";
import { EndpointOptions } from "@octokit/types";

import { VERSION } from "./version";
import { isIssueLabelsUpdateOrReplace } from "./is-issue-labels-update-or-replace";

export function enterpriseCompatibility(octokit: Octokit) {
  octokit.hook.wrap(
    "request",
    (request, options: Required<EndpointOptions>) => {
      // see https://github.com/octokit/rest.js/blob/15.x/lib/routes.json#L3046-L3068
      if (isIssueLabelsUpdateOrReplace(options)) {
        options.data = options.labels;
        delete options.labels;

        // for @octokit/rest v16.x, remove validation of labels option
        if (options.request.validate) {
          delete options.request.validate.labels;
        }
        return request(options);
      }
    }
  );
}

enterpriseCompatibility.VERSION = VERSION;
