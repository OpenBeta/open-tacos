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

git clone --depth 1 --branch develop \
  https://github.com/OpenBeta/opentacos-content.git 

if [ "$1" != "full" ];
then
  mkdir content
  echo "Copying selected content..."
  pushd opentacos-content/content
  export target="../../content"
  # Copy only the first and 2nd level index.md for each state 
  find . -mindepth 2 -maxdepth 4  -name "index*"  -exec rsync -aR "{}" $target \;

  # Copy only a few specific areas
  rsync -aR ./USA/Oregon/Central\ Oregon/Smith\ Rock $target
  rsync -aR ./USA/Nevada/Southern\ Nevada/Red\ Rock $target
  popd
else
  echo "Creating a symlink to entire content repo"
  ln -s opentacos-content/content content
fi
