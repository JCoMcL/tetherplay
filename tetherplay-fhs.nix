{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "tetherplay-fhs-env";
  targetPkgs = pkgs: with pkgs; [ 
    udev
    libudev
    pkgconfig
    rust-bindgen
    rustfmt
    #makeheaders not in nix yet
  ];
  multiPkgs = pkgs: (with pkgs; [
    udev
    libudev
  ]);
  profile = '' export SHELL=zsh '';
  extraOutputsToInstall = [ "dev" ];
  runScript = ''$SHELL'';
}).env
