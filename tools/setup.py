#!/usr/bin/env python

from io import BytesIO
import json
import os
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

from util import (
    NODEENV_DIR,
    POPCODE_ROOT,
    run_in_nodeenv,
    run_and_capture_in_nodeenv)

NODEENV_VERSION = '1.3.3'

def _normalize_version_string(version_string):
    return re.sub('^\\D+', '', version_string.strip())

with open(os.path.join(POPCODE_ROOT, 'package.json')) as package_json:
    engines = json.load(package_json)['engines']
    NODE_VERSION = _normalize_version_string(engines['node'])
    YARN_VERSION =  _normalize_version_string(engines['yarn'])

def _is_nodeenv_installed():
    return os.path.exists(NODEENV_DIR)

def _is_nodeenv_node_version_correct():
    version = _normalize_version_string(
        run_and_capture_in_nodeenv(['node', '--version']))
    return version == NODE_VERSION

def _install_nodeenv():
    nodeenv_tmpdir = tempfile.mkdtemp()
    nodeenv_zip_response = urlopen(
        'https://github.com/ekalinin/nodeenv/archive/'
        + NODEENV_VERSION
        + '.zip')
    nodeenv_zip_bytes = BytesIO(nodeenv_zip_response.read())
    nodeenv_zip_response.close()
    nodeenv_zip = ZipFile(nodeenv_zip_bytes)
    nodeenv_zip.extractall(nodeenv_tmpdir)
    return os.path.join(nodeenv_tmpdir, 'nodeenv-' + NODEENV_VERSION)

def _create_nodeenv(nodeenv_package_dir):
    subprocess.call([
        'python',
        os.path.join(nodeenv_package_dir, 'nodeenv.py'),
        '--node=' + NODE_VERSION, NODEENV_DIR])

def _is_yarn_version_correct():
    try:
        version = _normalize_version_string(
            run_and_capture_in_nodeenv(['yarn', '--version']))
        return version == YARN_VERSION
    except subprocess.CalledProcessError:
        return False

def _install_yarn():
    run_in_nodeenv(['npm', 'config', 'set', 'update-notifier', 'false'])
    run_in_nodeenv(['npm',
                    'install',
                    '--quiet',
                    '--global',
                    'yarn@{yarn_version}'.format(yarn_version=YARN_VERSION)])

def _install_dependencies():
    run_in_nodeenv(['yarn',
                    'install',
                    '--frozen-lockfile',
                    '--check-files',
                    '--non-interactive',
                    '--no-progress',
                    '--silent'])

def _symlink_vscode_config():
    vscode_dir = os.path.join(POPCODE_ROOT, '.vscode')
    if not os.path.exists(vscode_dir):
        os.symlink(os.path.join('contrib', 'vscode'), vscode_dir)
        gitignore_path = os.path.join(POPCODE_ROOT, '.git', 'info', 'exclude')
        if not os.path.exists(os.path.dirname(gitignore_path)):
            os.mkdir(os.path.dirname(gitignore_path))
        needs_vscode_in_gitignore = True
        if os.path.exists(gitignore_path):
            with open(gitignore_path, 'r') as gitignore_r:
                needs_vscode_in_gitignore = not '.vscode' in gitignore_r
        if needs_vscode_in_gitignore:
            with open(gitignore_path, 'a') as gitignore_a:
                gitignore_a.writelines(['/.vscode\n'])

def _print_success_message():
    yarn_path = os.path.join('tools', 'yarn.py')
    print("""
================================================================================

Your development environment is ready! To run your development server, type:

  {yarn_path} start

To run tests in watch mode type:

  {yarn_path} run autotest.jest

or

  {yarn_path} run autotest.karma
""".format(yarn_path=yarn_path))

def setup():
    if _is_nodeenv_installed() and not _is_nodeenv_node_version_correct():
        shutil.rmtree(NODEENV_DIR)
    if not _is_nodeenv_installed():
        nodeenv_package_dir = _install_nodeenv()
        _create_nodeenv(nodeenv_package_dir)
    if not _is_yarn_version_correct():
        _install_yarn()
    _install_dependencies()
    _symlink_vscode_config()

if __name__ == "__main__":
    setup()
    _print_success_message()
