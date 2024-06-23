{
  description = "A really good bar using ags";

  inputs = {
    devenv-root = {
      url = "file+file:///dev/null";
      flake = false;
    };
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    devenv.url = "github:cachix/devenv";
    nix2container.url = "github:nlewo/nix2container";
    nix2container.inputs.nixpkgs.follows = "nixpkgs";
    mk-shell-bin.url = "github:rrbutani/nix-mk-shell-bin";
    ags.url = "github:Aylur/ags";
  };

  nixConfig = {
    extra-trusted-public-keys =
      "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = inputs@{ flake-parts, devenv-root, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.devenv.flakeModule ];
      systems = [
        "x86_64-linux"
        "i686-linux"
        "x86_64-darwin"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      perSystem = { config, self', inputs', pkgs, lib, system, ... }: {
        # packages.default = pkgs.hello;

        devenv.shells.default = let ags = inputs'.ags.packages.default;
        in {
          name = "limbo";
          devenv.root =
            let devenvRootFileContent = builtins.readFile devenv-root.outPath;
            in pkgs.lib.mkIf (devenvRootFileContent != "")
            devenvRootFileContent;

          # https://devenv.sh/reference/options/
          packages = let svg-fixer = pkgs.callPackage ./nix/svg-fixer.nix { };
          in [
            ags
            svg-fixer
            pkgs.nodePackages.nodemon
            # config.packages.default
          ];

          languages.javascript = {
            enable = true;
            bun.enable = true;
          };

          process-managers.process-compose.enable = true;
          processes.limbo.exec = "ags --config ./config.js";
          scripts.dev.exec = "nodemon";
          scripts.fix-icons.exec =
            "oslllo-svg-fixer -s ./tabler-icons -d ./icons";
          scripts.link-types.exec =
            "test -f ./tsconfig.json && ln -s ${ags}/share/com.github.Aylur.ags/types ./types";
        };
      };
      # flake = { };
    };
}
