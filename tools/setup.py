#!/usr/bin/env python

from io import BytesIO
import json
from os import path
import re
import subprocess
import sys
import tempfile
from zipfile import ZipFile

try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen

NODEENV_VERSION = '1.3.3'
POPCODE_ROOT = path.abspath(path.join(path.dirname(__file__), '..'))
NODEENV_DIR = path.join(POPCODE_ROOT, 'nodeenv')

with open(path.join(POPCODE_ROOT, '.node-version')) as node_version_file:
    NODE_VERSION = re.sub('^v', '', node_version_file.read().strip())

with open(path.join(POPCODE_ROOT, 'package.json')) as package_json:
    YARN_VERSION = re.sub('^\\D+', '', json.load(package_json)['engines']['yarn'])

INSTALL_SCRIPT = """
npm config set update-notifier false
npm install --quiet --global yarn@{yarn_version}
yarn install --frozen-lockfile --non-interactive --no-progress --silent
""".format(yarn_version=YARN_VERSION)

def install_nodeenv():
    nodeenv_tmpdir = tempfile.mkdtemp()
    nodeenv_zip_response = urlopen(
        'https://github.com/ekalinin/nodeenv/archive/'
        + NODEENV_VERSION
        + '.zip')
    nodeenv_zip_bytes = BytesIO(nodeenv_zip_response.read())
    nodeenv_zip_response.close()
    nodeenv_zip = ZipFile(nodeenv_zip_bytes)
    nodeenv_zip.extractall(nodeenv_tmpdir)
    return path.join(nodeenv_tmpdir, 'nodeenv-' + NODEENV_VERSION)

def create_nodeenv(nodeenv_package_dir):
    subprocess.call([
        'python',
        path.join(nodeenv_package_dir, 'nodeenv.py'),
        '--node=' + NODE_VERSION, NODEENV_DIR])

def install_dependencies_with_bash():
    subprocess.call([
        'bash',
        '-c',
        """
        . {nodeenv_dir}/bin/activate
        {install_script}
        """.format(nodeenv_dir=NODEENV_DIR, install_script=INSTALL_SCRIPT)])

def install_dependencies_with_powershell():
    subprocess.call([
        'pwsh',
        '-c',
        """
        & {nodeenv_dir}/Scripts/Activate.ps1
        {install_script}
        """.format(nodeenv_dir=NODEENV_DIR, install_script=INSTALL_SCRIPT)])

def install_dependencies():
    if path.exists(path.join(NODEENV_DIR, 'bin')):
        install_dependencies_with_bash()
    elif path.exists(path.join(NODEENV_DIR, 'Scripts')):
        install_dependencies_with_powershell()
    else:
        raise Exception('nodeenv did not create either a bin/ or a Scripts/ dir.')

def main():
    nodeenv_package_dir = install_nodeenv()
    create_nodeenv(nodeenv_package_dir)
    install_dependencies()

if __name__ == "__main__":
    main()
