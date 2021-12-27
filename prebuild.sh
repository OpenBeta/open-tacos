#!/bin/bash
# Prepare the build environment by downloading the content repo locally
#
# Syntax:
#     ./prebuild [full]
#
#     Specify 'full' include the entire dataset
#

rm -rf content

rm -rf opentacos-content

git clone --depth 1 --branch develop --quiet \
  https://github.com/OpenBeta/opentacos-content.git 

if [ "$1" != "full" ];
then
  mkdir content
  echo "Copying selected content..."
  pushd opentacos-content/content
  export target="../../content"
  # Copy only the first and 2nd level index.md for each state 
  find . -mindepth 2 -maxdepth 4 -type f -name "*.geojson" -o -name "index.md"  -exec rsync -aR "{}" $target \;

  # Copy only a few specific areas
  rsync -aR ./USA/Oregon/Mt.\ Hood $target
  rsync -aR ./USA/Oregon/Central\ Oregon/Smith\ Rock $target
  popd
else
  echo "Make entire repo available to build"
  mv opentacos-content/content content
fi
