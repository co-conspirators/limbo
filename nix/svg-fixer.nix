{ buildNpmPackage, fetchFromGitHub, ... }:

buildNpmPackage rec {
  pname = "svg-fixer";
  version = "4.0.1";

  src = fetchFromGitHub {
    owner = "oslllo";
    repo = pname;
    rev = "v${version}";
    hash = "sha256-DOhKVBYjnnQix0w+7Lwt/rhwofBemzUNh9z6IW5uuco=";
  };

  npmDepsHash = "sha256-dGOIYwlLqps4pp51FD0ZDbNDgEaeOLrfeV7rc+sSlrI=";

  # The prepack script runs the build script, which we'd rather do in the build phase.
  # npmPackFlags = [ "--ignore-scripts" ];
  dontNpmBuild = true;

  # installPhase = "\n";

  NODE_OPTIONS = "--openssl-legacy-provider";
}

