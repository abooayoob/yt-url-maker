// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.YT URL maker.Ready.Show url.Copying url:invocation[0]": {
      type: "done.invoke.YT URL maker.Ready.Show url.Copying url:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.YT URL maker.Ready.Show url.Copying url:invocation[0]": {
      type: "error.platform.YT URL maker.Ready.Show url.Copying url:invocation[0]";
      data: unknown;
    };
    "xstate.after(1000)#YT URL maker.Ready.Show url.Error copying": {
      type: "xstate.after(1000)#YT URL maker.Ready.Show url.Error copying";
    };
    "xstate.after(1000)#YT URL maker.Ready.Show url.Success copying": {
      type: "xstate.after(1000)#YT URL maker.Ready.Show url.Success copying";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "copy url": "done.invoke.YT URL maker.Ready.Show url.Copying url:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    "assign endTime": "set endTime";
    "assign startTime": "set startTime";
    "assign ytid": "got ytid";
    "calculate url": "set endTime" | "set startTime" | "video loaded";
    "check url": "ready";
    loadVideoById: "" | "got ytid";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "has ytid": "";
  };
  eventsCausingServices: {
    "copy url": "copy url";
  };
  matchesStates:
    | "Load YT Player"
    | "Ready"
    | "Ready.Check for ytid"
    | "Ready.Load video"
    | "Ready.Show url"
    | "Ready.Show url.Copying url"
    | "Ready.Show url.Error copying"
    | "Ready.Show url.Idle"
    | "Ready.Show url.Success copying"
    | "Ready.Wait for input"
    | {
        Ready?:
          | "Check for ytid"
          | "Load video"
          | "Show url"
          | "Wait for input"
          | {
              "Show url"?:
                | "Copying url"
                | "Error copying"
                | "Idle"
                | "Success copying";
            };
      };
  tags: never;
}
