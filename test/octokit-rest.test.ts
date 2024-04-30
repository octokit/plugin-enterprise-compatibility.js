import { Octokit as OctokitCore } from "@octokit/core";
import { requestLog } from "@octokit/plugin-request-log";
import { legacyRestEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { paginateRest } from "@octokit/plugin-paginate-rest";

import { enterpriseCompatibility } from "../src/index.js";

const Octokit = OctokitCore.plugin(
  requestLog,
  legacyRestEndpointMethods,
  paginateRest,
).defaults({
  userAgent: `octokit-rest.js`,
});
const MyOctokit = Octokit.plugin(enterpriseCompatibility);

describe("side effects", () => {
  it("does leave other endpoints in tact", () => {
    const octokit = new MyOctokit();

    expect(octokit.issues.get.endpoint).toBeTruthy();
  });
});
