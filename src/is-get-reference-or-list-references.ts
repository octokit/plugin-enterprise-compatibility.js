import { EndpointOptions } from "@octokit/types";

const REGEX_IS_GET_REFERENCE_PATH = /\/repos\/[^/]+\/[^/]+\/git\/ref\//;
const REGEX_IS_LIST_REFERENCES_PATH = /\/repos\/[^/]+\/[^/]+\/git\/matching-refs\//;

export function isGetReference({ method, url }: EndpointOptions) {
  if (!["GET", "HEAD"].includes(method)) {
    return false;
  }

  return REGEX_IS_GET_REFERENCE_PATH.test(url);
}

export function isListReferences({ method, url }: EndpointOptions) {
  if (!["GET", "HEAD"].includes(method)) {
    return false;
  }

  return REGEX_IS_LIST_REFERENCES_PATH.test(url);
}
