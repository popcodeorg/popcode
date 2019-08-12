from os import path
from io import StringIO
import subprocess
import sys

try:
    from shlex import quote as shell_quote
except ImportError:
    from pipes import quote as shell_quote

POPCODE_ROOT = path.abspath(path.join(path.dirname(__file__), '..', '..'))
NODEENV_DIR = path.join(POPCODE_ROOT, 'nodeenv')
NODEENV_BASH_ACTIVATE = path.join(NODEENV_DIR, 'bin', 'activate')
NODEENV_POWERSHELL_ACTIVATE = path.join(NODEENV_DIR, 'Scripts', 'Activate.ps1')

def nodeenv_delegate(executable):
    sys.exit(run_in_nodeenv([executable] + sys.argv[1:]))

def run_in_nodeenv(command):
    if _has_bash_nodeenv():
        return _run_in_nodeenv_with_bash(command)
    elif _has_powershell_nodeenv():
        return _run_in_nodeenv_with_powershell(command)
    else:
        raise Exception('nodeenv did not create either a bin/ or a Scripts/ dir.')

def _run_in_nodeenv_with_bash(command):
    return subprocess.call(_generate_bash_script_args(command))

def _run_in_nodeenv_with_powershell(command):
    try:
        return subprocess.check_call(
            _generate_powershell_script_args(command, 'pwsh'))
    except FileNotFoundError:
        return subprocess.check_call(
            _generate_powershell_script_args(command, 'powershell'))

def run_and_capture_in_nodeenv(command):
    if _has_bash_nodeenv():
        return _run_and_capture_in_nodeenv_with_bash(command)
    elif _has_powershell_nodeenv():
        return _run_and_capture_in_nodeenv_with_powershell(command)
    else:
        raise Exception('nodeenv did not create either a bin/ or a Scripts/ dir.')

def _run_and_capture_in_nodeenv_with_bash(command):
    return _run_and_capture_output(_generate_bash_script_args(command))

def _run_and_capture_in_nodeenv_with_powershell(command):
    try:
        return _run_and_capture_output(
            _generate_powershell_script_args(command, 'pwsh'))
    except FileNotFoundError:
        return _run_and_capture_output(
            _generate_powershell_script_args(command, 'powershell'))

def _generate_bash_script_args(command):
    return [
        'bash',
        '-c',
        """
        . {activate}
        {command}
        """.format(activate=NODEENV_BASH_ACTIVATE, command=shell_join(command))]

def _generate_powershell_script_args(command, exe):
    return [
        exe,
        '-Command',
        """
        & {activate}
        {command}
        """.format(activate=NODEENV_POWERSHELL_ACTIVATE, command=shell_join(command))]

def _has_bash_nodeenv():
    return path.exists(NODEENV_BASH_ACTIVATE)

def _has_powershell_nodeenv():
    return path.exists(NODEENV_POWERSHELL_ACTIVATE)

def _run_and_capture_output(args):
    (out, _) = subprocess.Popen(args, stdout=subprocess.PIPE).communicate()
    return out.decode('utf-8')

def shell_join(command):
    return ' '.join([shell_quote(arg) for arg in command])
