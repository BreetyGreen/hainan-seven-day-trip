"use client";

import { useEffect } from "react";

export const hydrationRecoveryScript = `
(function () {
  window.setTimeout(function () {
    if (document.documentElement.dataset.tripHydrated === "1") return;

    var status = document.querySelector(".map-status");
    if (!status) return;
    status.innerHTML = "";
    var title = document.createElement("strong");
    title.textContent = "页面仍在加载，请再等一会儿";
    var action = document.createElement("button");
    action.type = "button";
    action.textContent = "重新连接";
    action.addEventListener("click", function () {
      window.location.reload();
    });
    status.append(title, action);
  }, 20000);
})();`;

export function HydrationRecovery() {
  useEffect(() => {
    document.documentElement.dataset.tripHydrated = "1";
    return () => { delete document.documentElement.dataset.tripHydrated; };
  }, []);

  return null;
}
