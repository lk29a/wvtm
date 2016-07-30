declare var System: any;
(function(global) {
  // map tells the System loader where to look for things
  let map = {
    "app": "", // 'dist',
    "rxjs": "lib/rxjs",
    "angular2-in-memory-web-api": "lib/angular2-in-memory-web-api",
    "@angular": "lib/@angular",
    // "app/shared": "app/shared",
    // "app/editor/shared": "app/editor/shared",
    // "app/tree": "app/tree",
    // "app/taskmodel": "app/taskmodel"

  };
  // packages tells the System loader how to load when no filename and/or no extension
  let packages = {
    "app": { main: "wvtm.js", defaultExtension: "js" },
    "rxjs": { defaultExtension: "js" },
    "angular2-in-memory-web-api": { main: "index.js", defaultExtension: "js" },
  };

  let barrelPackages = [
    "app/shared",
    "app/editor/shared",
    "app/tree",
    "app/taskmodel"
  ];

    // add barrel package entries for app packages in the form 'barrel/package': { main: 'index.js', defaultExtension: 'js' }
  // barrelPackages.forEach(function(pkgName) {
  //   packages[pkgName] = { main: "index.js", defaultExtension: "js" };
  // });

  let ngPackageNames = [
    "common",
    "compiler",
    "core",
    "forms",
    "http",
    "platform-browser",
    "platform-browser-dynamic",
    "router",
    "router-deprecated",
    "upgrade",
  ];


  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages["@angular/" + pkgName] = { main: "index.js", defaultExtension: "js" };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages["@angular/" + pkgName] = { main: "/bundles/" + pkgName + ".umd.js", defaultExtension: "js" };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  let setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);


  let config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
