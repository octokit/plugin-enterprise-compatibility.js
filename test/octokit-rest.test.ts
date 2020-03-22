import fetchMock from "fetch-mock";

const { Octokit } = require("@octokit/rest");

import { enterpriseCompatibility } from "../src";

const MyOctokit = Octokit.plugin(enterpriseCompatibility);

describe("side effects", () => {
  it("does leave other endpoints in tact", () => {
    const octokit = new MyOctokit();

    expect(octokit.issues.get.endpoint).toBeTruthy();
  });
});

describe("octokit.issues.addLabels() & octokit.issues.replaceLabels()", () => {
  it("octokit.issues.addLabels() sends labels in request body", () => {
    const mock = fetchMock
      .sandbox()
      .post(
        "https://original.test/repos/octokit/rest.js/issues/1/labels",
        {},
        {
          // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
          body: {
            labels: ["foo", "bar"],
          },
        }
      )
      .post(
        "https://patched.test/repos/octokit/rest.js/issues/1/labels",
        {},
        {
          // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
          body: ["foo", "bar"],
        }
      );

    const octokitOriginal = new Octokit({
      baseUrl: "https://original.test",
      request: {
        fetch: mock,
      },
    });
    const octokitPatched = new MyOctokit({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock,
      },
    });

    const options = {
      owner: "octokit",
      repo: "rest.js",
      issue_number: 1,
      labels: ["foo", "bar"],
    };

    return Promise.all([
      octokitOriginal.issues.addLabels(options),
      octokitPatched.issues.addLabels(options),
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
            labels: ["foo", "bar"],
          },
        }
      )
      .put(
        "https://patched.test/repos/octokit/rest.js/issues/1/labels",
        {},
        {
          // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
          body: ["foo", "bar"],
        }
      );

    const octokitOriginal = new Octokit({
      baseUrl: "https://original.test",
      request: {
        fetch: mock,
      },
    });
    const octokitPatched = new MyOctokit({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock,
      },
    });

    const options = {
      owner: "octokit",
      repo: "rest.js",
      issue_number: 1,
      labels: ["foo", "bar"],
    };

    return Promise.all([
      octokitOriginal.issues.replaceLabels(options),
      octokitPatched.issues.replaceLabels(options),
    ]);
  });
});
