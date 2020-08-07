#!/usr/bin/env python

import sys
from setup import setup
from util import nodeenv_delegate

YARN_DEPENDENCY_MANAGEMENT_COMMANDS = [
    "add",
    "install",
    "link",
    "remove",
    "unlink",
    "upgrade",
    "upgrade-interactive",
]

if __name__ == "__main__":
    command = next((arg for arg in sys.argv[1:] if not arg.startswith("-")), "install")
    setup(skip_dependencies=(command in YARN_DEPENDENCY_MANAGEMENT_COMMANDS))
    nodeenv_delegate("yarn")
