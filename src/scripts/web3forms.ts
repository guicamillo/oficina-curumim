document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-web3forms")) return;

  event.preventDefault();
  const fields = form.querySelector("fieldset");
  const spinner = form.querySelector("[data-form-spinner]");
  const success = form.querySelector<HTMLElement>("[data-form-success]");
  const error = form.querySelector<HTMLElement>("[data-form-error]");
  if (!fields || !spinner || !success || !error || fields.disabled || fields.hidden) return;

  const formData = new FormData(form);
  fields.disabled = true;
  fields.setAttribute("aria-busy", "true");
  spinner.classList.remove("hidden");
  error.classList.add("hidden");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Web3Forms request failed");
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("success" in result) ||
      result.success !== true
    ) {
      throw new Error("Web3Forms rejected the submission");
    }

    form.reset();
    fields.hidden = true;
    success.classList.remove("hidden");
    success.focus();
  } catch {
    error.classList.remove("hidden");
    error.focus();
  } finally {
    fields.disabled = false;
    fields.removeAttribute("aria-busy");
    spinner.classList.add("hidden");
  }
});
