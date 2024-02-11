import { createMachine, assign } from "xstate";
import { getYtIdFromUrl } from "./get-yt-id-from-url";

export const ytUrlMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QE0AqACAqgJQDLoFsBDAazACcA6XAeyInTXQAUAbIgTwoGJyx6OAbQAMAXUSgADjVgBLAC6yaAOwkgAHogDMwgEyUAnLoCsADgBsxncOMBGACwAaEB0QBac5Xvmtu+6ZtdA2C-UwBfMOcmHHxiMipsfggObigaeXQORQgRcSQQaTlFFTVNBFstLQNDe1tdPQB2A3NbU2dXBDcDBsoTSr1bMwNTXVGIqIwYwlIKSkSBSgBhAAswAGMSdAAzGnJM7O5ctUKFJVV8stsKzytfVoNjYIbdc3bEI0pnhpbhX3tjYSmAzjEDRPDTeJzJIcJarDbbXb7WQQQ62PJSGSnEoXRBXLTGSimYz2LT2BqmQbdNouXENYSfOz-YJElrmckgsGxGYJaHUOgMABuyLANG4QogIvQrH5kCO+ROxXOoEuvi0nz8JiaWlswnMuje5QMtkoNgaDjJuvqtnMHMm4Lis3myUoAGVljQAO7oACu5FY3FgYAysHkRHI8lQsgIYDlGKKZ1KiAB9K+wwCDS0ZteNIQpP0gIpxlGxJaRfstqw9u5UIWbs9Pr9AaD6BDYYjUZjaOOmMViYQzXz1uaxjZwjJDWMBpJBOMdO6xisur1-wrUwdPNr7q9vv9gYyYGUEEj0djBR7CZxCCL9KCgN0dTZZgnBrNPTHRZMwjqRnM5cioLtLlISdGE623Rs93QA8jw7QQu3lc9sWVRBTCBQkzCLVpKVsBoXwsGpMMGBpvgnP8JkrIDHV5MCG1YSgAEkIFYMBuDWGhJA4WjTwVC9kPKMk1QqEwXnsfw-EnHNzC-ShH1COwDF1CxVyrYDqK3WjKAAUXIchETYjjZGUKBuHUVt5DASgiC2czyAACh1YRhAASm4TkISozd6x3LSdL09iOEMqBuMQpUNFxTM1RJI07CuPR7wNW5KC0AJfwBMkrjNZTKI3Z0aO8l1vTWNY4FgdB9ICoyTLMiyrJs+zHOc1zAPcnLQPU-LCuK2BSvKwLgvjJCwvKKpqmnXQRgBM1UIkjozQJIEixHAx7F1WwjCylqa1y9q-SWfzAto7gIBUCzDIFGgyEoNz1y2tqvN2xZ9qM2iEDOmg1iIRVcn6rFQsucxzGqbpR0eep6nMalZsGQkHhMQGVpadb-2u6sQNdHa6Megznp3bgKF0qhJHYeQdnIAgruam60byh6nqgF63o+r6xB+3tL2tQHDBImwjD0RSEu8ShHlnbUEdEpHyLXVG1PuuiaPx3YqtDczLOsih7OTFyUdUzzwLl9SFfIVneKGuphGqX8dCNYi1r1fUc0eUwTRJHDTD+TNZwif9lBoCV4HybWKG7Aa-txVCZICMxb1aYkZvcXQzRho0gjZLC-C0DabtoehGAwNhOCDhCQ77XQtE8CGbBGBSY-+A03DqJ2AZLHRfAsFlM+lgRg9+vt-n0VNUOEDMszr1p7CF7571di1rQ7nXnRWdZNlJpEIG7tm+KNIGRxLMS0twnM3Hsao6WtPQ27WoFbDnjznWzwVhRodeTZVc2TSucTvGaXUnEknoSQnACCGosLDX2RpTTuzoADqRAFAIj2IZSQ3p5DP0GmUZoPQE6AgMKLckdgD4dGtE7DmE1xIUm8DacBFFNrUwxqg0OCBTC1HQkSe8hZrYGh0MaWoFgPz+GeGlG+rV0aywYkxMA9C+wVHwqSHBgQySpwNFJY0lRRwNGPviSwwIqFS3nndPWPkCZlTppI9mAlCSZnUbDGwvgpzLRYQ8UwzwqjkhsEI26IiDEFSKiVYx2MoCmL4g4MchIxzeH+JHUWL4Jy9FTMRBczQAbuNoaIrGFV6Y7kCabHwPQfAjD8AJIIBDEBSRuA8DMwTfzH10MkmWXiDa+XIFky4NgCTqPGubY+3xajFIQC0J2OC7B6DZBDFa4QvZAA */
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
  }
);
