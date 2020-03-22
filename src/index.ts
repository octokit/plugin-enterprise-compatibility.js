// Import for types only, not a production dependency
import { Octokit } from "@octokit/core";
import { EndpointOptions, OctokitResponse } from "@octokit/types";
import { RequestError } from "@octokit/request-error";

import { VERSION } from "./version";
import { isIssueLabelsUpdateOrReplace } from "./is-issue-labels-update-or-replace";
import {
  isGetReference,
  isListReferences,
} from "./is-get-reference-or-list-references";

export function enterpriseCompatibility(octokit: Octokit) {
  octokit.hook.wrap(
    "request",
    async (request, options: Required<EndpointOptions>) => {
      // see https://github.com/octokit/rest.js/blob/15.x/lib/routes.json#L3046-L3068
      if (isIssueLabelsUpdateOrReplace(options)) {
        options.data = options.labels;
        delete options.labels;

        // for @octokit/rest v16.x, remove validation of labels option
        /* istanbul ignore if */
        if (options.request.validate) {
          delete options.request.validate.labels;
        }
        return request(options);
      }

      const isGetReferenceRequest = isGetReference(options);
      const isListReferencesRequest = isListReferences(options);
      if (isGetReferenceRequest || isListReferencesRequest) {
        options.url = options.url.replace(
          /\/repos\/([^/]+)\/([^/]+)\/git\/(ref|matching-refs)\/(.*)$/,
          "/repos/$1/$2/git/refs/$4"
        );
        return request(options)
          .then((response: OctokitResponse<any>) => {
            if (isGetReferenceRequest) {
              if (Array.isArray(response.data)) {
                throw new RequestError(
                  `More than one reference found at "${options.url}"`,
                  404,
                  {
                    request: options,
                  }
                );
              }

              // ✅ received single reference
              return response;
            }

            // make sure that
            if (!Array.isArray(response.data)) {
              response.data = [response.data];
            }

            return response;
          })
          .catch((error: RequestError) => {
            if (isListReferencesRequest && error.status === 404) {
              return {
                status: 200,
                headers: error.headers,
                data: [],
              };
            }

            throw error;
          });
      }

      return request(options);
    }
  );
}

enterpriseCompatibility.VERSION = VERSION;
