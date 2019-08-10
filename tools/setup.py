#!/usr/bin/env python

from io import BytesIO
import json
from os import path
import re
import shutil
import subprocess
import sys
import tempfile
from zipfile import ZipFile

try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen

from util import (NODEENV_DIR, run_in_nodeenv)

NODEENV_VERSION = '1.3.3'
POPCODE_ROOT = path.abspath(path.join(path.dirname(__file__), '..'))

def normalize_version_string(version_string):
    return re.sub('^\\D+', '', version_string.strip())

with open(path.join(POPCODE_ROOT, 'package.json')) as package_json:
    engines = json.load(package_json)['engines']
    NODE_VERSION = normalize_version_string(engines['node'])
    YARN_VERSION =  normalize_version_string(engines['yarn'])

def is_nodeenv_installed():
    return path.exists(NODEENV_DIR)

def is_nodeenv_node_version_correct():
    version = normalize_version_string(run_in_nodeenv('node --version'))
    return version == NODE_VERSION

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

def install_dependencies():
    run_in_nodeenv("""
        npm config set update-notifier false
        npm install --quiet --global yarn@{yarn_version}
        yarn install --frozen-lockfile --non-interactive --no-progress --silent
    """.format(yarn_version=YARN_VERSION))

def main():
    if is_nodeenv_installed() and not is_nodeenv_node_version_correct():
        shutil.rmtree(NODEENV_DIR)
    if not is_nodeenv_installed():
        nodeenv_package_dir = install_nodeenv()
        create_nodeenv(nodeenv_package_dir)
    install_dependencies()

if __name__ == "__main__":
    main()
