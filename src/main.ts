import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as path from 'path'
import * as tc from '@actions/tool-cache'
import os from 'os'

const SupportedPlatforms = ['linux', 'darwin']
const SupportedArchs = ['arm64', 'amd64']

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

  const platform = getPlatform()
  if (!SupportedPlatforms.includes(platform)) {
    throw new Error(`Unsupported platform ${platform}`)
  }

  const arch = getArch()
  if (!SupportedArchs.includes(arch)) {
    throw new Error(`Unsupported architecture ${arch}`)
  }

  const url = `https://releases.immerok.cloud/rok/${version}/rok-${platform}-${arch}.tar.gz`
  const archiveDir = await tc.downloadTool(url)
  const extractedDir = await tc.extractTar(archiveDir)

  const root = path.join(extractedDir, 'rok-linux-amd64')
  core.addPath(await tc.cacheDir(root, 'rok', version))
}

function getPlatform(): string {
  let plat: string = os.platform()
  if (plat === 'win32') {
    plat = 'windows'
  }

  return plat
}

function getArch(): string {
  let arch = os.arch()

  switch (arch) {
    case 'x64':
      arch = 'amd64'
      break
  }

  return arch
}

async function signIn(accessToken: string): Promise<void> {
  await exec.exec('rok', ['auth', 'login', '--token', accessToken])
}

run()
