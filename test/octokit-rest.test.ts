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
