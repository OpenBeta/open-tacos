#!/bin/bash
# Prepare the build environment
#
# Syntax:
#     ./prebuild [full]
#
#     Specify 'full' include the entire dataset 


shopt -s extglob

rm -rf opentacos-content
rm -rf content

git clone --depth 1 --branch nevada git@github.com:OpenBeta/opentacos-content.git opentacos-content

if [ "$1" != "full" ];
then
  echo "Triming data files..."
  rm -rf opentacos-content/content/USA/Nevada/?(Eastern*|Western*)
fi

ln -s opentacos-content/content content
