{ lib, pkgs, ... }:

let
  inherit (lib) mkOption mkEnableOption types;
  jsonFormat = pkgs.formats.json { };
in {
  enable = mkEnableOption "Enable limbo bar";

  package = mkOption {
    type = types.package;
    default = pkgs.callPackage ./default.nix { };
    defaultText = "pkgs.limbo";
    description = "The package to use for limbo bar";
  };

  settings = mkOption {
    type = jsonFormat.type;
    default = null;
    description = "Settings for limbo bar, JSON format";
  };
}
