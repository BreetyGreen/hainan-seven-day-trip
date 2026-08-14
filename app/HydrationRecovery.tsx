"use client";

import { useEffect } from "react";

const recoveryKey = "hainan-trip-hydration-retry";

export const hydrationRecoveryScript = `
(function () {
  var key = "${recoveryKey}";
  window.setTimeout(function () {
    if (document.documentElement.dataset.tripHydrated === "1") {
      sessionStorage.removeItem(key);
      return;
    }

    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, String(Date.now()));
      var freshUrl = new URL(window.location.href);
      freshUrl.searchParams.set("_reconnect", String(Date.now()));
      window.location.replace(freshUrl.toString());
      return;
    }

    var status = document.querySelector(".map-status");
    if (!status) return;
    status.innerHTML = "";
    var title = document.createElement("strong");
    title.textContent = "页面资源没有完整接通";
    var action = document.createElement("button");
    action.type = "button";
    action.textContent = "重新连接";
    action.addEventListener("click", function () {
      sessionStorage.removeItem(key);
      var retryUrl = new URL(window.location.href);
      retryUrl.searchParams.set("_reconnect", String(Date.now()));
      window.location.replace(retryUrl.toString());
    });
    status.append(title, action);
  }, 10000);
})();`;

export function HydrationRecovery() {
  useEffect(() => {
    document.documentElement.dataset.tripHydrated = "1";
    sessionStorage.removeItem(recoveryKey);
    return () => { delete document.documentElement.dataset.tripHydrated; };
  }, []);

  return null;
}
