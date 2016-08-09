import { bootstrap } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { AppComponent, environment } from "./app/";
import {LoggerService} from "./app/shared/";
import { TaskStore, EditorStateStore } from "./app/store";

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  LoggerService,
  TaskStore,
  EditorStateStore
  ]);
