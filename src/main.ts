import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// if (environment.production) {
//   enableProdMode();
// }


platformBrowserDynamic().bootstrapModule(AppModule);
// import { bootstrap } from "@angular/platform-browser-dynamic";
// import { enableProdMode } from "@angular/core";
// import { AppComponent, environment } from "./app";
// import {LoggerService} from "./app/shared";
// import { NgRedux } from 'ng2-redux';


// bootstrap(AppComponent, [
//   LoggerService,
//   NgRedux
// ]);
