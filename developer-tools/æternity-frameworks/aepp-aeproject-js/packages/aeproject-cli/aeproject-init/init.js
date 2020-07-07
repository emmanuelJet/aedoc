/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */
const constants = require('./constants.json');
const utils = require('aeproject-utils');
const execute = utils.execute;
const printError = utils.printError;
const print = utils.print;
const createMissingFolder = utils.createMissingFolder;
const copyFileOrDir = utils.copyFileOrDir;

const sdkVersion = constants.sdkVersion;

async function run (update) {
    if (update) {
        await updateAEprojectProjectLibraries(sdkVersion);
        return;
    }

    try {
        await createAEprojectProjectStructure();

    } catch (e) {
        printError(e.message)
        console.error(e);
    }
}

const createAEprojectProjectStructure = async (shape) => {
    print('===== Initializing AEproject =====');

    await installLibraries()

    print(`===== Creating project file & dir structure =====`);

    setupContracts(shape);
    setupTests(shape);
    setupIntegrations();
    await setupDeploy(shape);
    setupDocker();
    addIgnoreFile();

    print('===== AEproject was successfully initialized! =====');
}

const updateAEprojectProjectLibraries = async (_sdkVersion) => {
    print(`===== Updating AEproject files =====`);

    setupDocker();
    await installAEproject()
    await installAeppSDK(_sdkVersion)
    await installYarn()

    print('===== AEproject was successfully updated! =====');
}

const installLibraries = async () => {
    const fileSource = `${ __dirname }${ constants.artifactsDir }/package.json`;
    copyFileOrDir(fileSource, "./package.json")
    await installAeppSDK(sdkVersion)
    await installAEproject()
    await installYarn()
}

const installAeppSDK = async (_sdkVersion = '') => {
    print('===== Installing aepp-sdk =====');
    await execute(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', 'install', [`@aeternity/aepp-sdk@${ _sdkVersion }`, '--save-exact']);
}

const installAEproject = async () => {
    print(`===== Installing AEproject locally =====`);
    await execute(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', 'install', [`aeproject-lib`, '--save-exact', '--ignore-scripts', '--no-bin-links']);
}

const installYarn = async () => {
    print(`===== Installing yarn locally =====`);
    await execute(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', 'install', ['yarn', '--save-exact', '--ignore-scripts', '--no-bin-links']);
}

const setupContracts = (shape) => {
    print(`===== Creating contracts directory =====`);
    const fileSource = shape ? `${ __dirname }${ constants.shapeArtifactsDir }/${ constants.shapeContractTemplateFile }` : `${ __dirname }${ constants.artifactsDir }/${ constants.contractTemplateFile }`;
    createMissingFolder(constants.contractsDir);
    copyFileOrDir(fileSource, shape ? constants.shapeContractFileDestination : constants.contractFileDestination)
}

const setupIntegrations = () => {
    print(`===== Creating integrations directory =====`);
    const fileSource = `${ __dirname }${ constants.artifactsDir }/${ constants.contratsAeppSetting }`;
    createMissingFolder(constants.integrationsDir);
    copyFileOrDir(fileSource, constants.contratsAeppSettingFileDestination)
}

const setupTests = (shape) => {
    print(`===== Creating tests directory =====`);
    const fileSource = shape ? `${ __dirname }${ constants.shapeArtifactsDir }/${ constants.shapeTestTemplateFile }` : `${ __dirname }${ constants.artifactsDir }/${ constants.testTemplateFile }`;
    createMissingFolder(constants.testDir, "Creating tests file structure");
    copyFileOrDir(fileSource, shape ? constants.shapeTestFileDestination : constants.testFileDestination)
}

const setupDeploy = async (shape) => {

    print(`===== Creating deploy directory =====`);
    const fileSource = shape ? `${ __dirname }${ constants.shapeArtifactsDir }/${ constants.shapeDeployTemplateFile }` : `${ __dirname }${ constants.artifactsDir }/${ constants.deployTemplateFile }`;
    createMissingFolder(constants.deployDir, "Creating deploy directory file structure");
    copyFileOrDir(fileSource, constants.deployFileDestination)
}

const setupDocker = () => {
    print(`===== Creating docker directory =====`);
    const dockerFilesSource = `${ __dirname }${ constants.artifactsDir }/${ constants.dockerTemplateDir }`;
    const copyOptions = {
        overwrite: true
    }

    const dockerNodeYmlFileSource = `${ __dirname }${ constants.artifactsDir }/${ constants.dockerNodeYmlFile }`;
    copyFileOrDir(dockerNodeYmlFileSource, constants.dockerNodeYmlFileDestination, copyOptions)
    copyFileOrDir(dockerFilesSource, constants.dockerFilesDestination, copyOptions)

    const dockerCompilerYmlFileSource = `${ __dirname }${ constants.artifactsDir }/${ constants.dockerCompilerYmlFile }`;
    copyFileOrDir(dockerCompilerYmlFileSource, constants.dockerCompilerYmlFileDestination, copyOptions)
    copyFileOrDir(dockerFilesSource, constants.dockerFilesDestination, copyOptions)
}

const addIgnoreFile = () => {
    print(`==== Adding additional files ====`)
    const ignoreFileSource = `${ __dirname }${ constants.artifactsDir }/${ constants.gitIgnoreFile }`;
    copyFileOrDir(ignoreFileSource, constants.gitIgnoreFile)
}

module.exports = {
    run,
    createAEprojectProjectStructure
}