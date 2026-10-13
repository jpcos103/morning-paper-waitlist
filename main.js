const PRODUCT_NAME = "The Morning Fold";
// Alternative names: Daily Fold, Your Morning Edition, Inkling Press.

document.querySelectorAll(".product-name").forEach((element) => {
  element.textContent = PRODUCT_NAME;
});
document.title = PRODUCT_NAME;
document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((meta) => {
  meta.content = PRODUCT_NAME;
});

const SIGNUP_URL = "https://formsubmit.co/ajax/jpcos@mail.grokbot.com";

function showThankYou(form) {
  const message = form.closest(".signup-slot").querySelector(".signup-success");
  form.hidden = true;
  message.hidden = false;
  message.focus({ preventScroll: true });
}

document.querySelectorAll(".signup-form").forEach((form) => {
  let submitting = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    const data = new FormData(form);
    if (String(data.get("_honey") || "").trim()) {
      showThankYou(form);
      return;
    }
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    const error = form.querySelector(".form-error");
    const originalButton = button.innerHTML;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    submitting = true;
    button.disabled = true;
    button.textContent = "Joining...";
    form.setAttribute("aria-busy", "true");
    error.hidden = true;
    data.set("email", String(data.get("email")).trim());

    try {
      const response = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Signup request failed");
      const result = await response.json();
      if (result.success !== true && result.success !== "true") {
        throw new Error("Signup was not accepted");
      }
      showThankYou(form);
    } catch (requestError) {
      error.textContent = requestError.name === "AbortError"
        ? "Request timed out. Please try again."
        : "Signup failed. Please try again.";
      error.hidden = false;
    } finally {
      window.clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.innerHTML = originalButton;
      form.removeAttribute("aria-busy");
    }
  });
});
