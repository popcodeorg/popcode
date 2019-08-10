from os import path
from io import StringIO
from subprocess import (Popen, PIPE)

NODEENV_DIR = path.join(path.dirname(__file__), '..', '..', 'nodeenv')

def run_in_nodeenv(command):
    if path.exists(path.join(NODEENV_DIR, 'bin')):
        return _run_in_nodeenv_with_bash(command)
    elif path.exists(path.join(NODEENV_DIR, 'Scripts')):
        return _run_in_nodeenv_with_powershell(command)
    else:
        raise Exception('nodeenv did not create either a bin/ or a Scripts/ dir.')

def _run_in_nodeenv_with_bash(command):
    return _run_and_capture_output([
        'bash',
        '-c',
        """
        . {nodeenv_dir}/bin/activate
        {command}
        """.format(nodeenv_dir=NODEENV_DIR, command=command)])

def _run_in_nodeenv_with_powershell(command):
    try:
        return _run_in_nodeenv_with_powershell_executable(command, 'pwsh')
    except OSError:
        return _run_in_nodeenv_with_powershell_executable(command, 'powershell')

def _run_in_nodeenv_with_powershell_executable(command, exe):
    return _run_and_capture_output([
        exe,
        '-Command',
        """
        & {nodeenv_dir}/Scripts/Activate.ps1
        {command}
        """.format(nodeenv_dir=NODEENV_DIR, command=command)])

def _run_and_capture_output(args):
    (out, _) = Popen(args, stdout=PIPE).communicate()
    return out.decode('utf-8')
