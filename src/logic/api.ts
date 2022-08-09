import useLocalState from "./state";
import Urbit from "@urbit/http-api";

// export const URL = "";
export const URL = "http://localhost";

export function bootstrapApi(): Urbit {
  const airlock = new Urbit(URL);
  airlock.ship = (window as any).ship;
  airlock.desk = "trill";
  // airlock.verbose = true;
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