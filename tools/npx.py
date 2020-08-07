#!/usr/bin/env python

from util import nodeenv_delegate
from setup import setup

if __name__ == "__main__":
    setup(skip_dependencies=True)
    nodeenv_delegate("npx")
