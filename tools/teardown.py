#!/usr/bin/env python

import shutil
from util import POPCODE_ROOT, NODEENV_DIR
from os import path


def teardown():
    shutil.rmtree(NODEENV_DIR)
    shutil.rmtree(path.join(POPCODE_ROOT, "node_modules"))
    shutil.rmtree(path.join(POPCODE_ROOT, "bower_components"))


if __name__ == "__main__":
    teardown()
