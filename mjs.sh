#!/usr/bin/env bash

files=$(find src -name '*.js')

for f in ${files}; do
  n=${f/src/lib}
  n=${n/\.js/.mjs}
  cp -fv "$f" "$n"
done
