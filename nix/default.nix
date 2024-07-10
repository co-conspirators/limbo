{ lib
, stdenv
, buildNpmPackage
, makeWrapper
, wrapGAppsHook
, writeText
, bun
, ags
, mako
, procps
, unixtools
, wlinhibit
, gjs
, gtk3
, libpulseaudio
, upower
, gnome
, gtk-layer-shell
, glib-networking
, networkmanager
, libdbusmenu-gtk3
, gvfs
, libsoup_3
, libnotify
, pam
, gobject-introspection
, ...
}:

let
  npmPackage = buildNpmPackage {
    name = "limbo";
    src = lib.cleanSource ../.;

    npmDepsHash = "sha256-+/AMi+bL1pLFs0onocvtaUkI5FHHuN+c6tBBdzfSt74=";
    nativeBuildInputs = [ bun ];

    buildPhase = let
      # to make sure a file exists there (it's gitignored)
      userConfigFile = writeText "user-config.js" "export default {}";
    in ''
      ln -sf ${ags}/share/com.github.Aylur.ags/types ./types
      ln -sf ${userConfigFile} ./user-config.js

      bun run build
    '';

    installPhase = ''
      mkdir -p $out/opt

      ln -s $src/icons $out/opt/icons
      cp build/main.js $out/opt
    '';

  };
in stdenv.mkDerivation {
  name = "limbo";

  buildInputs = [
    ags
    gjs
    gtk3
    libpulseaudio
    upower
    gnome.gnome-bluetooth
    gtk-layer-shell
    glib-networking
    networkmanager
    libdbusmenu-gtk3
    gvfs
    libsoup_3
    libnotify
    pam
  ];
  nativeBuildInputs = [ makeWrapper wrapGAppsHook gobject-introspection ];

  dontUnpack = true;
  dontBuild = true;

  binPaths = lib.makeBinPath [ mako procps unixtools.top wlinhibit ];

  installPhase = ''
    mkdir -p $out/bin
    makeWrapper ${ags}/bin/ags $out/bin/limbo \
      --prefix PATH : "$binPaths" \
      --add-flags "--config ${npmPackage}/opt/main.js"
  '';

  meta = {
    homepage = "https://github.com/co-conspirators/limbo";
    description = "Limbo - A custom GTK shell using AGS";
    mainProgram = "limbo";
    license = lib.licenses.gpl3Plus;
    maintainers = with lib.maintainers; [ redxtech ];
    platforms = lib.platforms.linux;
  };
}
