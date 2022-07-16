import useLocalState from "./state";

import Urbit from "@urbit/http-api";
// api.verbose = true;
// @ts-ignore TODO window typings
// window.airlock = airlock;

export function bootstrapApi(): Urbit {
  const airlock = new Urbit("http://localhost");
  airlock.ship = (window as any).ship;
  airlock.desk = "trill";
  airlock.verbose = true;
  airlock.onError = (e) => {
    (async () => {
      const { reconnect } = useLocalState.getState();
      try {
        await reconnect();
      } catch (e) {
        console.log(e);
        console.log("onError");
      }
    })();
  };
  airlock.onRetry = () => {
    useLocalState.setState({ subscription: "reconnecting" });
  };

  airlock.onOpen = () => {
    useLocalState.setState({ subscription: "connected" });
  };
  return airlock
}

// export async function sendChat(message: string, channel: string){
//   const {airlock} =  useLocalState.getState()
//   const r = {ship: "~zod", name: channel}
//   const pokeobj = buildChatPost(airlock.ship || "zod", r, message)
//   console.log(pokeobj, "pokeobj")
//   const res = await airlock.poke(pokeobj);
//   console.log(res, "poked")
//   return res
// }