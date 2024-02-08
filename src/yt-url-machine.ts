import { createMachine, assign } from "xstate";
import { getYtIdFromUrl } from "./get-yt-id-from-url";

export const ytUrlMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QE0AqACAqgJQDLoFsBDAazACcA6XAeyInTXQAUAbIgTwoGJyx6OAbQAMAXUSgADjVgBLAC6yaAOwkgAHogDsAZh2UATADYAjEYCcwgBxWtBnQBYArABoQHRAFoTwh4eE6JuYOVk4OOkZOTuYAvjFuTDj4xGRU2PwQHNxQNPLoHIoQIuJIINJyiipqmggmeuaUwSYGwgZa5qZWbh4InuZahk56rSZOVuZWBlNxCRhJhKQUlOkClADCABZgAMYk6ABmNOT5hdzFauUKSqqlNSZ1RpRDOgYm49H9xt2I5gaUdlpTAEDM5rLF4iBEngFqllhkOOstrsDkcTrIIGcTCUpDIrlVboh7jonJRQuEHForKN+l13IStMJ-k4TM5zBMnKYjJSZpC5tCUksVplqHQGAA3dFgGjcCUQKXoViiyDnUqXSo3UB3F76OwOAxOdqBYRGAzfWrmEyUYQGlkU40tMw8qHJRZpeGUADKGxoAHd0ABXcisbiwMB5WDyIjkeSoWQEMAqnEVa7VQm+AYc4lNHRUhzhM0GUJPPO-Cw6SwtIxOvku2FChFe30BoMhsPoMDKCCx+OJsq49Wp2rWxlgowOaxOYS-CJmkKW3TWk0gqwOIyhatYfmuuGrRt+wOsSgASQgrDA3G2NEkHGbrF7apTBNq4Utw7GHIpox0Zqify0WiCKwjQcX4TC0Dd5gFN1d29fcg0oABRchyFRS9r1kZQoG4dQIyIeQwEoIh9nw8gAAofGEYQAEpuGdGFBXdPdb0Q5DUKvDgMKge9+0fTVCT0S1iTsHwdCnZpzFnFdKApXR2iMF5+mEEwIK3OtGNg5iPX9bZtjgWB0DQjjMOw3D8MI4iKHIyjqNomt6Og4UmIPT1tN02B9MMzjuOTfE+NqATKCE14AjEgwJLpBAx0ZBwwIdV46icAwVNrBiYKbZy1nYzjb24CAVAIjCxRoMhKDoqCd0cjSMqyzDbwQQqaG2PDrmKby8Q1DRCRNAZxgpSJ7gtFktDNIxRsaC02VGYwKWmCEyu3etPSq+DMvQ2qD24CgUKoSR2HkQ5yAIUq7PKxanJWmqoDqhqmvVVqxAuHjfM62putJYJAWZIJ7gpWd+koCwQUiNl7Faew4ghZQaDleBSnm1JHp8jqamZfQzCiaIp3sLRXAizw2ktcZBq0CkjT0ZL7JFehGAwNhOAoRH2sHDlLXRqJLGnHGzW8XxGmZGwpn1YIOicCnTvhRmByfWxLXMDkwjHSZJ1+vG3j8A1TDZSwfGiRwxYW91Nh2PYDrRCBJd4l6Jr5yJVxCfV025kD-iUoxWisNdAItfW1NWWhqdlKULeerUpyte4QQVjpjQcEaBnCHHJzXQIQlMH3UuFAB1IgFBRY4MMkf15GD5Gfi5QwGXGFPKWZYaIrMKxKDMNd9Uj3NRvThyG2W1gS8HZogMCg1gtEi0wrNQJCamUJoimmlRbmk6DbSuDDxPM8+6fOo80MLkIjzVcDXCnpf2kvQ8xadoYvGTuKu79L4KQ7aDMuze-JZQImTGawAOCWOIrzCSOWHJzDDAmIEW+Z0e4uR0npF+a0oBvxeg8P8UxEo6H-MEcs-8eh2EeBEOW2pr5BAXrMTcKUu5LQfoeVaRkroHiQXcaIJIogmiAlyKY1ofwGgBr8Q+INRKzTiEAA */
    id: "YT URL maker",
    initial: "Load YT Player",
    context: {
      ytid: null,
      startTime: null,
      endTime: null,
      generatedUrl: null,
    },
    states: {
      "Load YT Player": {
        on: {
          ready: "Ready",
        },
      },

      Ready: {
        on: {
          "got ytid": {
            target: ".Load video",
            actions: "assign ytid",
          },
        },

        states: {
          "Check for ytid": {
            entry: ["check url"],

            always: [
              {
                target: "Load video",
                cond: "has ytid",
              },
              "Wait for input",
            ],
          },

          "Load video": {
            entry: "loadVideoById",

            on: {
              "video loaded": "Show url",
            },
          },

          "Wait for input": {},
          "Show url": {
            entry: "calculate url",

            on: {
              "set startTime": {
                target: "Show url",
                actions: "assign startTime",
              },

              "set endTime": {
                target: "Show url",
                actions: "assign endTime",
              },
            },

            states: {
              Idle: {
                on: {
                  "copy url": "Copying url",
                },
              },

              "Error copying": {
                after: {
                  "1000": "Idle",
                },
              },

              "Success copying": {
                after: {
                  "1000": "Idle",
                },
              },

              "Copying url": {
                invoke: {
                  src: "copy url",
                  onDone: "Success copying",
                  onError: "Error copying",
                },
              },
            },

            initial: "Idle",
          },
        },

        initial: "Check for ytid",
      },
    },
    schema: {
      events: {} as
        | { type: "tag created" }
        | { type: "ready" }
        | { type: "video loaded" }
        | { type: "set startTime" }
        | { type: "set endTime" }
        | { type: "copy url" }
        | {
            type: "got ytid";
            payload: {
              ytid: string;
            };
          },
      context: {} as {
        ytid: string | null;
        startTime: number | null;
        endTime: number | null;
        generatedUrl: string | null;
      },
      services: {} as {
        "copy url": {
          data: void;
        };
      },
    },
    tsTypes: {} as import("./yt-url-machine.typegen").Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      "check url": assign((context, event) => {
        const url = new URL(window.location.href);
        let ytid = url.searchParams.get("ytid");
        url.searchParams.delete("ytid");
        if (ytid && ytid.includes("http")) {
          ytid = getYtIdFromUrl(url.toString());
        }
        return {
          ytid,
        };
      }),
      "assign ytid": assign((context, event) => {
        if (event.payload.ytid.includes("http")) {
          return {
            ytid: getYtIdFromUrl(event.payload.ytid),
          };
        } else {
          return {
            ytid: event.payload.ytid,
          };
        }
      }),
      "calculate url": assign((context, event) => {
        const url = new URL(`https://youtu.be/${context.ytid}`);
        if (context.startTime) {
          url.searchParams.set("start", context.startTime.toString());
        }
        if (context.endTime) {
          url.searchParams.set("end", context.endTime.toString());
        }
        return {
          generatedUrl: url.toString(),
        };
      }),
      loadVideoById: (context, event) => {
        window.player.loadVideoById(context.ytid || "");
      },
      "assign startTime": assign((context, event) => {
        console.log("assigning start time");
        console.log(window.player.getCurrentTime());
        return {
          startTime: window.player.getCurrentTime(),
        };
      }),
      "assign endTime": assign((context, event) => {
        return {
          endTime: window.player.getCurrentTime(),
        };
      }),
    },
    guards: {
      "has ytid": (context, event) => {
        return context.ytid !== null;
      },
    },
    services: {
      "copy url": async (context, event) => {
        if (!context.generatedUrl) {
          throw new Error("No url to copy");
        } else {
          return navigator.clipboard.writeText(context.generatedUrl);
        }
      },
    },

    delays: {},
  }
);
