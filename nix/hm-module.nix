self:
{ config, lib, pkgs, ... }:

let
  cfg = config.services.limbo;
  limbo = self.packages.${pkgs.system}.default;
in {
  options.services.limbo = (import ./options.nix { inherit lib limbo; });

  config =
    let finalPackage = cfg.package.override { defaultConfig = cfg.settings; };
    in lib.mkIf cfg.enable {
      home.packages = [ cfg.package ];
      systemd.user.services.limbo = {
        Unit = {
          Description = "Super good bar for wayland build on ags";
          Documentation = "https://github.com/Saghen/limbo";
          PartOf = [ "graphical-session.target" ];
          After = [ "graphical-session-pre.target" ];
        };
        Service = {
          ExecStart = "${finalPackage}/bin/limbo";
          Restart = "always";
        };
        Install = { WantedBy = [ "graphical-session.target" ]; };
      };
    };
}
