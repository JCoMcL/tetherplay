{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "tetherplay-fhs-env";
  targetPkgs = pkgs: with pkgs; [ 
    udev
    libudev
	 pkgconfig
  ];
  multiPkgs = pkgs: (with pkgs; [
    udev
    libudev
  ]);
  extraOutputsToInstall = [ "dev" ];
  runScript = ''zsh'';
}).env
