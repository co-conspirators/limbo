{ lib, pkgs, ... }:

let inherit (lib) mkOption mkEnableOption types;
in {
  enable = mkEnableOption "Enable limbo bar";

  package = mkOption {
    type = types.package;
    default = pkgs.callPackage ./default.nix { };
    defaultText = "pkgs.limbo";
    description = "The package to use for limbo bar";
  };

  settings = with types;
    mkOption {
      type = attrsOf anything;
      default = { };
      description = "Settings for limbo bar, JSON format";
    };
}
