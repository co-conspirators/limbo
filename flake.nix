{
  description = "A really good bar using ags";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    ags.url = "github:Aylur/ags";
    ags.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs@{ self, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.flake-parts.flakeModules.easyOverlay ];
      systems = [
        "x86_64-linux"
        "i686-linux"
        "x86_64-darwin"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      perSystem = { config, self', inputs', pkgs, lib, system, ... }: {
        _module.args.pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [ self.overlays.default ];
        };

        packages = {
          default = self'.packages.limbo;
          limbo = pkgs.callPackage ./nix { };
        };

        apps = {
          limbo = {
            type = "app";
            program = self'.packages.limbo;
          };
          default = self'.apps.limbo;

          dev = {
            type = "app";
            program = pkgs.writeScriptBin "ags-dev" ''
              #!${pkgs.bash}/bin/bash

              ${pkgs.bun}/bin/bun run dev
            '';
          };
        };

        overlayAttrs = { inherit (config.packages) limbo; };

        devShells.default = let ags = inputs'.ags.packages.default;
        in pkgs.mkShell {
          buildInputs = [ ags ] ++ (with pkgs; [
            bun
            nodejs_22
            procps
            pulseaudio
            wlinhibit
            config.packages.default
          ]);
          shellHook = ''
            export AGS_TYPES=${ags}/share/com.github.Aylur.ags/types

            alias dev="nix run .#dev"
            alias link-types="[[ -f ./tsconfig ]] && ln -sf ${ags}/share/com.github.Aylur.ags/types ./types"
          '';
        };
      };
      flake = { self, ... }: {
        nixosModules.default = import ./nix/module.nix;
        homeManagerModules.default = import ./nix/hm-module.nix;
      };
    };
}
