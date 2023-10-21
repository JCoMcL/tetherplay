{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "tetherplay-fhs-env";
  targetPkgs = pkgs: with pkgs; [ 
    udev
    libevdev
    pkgconfig
  ];
  profile = '' export SHELL=zsh '';
  extraOutputsToInstall = [ "dev" ];
  runScript = ''$SHELL'';
}).env
