// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "assign ytid" | "calculate url" | "check input" | "loadVideoById";
    delays: never;
    guards: "has ytid";
    services: never;
  };
  eventsCausingActions: {
    "assign ytid": "got ytid";
    "calculate url": "video loaded";
    "check input": "ready";
    "check url": "xstate.init";
    "create and store yt player": "";
    "create iframe tag": "";
    loadVideoById: "" | "got ytid";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "has ytid": "";
    "iframe tag exists": "";
  };
  eventsCausingServices: {};
  matchesStates:
    | "Load YT Player"
    | "Load YT Player.Check Iframe Tag"
    | "Load YT Player.Setup onYoutubeIframAPIReady"
    | "Ready"
    | "Ready.Check for ytid"
    | "Ready.Load video"
    | "Ready.Show url"
    | "Ready.Wait for input"
    | {
        "Load YT Player"?: "Check Iframe Tag" | "Setup onYoutubeIframAPIReady";
        Ready?: "Check for ytid" | "Load video" | "Show url" | "Wait for input";
      };
  tags: never;
}
