{ config, options, lib, pkgs, ... }:

let
  inherit (lib) mkIf;

  cfg = config.services.limbo;
  opt = options.services.limbo;

in {
  options.services.limbo = (import ./options.nix { inherit lib pkgs; });

  config = let
    jsonFormat = pkgs.formats.json { };
    isDeclarativeConfig = cfg.settings != opt.settings.default;
    configFile = if isDeclarativeConfig then
      jsonFormat.generate "config.json" cfg.settings
    else
      null;
  in lib.mkIf cfg.enable {
    home.packages = [ cfg.package ];

    xdg.configFile.limboConfig = mkIf (configFile != null) {
      target = "limbo/config.json";
      source = configFile;
    };

    systemd.user.services.limbo = {
      Unit = {
        Description = "Super good bar for wayland build on ags";
        Documentation = "https://github.com/Saghen/limbo";
        PartOf = [ "graphical-session.target" ];
        After = [ "graphical-session-pre.target" ];
        X-Restart-Triggers = mkIf (configFile != null) "${configFile}";
      };
      Service = {
        ExecStart = "${cfg.package}/bin/limbo";
        Restart = "always";
        Environment = "GDK_SCALE=${toString cfg.scaling}";
      };
      Install = { WantedBy = [ "graphical-session.target" ]; };
    };
  };
}
