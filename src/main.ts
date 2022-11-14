import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as path from 'path'
import * as tc from '@actions/tool-cache'

async function run(): Promise<void> {
  try {
    const version = core.getInput('version')
    await installCLI(version)

    const accessToken = core.getInput('accessToken')
    if (accessToken) {
      await signIn(accessToken)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function installCLI(version: string): Promise<void> {
  const cachePath = tc.find('rok', version)
  if (cachePath) {
    return core.addPath(cachePath)
  }

  if (version !== 'latest' && !version.startsWith('v')) {
    version = `v${version}`
  }

  const url = `https://releases.immerok.cloud/rok/${version}/rok-linux-amd64.tar.gz`
  const archiveDir = await tc.downloadTool(url)
  const extractedDir = await tc.extractTar(archiveDir)

  const root = path.join(extractedDir, 'rok-linux-amd64')
  core.addPath(await tc.cacheDir(root, 'rok', version))
}

async function signIn(accessToken: string): Promise<void> {
  await exec.exec('rok', ['auth', 'login', '--token', accessToken])
}

run()
