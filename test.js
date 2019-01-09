const nock = require('nock')
const { test } = require('tap')

const Octokit = require('@octokit/rest')

test('octokit.issues.addLabels() sends labels in request body', t => {
  const octokitOriginal = Octokit({ baseUrl: 'https://original.test' })
  const octokitPatched = Octokit.plugin(require('.'))({ baseUrl: 'https://patched.test' })

  nock('https://original.test')
    .post('/repos/octokit/rest.js/issues/1/labels', { labels: [ 'foo', 'bar' ] })
    .reply(200, {})
  nock('https://patched.test')
    .post('/repos/octokit/rest.js/issues/1/labels', [ 'foo', 'bar' ])
    .reply(200, {})

  const options = {
    owner: 'octokit',
    repo: 'rest.js',
    number: 1,
    labels: ['foo', 'bar']
  }

  return Promise.all([
    octokitOriginal.issues.addLabels(options),
    octokitPatched.issues.addLabels(options)
  ])
})
