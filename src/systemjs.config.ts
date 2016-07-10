declare var System: any;
(function(global) {
  // map tells the System loader where to look for things
  let map = {
    "src":                        "", // 'dist',
    "rxjs":                       "lib/rxjs",
    "angular2-in-memory-web-api": "lib/angular2-in-memory-web-api",
    "@angular":                   "lib/@angular"
  };
  // packages tells the System loader how to load when no filename and/or no extension
  let packages = {
    "src":                        { main: "wvtm.js",  defaultExtension: "js" },
    "rxjs":                       { defaultExtension: "js" },
    "angular2-in-memory-web-api": { defaultExtension: "js" },
  };
  let packageNames = [
    "@angular/common",
    "@angular/compiler",
    "@angular/core",
    // '@angular/http',
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    // '@angular/router',
    // '@angular/router-deprecated',
    "@angular/testing",
    "@angular/upgrade",
  ];
  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: "index.js", defaultExtension: "js" };
  });
  let config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);
