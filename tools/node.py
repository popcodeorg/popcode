#!/usr/bin/env python

from util import nodeenv_delegate
from setup import setup

if __name__ == '__main__':
    setup()
    nodeenv_delegate('node')
