import fetchMock from "fetch-mock";
import { Octokit } from "@octokit/core";

import { enterpriseCompatibility } from "../src";
const OctokitWithPlugin = Octokit.plugin(enterpriseCompatibility);

describe("GET /repos/{owner}/{repo}/issues/{issue_number}/labels", () => {
  it("has no effect on GET methods", async () => {
    const mock = fetchMock
      .sandbox()
      .get("https://patched.test/repos/octokit/rest.js/issues/1/labels", [
        {
          id: 1,
        },
      ]);

    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock,
      },
    });

    const { data } = await octokitPatched.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
      {
        owner: "octokit",
        repo: "rest.js",
        issue_number: 1,
      }
    );
    expect(data[0].id).toEqual(1);
  });
});

describe("POST /repos/{owner}/{repo}/labels", () => {
  it("has no effoct on paths other than /repos/{owner}/{repo}/issues/{issue_number}/labels", () => {
    const mock = fetchMock
      .sandbox()
      .post("https://patched.test/repos/octokit/rest.js/labels", 200, {
        // @ts-ignore definitions missing, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40133
        body: {
          name: "foo",
          color: "BADA55",
        },
      });

    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://patched.test",
      request: {
        fetch: mock,
      },
    });

    return octokitPatched.request("POST /repos/{owner}/{repo}/labels", {
      owner: "octokit",
      repo: "rest.js",
      name: "foo",
      color: "BADA55",
    });
  });
});

describe("GET /orgs/{org}/teams/{team_slug}*", () => {
  it("Throws no error for github.com users", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce("https://api.github.com/orgs/my-org/teams/my-team", {
        status: 200,
        body: { id: 123 },
      });

    const octokitPatched = new OctokitWithPlugin({
      request: {
        fetch: mock,
      },
    });

    const { data } = await octokitPatched.request(
      "GET /orgs/{org}/teams/{team_slug}",
      {
        org: "my-org",
        team_slug: "my-team",
      }
    );

    expect(data.id).toStrictEqual(123);
  });

  it("Throws no error for github.com users", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce("https://api.github.com/orgs/my-org/teams/my-team", {
        status: 404,
        body: { error: "not found" },
      });

    const octokitPatched = new OctokitWithPlugin({
      request: {
        fetch: mock,
      },
    });

    try {
      await octokitPatched.request("GET /orgs/{org}/teams/{team_slug}", {
        org: "my-org",
        team_slug: "my-team",
      });
      throw new Error("should not resolve");
    } catch (error: any) {
      expect(error.status).toEqual(404);
    }
  });

  it("'GET /orgs/{org}/teams/{team_slug}': Throws a helpful error for GitHub Enterprise Server 2.20 users", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce("https://ghes.acme-inc.test/api/v3/orgs/my-org/teams/my-team", {
        status: 404,
        body: { error: "Not found" },
        headers: {
          "X-GitHub-Enterprise-Version": "2.20.0",
        },
      });

    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://ghes.acme-inc.test/api/v3",
      request: {
        fetch: mock,
      },
    });

    try {
      await octokitPatched.request("GET /orgs/{org}/teams/{team_slug}", {
        org: "my-org",
        team_slug: "my-team",
      });
      throw new Error("Should not resolve");
    } catch (error: any) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual(
        `"GET /orgs/{org}/teams/{team_slug}" is not supported in your GitHub Enterprise Server version. Please replace with octokit.request("GET /teams/{team_id}", { team_id })`
      );
    }
  });

  it("'GET /orgs/{org}/teams/{team_slug}': 500 error", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce("https://ghes.acme-inc.test/api/v3/orgs/my-org/teams/my-team", {
        status: 500,
      });

    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://ghes.acme-inc.test/api/v3",
      request: {
        fetch: mock,
      },
    });

    try {
      await octokitPatched.request("GET /orgs/{org}/teams/{team_slug}", {
        org: "my-org",
        team_slug: "my-team",
      });
      throw new Error("Should not resolve");
    } catch (error: any) {
      expect(error.status).toEqual(500);
    }
  });

  it("'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments': Throws a helpful error for GitHub Enterprise Server 2.20 users", async () => {
    const mock = fetchMock
      .sandbox()
      .getOnce(
        "https://ghes.acme-inc.test/api/v3/orgs/my-org/teams/my-team/discussions/123/comments",
        {
          status: 404,
          body: { error: "Not found" },
          headers: {
            "X-GitHub-Enterprise-Version": "2.20.0",
          },
        }
      );

    const octokitPatched = new OctokitWithPlugin({
      baseUrl: "https://ghes.acme-inc.test/api/v3",
      request: {
        fetch: mock,
      },
    });

    try {
      await octokitPatched.request(
        "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
        {
          org: "my-org",
          team_slug: "my-team",
          discussion_number: 123,
        }
      );
      throw new Error("Should not resolve");
    } catch (error: any) {
      expect(error.status).toEqual(404);
      expect(error.message).toEqual(
        `"GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments" is not supported in your GitHub Enterprise Server version. Please replace with octokit.request("GET /teams/{team_id}/discussions/{discussion_number}/comments", { team_id })`
      );
    }
  });
});
