import { createMachine, raise } from "xstate";

export const ytUrlMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QE0AqACAqgJQDLoFsBDAazACcA6XAeyInTXQAUAbIgTwsoGEALMAGMS6AJIAzckQJh0qIlADEAbQAMAXUSgADjVgBLAC76aAOy0gAHogAsAdlWUAnAGYAbDZdOAjDadunAFZVQIAaEA5EV0pPNwAOJzsgtxS7OwBfdPCmHHxiMipaekYMNk5ufiERCSkZOQUVb00kEF0DYzMLawQAJkCXSh7vVScetzHAtzsXGxtwyIRvJ0cZ1W9A7ztJuMDAnczsjFzCUm4ihiYyrioAZTBDAFdtdDNkGgfHgCMwGukAQWYomwYHoHEU5BBEA4amaOj0RhM5ha3SSTkowRsKXGqlUPR6Nh680QSzilCS4xmLncmNGBxAOTwJwKlGBoMUUBohnQHGMEBhFjaCM6yOJVNJcTiqj8+Jc3hcdjlRIQAFp-JRZVK7PEXD1Ze4Mll6UdGfluKyobwBMJ0OIaORubyVBoBfCOkjQN1vHK3OiqUMEoEnIkxkrRmSelrhjqbMEEnSGXlTlRzRxLVUbXaHfoII1Ya1XYiusS5YFKDtPPY4utEnElZtHFtfIGnDs3N4pnF48bE8yU9Q6AwAG7ZsA0RTDiCj9CsAeQfktQVuouLHUDOz4vpJDXjOs+SghBWzBzY9tdrAmpMsyGpm58GgAd3QD3IrEUsHu6FghiI5EMqH0MjznC7SFiKizePigzuHKriqG2Oy1hEiCyqSOIklWywOFqbhnscprJtelC3g+T4vm+H5gKYED-oBzoLgWwoeqKBJlnYcSeDKcq4t4SpeDYMQSnYBIzG4qhpLqmSGqYNCTvALQJkyFAuiBjFWMSgR2IMwyjOMbiTNMsxKsqEaOMkLiqC4cQ9K4wmBLhF7MucJQsOw1zKUK7pqb0IRaSMYwTFMMxzEhKpeqWHgSl4srBOuPSdoaCn4f2xSXK5FRWtUkjSLI8hQO5S5gfYPpajqgaeHB6wzEZcXqn0ox7O2uxJAahznj2ZwDs5VzcHcjzPK87xfD8WUEACQLXvloFMQgsxossbbyu27jxMFCzeJKMR6VMmxUnKsw4Ql3aKQRoKTap3Q+KWez4thLYaQSRnrQMbhUl4FnmVZSTxa1eGXn2lTWra9o8tmZ2eRdL3olZRUBDsQmEiFyrhfEomSm2MZLDY31Gm1x1XqCyVDiONBg8uXFomsEExjSokeEqUwxPKuxwXEspY229ntSdFoAOpEEYGb2vopjaB8pNgf4mkmQkbNsRsdh1vElDtvEfT4g1mIHT9DlmoRxGPs+rDi9NEEtuiaRpF4TWBDGSoRmicQOOxUyBBGT0HZkQA */
    id: "YT URL maker",
    initial: "Load YT Player",
    context: {
      player: null,
      iframeId: "yt-iframe-api",
      ytid: null,
    },
    states: {
      "Load YT Player": {
        initial: "Check Iframe Tag",

        states: {
          "Check Iframe Tag": {
            always: [
              {
                target: "Setup onYoutubeIframAPIReady",
                cond: "iframe tag exists",
              },
              {
                target: "Setup onYoutubeIframAPIReady",
                actions: ["create iframe tag"],
              },
            ],

            entry: "check url",
          },

          "Setup onYoutubeIframAPIReady": {
            entry: {
              type: "create and store yt player",
            },

            on: {
              ready: "#YT URL maker.Ready",
            },
          },
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
            entry: "check input",

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
                internal: true,
              },

              "set endTime": {
                target: "Show url",
                internal: true,
              },
            },
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
        | { type: "set startTime"; payload: { startTime: number } }
        | { type: "set endTime"; payload: { endTime: number } }
        | {
            type: "got ytid";
            payload: {
              ytid: string;
            };
          },
      context: {} as {
        player: YT.Player | null;
        iframeId: "yt-iframe-api";
        ytid: string | null;
      },
    },
    tsTypes: {} as import("./yt-url-machine.typegen").Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      "check url": (context, event) => {
        const url = new URL(window.location.href);
        const ytid = url.searchParams.get("ytid");
        if (ytid) {
          // maybe if length is noot 11 then throw error
          context.ytid = ytid;
        }
      },
      "create iframe tag": (context, event) => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = context.iframeId;
        document.body.appendChild(tag);
      },
      "create and store yt player": (context, event) => {},
    },
    services: {},
    guards: {
      "iframe tag exists": (context, event) => {
        return document.querySelector(context.iframeId) !== null;
      },
    },
    delays: {},
  }
);
