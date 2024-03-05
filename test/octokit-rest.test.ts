import { Octokit } from "@octokit/rest";

import { enterpriseCompatibility } from "../src/index.js";

const MyOctokit = Octokit.plugin(enterpriseCompatibility);

describe("side effects", () => {
  it("does leave other endpoints in tact", () => {
    const octokit = new MyOctokit();

    expect(octokit.issues.get.endpoint).toBeTruthy();
  });
});
