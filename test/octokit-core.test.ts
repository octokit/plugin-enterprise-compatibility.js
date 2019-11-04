import fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";

import { enterpriseCompatibility } from "../src";
const OctokitWithPlugin = Octokit.plugin(enterpriseCompatibility);

describe("{POST|PUT} /repos/:owner/:repo/issues/:issue_number/labels", () => {
  it("POST sends labels in request body", () => {
    const mock = fetchMock
      .sandbox()
      .post(
        "https://original.test/repos/octokit/rest.js/issues/1/labels",
        {},
        {
          // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
          body: {
            labels: ["foo", "bar"]
          }
        }
      )
      .post(
        "https://patched.test/repos/octokit/rest.js/issues/1/labels",
        {},
        {
          // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
          body: ["foo", "bar"]
        }
      );

    const octokitOriginal = new Octokit({
      baseUrl: "https://original.test",
      request: {
        fetch: mock
      }
    });
    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock
      }
    });

    const options = {
      method: "POST",
      url: "/repos/:owner/:repo/issues/:issue_number/labels",
      owner: "octokit",
      repo: "rest.js",
      issue_number: 1,
      labels: ["foo", "bar"]
    };

    return Promise.all([
      // @ts-ignore no idea why TypeScript is complaining about "POST" not being compatible with RequestMethod, which is an enum including "POST"
      octokitOriginal.request(options),
      // @ts-ignore
      octokitPatched.request(options)
    ]);
  });

  it("octokit.issues.replaceLabels() sends labels in request body", () => {
    const mock = fetchMock
      .sandbox()
      .put(
        "https://original.test/repos/octokit/rest.js/issues/1/labels",
        {},
        {
          // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
          body: {
            labels: ["foo", "bar"]
          }
        }
      )
      .put(
        "https://patched.test/repos/octokit/rest.js/issues/1/labels",
        {},
        {
          // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
          body: ["foo", "bar"]
        }
      );

    const octokitOriginal = new Octokit({
      baseUrl: "https://original.test",
      request: {
        fetch: mock
      }
    });
    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock
      }
    });

    const options = {
      method: "PUT",
      url: "/repos/:owner/:repo/issues/:issue_number/labels",
      owner: "octokit",
      repo: "rest.js",
      issue_number: 1,
      labels: ["foo", "bar"]
    };

    return Promise.all([
      // @ts-ignore no idea why TypeScript is complaining about "POST" not being compatible with RequestMethod, which is an enum including "POST"
      octokitOriginal.request(options),
      // @ts-ignore
      octokitPatched.request(options)
    ]);
  });
});

describe("GET /repos/:owner/:repo/issues/:issue_number/labels", () => {
  it("has no effect on GET methods", () => {
    const mock = fetchMock
      .sandbox()
      .get("https://patched.test/repos/octokit/rest.js/issues/1/labels", 200);

    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock
      }
    });

    return octokitPatched.request(
      "GET /repos/:owner/:repo/issues/:issue_number/labels",
      {
        owner: "octokit",
        repo: "rest.js",
        issue_number: 1
      }
    );
  });
});

describe("POST /repos/:owner/:repo/labels", () => {
  it("has no effoct on paths other than /repos/:owner/:repo/issues/:issue_number/labels", () => {
    const mock = fetchMock
      .sandbox()
      .post("https://patched.test/repos/octokit/rest.js/labels", 200, {
        // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
        body: {
          name: "foo",
          color: "BADA55"
        }
      });

    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock
      }
    });

    return octokitPatched.request("POST /repos/:owner/:repo/labels", {
      owner: "octokit",
      repo: "rest.js",
      name: "foo",
      color: "BADA55"
    });
  });
});
