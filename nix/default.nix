{ lib, buildNpmPackage, writeShellScriptBin, writeText, bun, ags
, defaultConfig ? {
  modules = {
    left = [ "app-launcher" "notifications" "todo" "music" ];
    center = [ "workspaces" ];
    right = [ "sysmon" "quick-settings" "clock" ];
  };
}, ... }:

let
  build = buildNpmPackage {
    name = "limbo";
    src = lib.cleanSource ../.;

    npmDepsHash = "sha256-/EWB1LeOeGB4+BtJFMkyiGdezgwQ0Gmm08uBcqbv8z0=";
    nativeBuildInputs = [ bun ];

    buildPhase = let
      # for providing default config
      settingsFile =
        writeText "system-config.json" (builtins.toJSON defaultConfig);
      # to make sure a file exists there (it's gitignored)
      userConfigFile = writeText "uesr-config.js" "export default {}";
    in ''
      ln -sf ${ags}/share/com.github.Aylur.ags/types ./types
      ln -sf ${settingsFile} ./system-config.json
      ln -sf ${userConfigFile} ./user-config.js

      bun run build
    '';

    installPhase = ''
      mkdir -p $out/opt

      ln -s $src/icons $out/opt/icons
      cp build/main.js $out/opt
    '';

  };
in writeShellScriptBin "limbo" ''
  ags --config ${build}/opt/main.js
''
