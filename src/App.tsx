import { useMachine } from "@xstate/react";
import { ytUrlMachine } from "./yt-url-machine";
import React from "react";
import { Button, Form, Input, Label, TextField } from "react-aria-components";

declare global {
  interface Window {
    player: YT.Player;
    onYouTubeIframeAPIReady: () => void;
  }
}

function App() {
  const [state, send, actor] = useMachine(ytUrlMachine);

  function onPlayerReady(event: YT.PlayerEvent) {
    send({ type: "ready" });
  }
  function onPlayerStateChange(event: YT.OnStateChangeEvent) {
    const nameMap = {
      [YT.PlayerState.BUFFERING]: "Buffering",
      [YT.PlayerState.CUED]: "Cued",
      [YT.PlayerState.UNSTARTED]: "Unstarted",
      [YT.PlayerState.PLAYING]: "Playing",
      [YT.PlayerState.PAUSED]: "Paused",
      [YT.PlayerState.ENDED]: "Ended",
    };
    if (event.data === YT.PlayerState.PLAYING) {
      send({
        type: "video loaded",
        payload: { duration: window.player.getDuration() },
      });
    }
  }
  function onPlayerError(event: YT.OnErrorEvent) {}

  window.onYouTubeIframeAPIReady = function () {
    window.player = new YT.Player("player", {
      videoId: "",
      playerVars: {
        autoplay: 0,
        mute: 0,
        playsinline: 1,
        modestbranding: 1,
        controls: 1,
        origin: "https://localhost:5173/",
        rel: 0,
        fs: 0,
        enablejsapi: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send({
      type: "got ytid",
      payload: {
        ytid: event.currentTarget.theinput.value,
      },
    });
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    send({
      type: "got ytid",
      payload: {
        ytid: event.clipboardData.getData("text"),
      },
    });
  }

  React.useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = "yt-iframe-api";
    document.body.appendChild(tag);

    return () => {
      document.body.removeChild(tag);
    };
  }, []);

  return (
    <main className="h-full min-h-screen w-full min-w-full bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
      <div className="mx-auto mt-0 grid max-w-3xl grid-cols-1 grid-rows-[2fr_1fr]">
        <div id="player" className="aspect-video h-[60vh] w-full"></div>

        <div className="flex flex-col gap-4 p-4">
          {state.matches("Ready") && (
            <div className="flex flex-col items-start gap-4">
              <Form onSubmit={handleSubmit}>
                <TextField
                  className="flex flex-col items-baseline gap-1"
                  name="theinput"
                >
                  <Label className="text-sm">Url or Id</Label>
                  <Input
                    className="rounded-sm border-2 border-slate-300 bg-slate-100 px-2 outline-none focus-visible:ring-1 focus-visible:ring-slate-300 dark:border-slate-600 dark:bg-slate-600 dark:text-slate-200"
                    onPaste={handlePaste}
                  />
                </TextField>
              </Form>
              <div className="flex gap-2">
                <Button
                  className="rounded-sm  border-2 border-slate-300 px-2 py-0 outline-none focus-visible:ring-1 focus-visible:ring-slate-300 pressed:bg-slate-600"
                  onPress={() => {
                    send({
                      type: "set startTime",
                      payload: { startTime: window.player.getCurrentTime() },
                    });
                  }}
                >
                  start time
                </Button>
                <Button
                  className="rounded-sm  border-2 border-slate-300 px-2 py-0 outline-none focus-visible:ring-1 focus-visible:ring-slate-300 pressed:bg-slate-600"
                  onPress={() =>
                    send({
                      type: "set endTime",
                      payload: { endTime: window.player.getCurrentTime() },
                    })
                  }
                >
                  end time
                </Button>
              </div>
            </div>
          )}
          {state.matches("Ready.Show url") &&
            !state.matches("Ready.Show url.Show error") && (
              <h2>{state.context.generatedUrl}</h2>
            )}
          {state.matches("Ready.Show url.Show error") && (
            <h2 className="text-red-600">{state.context.error}</h2>
          )}
          {state.matches("Ready.Show url") && (
            <Button
              className={`w-fit rounded-sm border-2 border-slate-300 px-2 py-0 outline-none focus-visible:ring-1 focus-visible:ring-slate-300 pressed:bg-slate-600 ${state.matches("Ready.Show url.Error copying") ? "bg-red-600" : state.matches("Ready.Show url.Success copying") ? "bg-green-600" : ""}`}
              onPress={() => {
                send({ type: "copy url" });
              }}
            >
              Copy url
            </Button>
          )}

          {/* <pre>{JSON.stringify(state.context, null, 2)}</pre> */}
        </div>
      </div>
    </main>
  );
}

export default App;
