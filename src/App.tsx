import { useMachine } from "@xstate/react";
import { ytUrlMachine } from "./yt-url-machine";
import React from "react";
declare global {
  interface Window {
    player: YT.Player;
    onYouTubeIframeAPIReady: () => void;
    theinput: HTMLInputElement;
  }
}

function App() {
  const [state, send, actor] = useMachine(ytUrlMachine);

  function onPlayerReady(event: YT.PlayerEvent) {
    console.log("player ready");
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
    console.log("statechange", nameMap[event.data]);
    if (
      event.data === YT.PlayerState.PLAYING ||
      event.data === YT.PlayerState.BUFFERING
    ) {
      send({ type: "video loaded" });
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
    console.log("pasted");
    console.log(event.clipboardData.getData("text"));
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
    <>
      <div id="player"></div>
      {state.matches("Ready.Show url") && <h2>{state.context.generatedUrl}</h2>}
      {state.matches("Ready.Show url") && (
        <button
          style={{
            backgroundColor: state.matches("Ready.Show url.Idle")
              ? "white"
              : state.matches("Ready.Show url.Error copying")
              ? "red"
              : state.matches("Ready.Show url.Success copying")
              ? "green"
              : "yellow",
          }}
          onClick={() => {
            send({ type: "copy url" });
          }}
        >
          Copy url
        </button>
      )}
      {state.matches("Ready") && (
        <div>
          <form onSubmit={handleSubmit}>
            <input type="text" name="theinput" onPaste={handlePaste} />
          </form>
          <button
            onClick={() => {
              send({ type: "set startTime" });
            }}
          >
            start time
          </button>
          <button onClick={() => send({ type: "set endTime" })}>
            end time
          </button>
        </div>
      )}
    </>
  );
}

export default App;
