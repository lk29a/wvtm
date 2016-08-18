"use strict";

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  '@ng-bootstrap': 'vendor/@ng-bootstrap/ng-bootstrap/bundles',
  'ng2-bs3-modal': 'vendor/ng2-bs3-modal',
  'immutable': 'vendor/immutable/dist/immutable.js',
  'redux': 'vendor/redux/dist/redux.js',
  'ng2-redux': 'vendor/ng2-redux/lib',
  'redux-thunk': 'vendor/redux-thunk/dist/redux-thunk.js',
  'redux-logger': 'vendor/redux-logger/dist/index.js'
};

/** User packages configuration. */
const packages: any = {
  'immutable': {
    'format': 'cjs'
  },
  '@ng-bootstrap': {
    format: 'cjs',
    defaultExtension: 'js',
    main: 'ng-bootstrap.js'
  },
  'ng2-bs3-modal': {
    defaultExtension: 'js',
    main: 'ng2-bs3-modal.js'
  },
  'redux': {
    'format': 'cjs'
  },
  'ng2-redux': {
    'format': 'cjs',
    defaultExtension: 'js',
    main: 'index'
  },
  'redux-thunk': {
    'format': 'cjs',
    // defaultExtension: 'js',
    // main: 'index'
  },
  'redux-logger': {
    'format': 'cjs',
    // defaultExtension: 'js',
    // main: 'index'
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/store',
  'app/store/taskmodel',
  'app/store/editor',
  'app/shared',
  'app/tree',
  'app/taskmodel',
  'app/simulator',
  'app/store',
  'app/menu',
  'app/toolbar',
  'app/infobar',
  'app/editor',
  'app/editor/shared',
  'app/editor/renderer',
  'app/editor/task-tree',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
