import { createMachine, assign } from "xstate";
import { getYtIdFromUrl } from "./get-yt-id-from-url";

export const ytUrlMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QE0AqACAqgJQDLoFsBDAazACcA6XAeyInTXQAUAbIgTwoGJyx6OAbQAMAXUSgADjVgBLAC6yaAOwkgAHogDMwgEyUAnLoCsADgBsxncOMBGACwAaEB0QBac5Xvmtu+6ZtdA2C-UwBfMOcmHHxiMipsfggObigaeXQORQgRcSQQaTlFFTVNBFstLQNDe1tdPQB2A3NbU2dXBDcDBsoTSr1bMwNTXVGIqIwYwlIKSkSBSgBhAAswAGMSdAAzGnJM7O5ctUKFJVV8stsKzytfVoNjYIbdc3bEI0pnhpbhX3tjYSmAzjEDRPDTeJzJIcJarDbbXb7WQQQ62PJSGSnEoXRBXLTGSimYz2LT2BqmQbdNouXENYSfOz-YJElrmckgsGxGYJaHUOgMABuyLANG4QogIvQrH5kCO+ROxXOoEuvk8pgpWjqJnM5gMdTe5VM9k+ugqAMpdiJxg5k3BcVm82SlAAyssaAB3dAAV3IrG4sDAGVg8iI5HkqFkBDAcoxRTOpUQAPpX2GAQaWgatleNIQpP0gIpxlGxJaRfsNqwdu5UIWro93t9-sD6GDofDkejaOOmMVCYQzXzWeaxjZwjJDWMBpJBOMdO6xiswh1fmtkVBtq5kMdMLrnp9foDGTAyggEajMYKPfjOIQRfpQUBppeE9ME4NmZ6Y6LJmEdSM5nLNdOQhB1eV3BsD2bY9Tw7QQu3lK9sWVRB1WqIkiVNQs9Qad8LBqIsrlnb4J0AiZK03UDazdPdfUoABJCBWDAbg1hoSQOAgi8FWvZDyjJLRKAqEwXnsfwVwNcxf0oNkyyJWwDCXCwKyme0eSo+t90oABRchyERVj2NkZQoG4dRW3kMBKCILYLPIAAKWxhCcgBKbhgNUmsnXAzSdL0vYDI4IyoC4xClQ0XEMwEkk9TsK49FNA1bkoLQAgAgEySuTNlKrLcwOoiCXS9NY1jgWB0ACoLTPMyzrNshynOEVz3OrbcXXyzTnSKkrYDKirjJCuMkPC8oqmqaddBGAFM3VScc0zAkgSLEcDHsJd5N0bKKLUrz2toxY2MC4yIO4CAVEsoyBRoMhKGa3L1Jo1glgOoKIIQC6aDWIhFVyAasTCy4dWqbpR0eep6nMakOnmwkHm1Fa1qMTaQO2nddse-bDKO-duAoPzKEkdh5B2cgCBujdkc81GNL256sd9N7lEuz7vrEX7exvLNdUMYibCMPRFMS7xKEeWdNVWgD7ERoDyY81rvNo8Dcd2KqQwsqybIoBykyamWWry6nHsV3TdjZnjhrqYRqgAnRsMzAddES4ZKDHTVyT+DNZwiNdlBoCV4HyW6KG7Qb-txdVpICMwH1aYlZo6NxdEzGG9SCQZJMc4FpfIinaHoRgMDYTgg4QkO+10LRPAhmwRgUmP-gNNw6lMaTLG8HRfAsFkkdl6Fg7+vt-n0FN1WEdNM2zePWmNWdzFNEdZ0lywtG7vWFhWdZNmJpEID79neL1IH5+8MT0pwnM3Elz5f0kiaIfkoFbBXu6nVzwVhRoXezZVS3nauFdvGaEuJwOY2ReA9gCCGYsLCPyzipVeToADqRAFAIj2EZSQXp5CfyGmUZoPRE6AgMGLckdgz4dCzM3Tmk0VwUm8OYJ+lEdoG2waHBARpbCEjMARLCtgyHaCkrUCwJg7yzxMAwlGbUDb0UYmAFhfYKh4VJEQwIZI2S2AklJSoo4GiS3xJYTOZE4HPypg9bSxt-K0ygHIjm-FCQZh0bDGwvgpwrU4YtV85cqQ2HEZTSRpjOrFVKuVSx1jeIODHISMcx8zBOIcO+CcvQUwNAnI8HU9DYE5UYSYgqGNDpQAgqE82Pgeg+BGH4fiQQ+EIEkjcB46ZwkSyloYzJEj5aG3ykrcghTLg2AJDoialtJbfFqFUlozciF2D0GyCGq1wheyAA */
    id: "YT URL maker",
    initial: "Load YT Player",
    context: {
      ytid: null,
      startTime: null,
      endTime: null,
      generatedUrl: null,
      error: null,
      duration: null,
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
            internal: false,
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
              "video loaded": {
                target: "Show url",
                actions: "assign duration",
              },
            },
          },

          "Wait for input": {},
          "Show url": {
            entry: "calculate url",

            on: {
              "set startTime": [
                {
                  target: "Show url",
                  actions: ["assign startTime"],
                  cond: "before endTime",
                },
                {
                  target: ".Show error",
                  actions: "assign error",
                },
              ],

              "set endTime": [
                {
                  target: "Show url",
                  actions: ["assign endTime"],
                  cond: "after startTime",
                },
                {
                  target: ".Show error",
                  actions: "assign error",
                },
              ],
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

              "Show error": {
                after: {
                  "1500": {
                    target: "Idle",
                    actions: "reset error",
                  },
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
        | { type: "video loaded"; payload: { duration: number } }
        | {
            type: "set startTime";
            payload: {
              startTime: number;
            };
          }
        | {
            type: "set endTime";
            payload: {
              endTime: number;
            };
          }
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
        error: string | null;
        duration: number | null;
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
      "assign duration": assign((context, event) => {
        return {
          duration: event.payload.duration,
        };
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
        return {
          startTime: event.payload.startTime,
        };
      }),
      "assign endTime": assign((context, event) => {
        return {
          endTime: event.payload.endTime,
        };
      }),
      "assign error": assign((context, event) => {
        switch (event.type) {
          case "set startTime":
            return {
              error: "Start time must be before end time",
            };
          case "set endTime":
            return {
              error: "End time must be after start time",
            };
          default:
            return {
              error: "Unknown error",
            };
        }
      }),
      "reset error": assign((context, event) => {
        return {
          error: null,
        };
      }),
    },
    guards: {
      "has ytid": (context, event) => {
        return context.ytid !== null;
      },
      "before endTime": (context, event) => {
        return (
          context.endTime === null || event.payload.startTime < context.endTime
        );
      },
      "after startTime": (context, event) => {
        return (
          context.startTime === null ||
          event.payload.endTime > context.startTime
        );
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
  },
);
