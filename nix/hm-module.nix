{ config, lib, pkgs, ... }:

let cfg = config.services.limbo;
in {
  options.services.limbo = (import ./options.nix { inherit lib pkgs; });

  config = lib.mkIf cfg.enable {
      home.packages = [ cfg.package ];

      xdg.configFile.limboConfig = {
        target = "limbo/config.json";
        text = builtins.toJSON cfg.settings;
      };

      systemd.user.services.limbo = {
        Unit = {
          Description = "Super good bar for wayland build on ags";
          Documentation = "https://github.com/Saghen/limbo";
          PartOf = [ "graphical-session.target" ];
          After = [ "graphical-session-pre.target" ];
        };
        Service = {
          ExecStart = "${cfg.package}/bin/limbo";
          Restart = "always";
        };
        Install = { WantedBy = [ "graphical-session.target" ]; };
      };
    };
}
