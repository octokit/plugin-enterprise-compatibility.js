import { EndpointOptions } from "@octokit/types";

export function isIssueLabelsUpdateOrReplace({ method, url }: EndpointOptions) {
  if (!["POST", "PUT"].includes(method)) {
    return false;
  }
  if (!/\/repos\/[^/]+\/[^/]+\/issues\/[^/]+\/labels/.test(url)) {
    return false;
  }

  return true;
}
