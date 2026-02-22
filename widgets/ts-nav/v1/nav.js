(function () {
  async function licenseCheck(licenseKey) {
    const host = window.location.hostname.toLowerCase();
    const apiBase = "https://gabe-f04.workers.dev"; // we'll create this endpoint next
    const url = `${apiBase}/license?host=${encodeURIComponent(host)}&key=${encodeURIComponent(licenseKey)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) return { ok: false };
      return await res.json();
    } catch (e) {
      return { ok: false };
    }
  }

  async function init({ container, props }) {
    const licenseKey = props && props.licenseKey ? String(props.licenseKey) : "";

    // For now, just render something so we can confirm the external script loads.
    container.innerHTML = `<div style="padding:12px;">Tech.Storage Nav external script loaded. License key: ${licenseKey || "(none)"}.</div>`;

    // We'll turn this on after we build the /license API
    // const lic = await licenseCheck(licenseKey);
    // if (!lic.ok) {
    //   container.innerHTML = "<div style='padding:12px;'>Not licensed for this domain.</div>";
    //   return;
    // }
  }

  function clean({ container }) {
    if (container) container.innerHTML = "";
  }

  window.TechStorageNav = { init, clean };
})();
