{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "tetherplay-fhs-env";
  targetPkgs = pkgs: with pkgs; [ 
    udev
    libudev
	 pkgconfig
    bindgen
    rustfmt
    #makeheaders not in nix yet
  ];
  multiPkgs = pkgs: (with pkgs; [
    udev
    libudev
  ]);
  extraOutputsToInstall = [ "dev" ];
  runScript = ''zsh'';
}).env
