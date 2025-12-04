(() => {
  const buttonId = "twf-zoho-helper-button";
  const styleId = "twf-zoho-helper-style";
  const popupId = "twf-zoho-helper-popup";
  const leadsListSelector =
    ".lyteExpTableOrigTableInnerWrap lyte-exptable-tr:not(#listviewHeaderRow)";
  const leadsSingleEmailSelector = "#bc_mouseArea__EMAIL .dv_info_value";
  const leadsSingleMobileSelector = "#bc_mouseArea__MOBILE .dv_info_value";

  function createPopup() {
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .twf-popup { position: fixed; z-index: 2147483647; bottom: 120px; right: 20px; width: 400px; max-width: 90vw; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: rgba(45,35,66,.3) 0 7px 13px -3px, rgba(58,65,111,.4) 0 2px 4px; opacity: 0; transform: translateY(8px) scale(.98); transition: opacity .2s ease, transform .2s ease; pointer-events: none; }
        .twf-popup.visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
        .twf-header { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eef; }
        .twf-tabs { display: flex; gap: 6px; }
        .twf-tab { border: none; background: #f1f4ff; color: #333; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
        .twf-tab.active { background: #5468ff; color: #fff; }
        .twf-close { border: none; background: transparent; font-size: 16px; cursor: pointer; color: #666; }
        .twf-content { padding: 10px; }
        .twf-label { display: block; font-size: 12px; color: #555; margin: 8px 0 4px; }
        .twf-input, .twf-textarea { color: #555; width: 95%; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px; font-size: 14px; }
        .twf-input:focus, .twf-textarea:focus { background: #fff!important; outline: none; border-color: #5468ff; box-shadow: 0 0 0 2px rgba(84,104,255,.1); }
        .twf-send { margin-top: 10px; background: #5468ff; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; }
        .twf-view { display: none; }
        .twf-view.active { display: block; }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById(popupId)) {
      const popup = document.createElement("div");
      popup.id = popupId;
      popup.className = "twf-popup";
      popup.innerHTML = `
        <div class="twf-header">
          <div class="twf-tabs">
            <button id="twf-tab-whatsapp" class="twf-tab active">WhatsApp</button>
            <button id="twf-tab-email" class="twf-tab">E-mail</button>
          </div>
          <button id="twf-close" class="twf-close">✕</button>
        </div>
        <div class="twf-content">
          <div id="twf-view-whatsapp" class="twf-view active">
            <label class="twf-label">To</label>
            <input id="twf-wa-to" class="twf-input" placeholder="Phone numbers, comma-separated" />
            <label class="twf-label">Message</label>
            <textarea id="twf-wa-msg" class="twf-textarea" rows="4" placeholder="Type your WhatsApp message"></textarea>
            <button id="twf-wa-send" class="twf-send">Send</button>
          </div>
          <div id="twf-view-email" class="twf-view">
            <label class="twf-label">To</label>
            <input id="twf-email-to" class="twf-input" placeholder="Emails, comma-separated" />
            <label class="twf-label">Message</label>
            <textarea id="twf-email-msg" class="twf-textarea" rows="4" placeholder="Type your email message"></textarea>
            <button id="twf-email-send" class="twf-send">Send</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);

      const tabWhatsApp = popup.querySelector("#twf-tab-whatsapp");
      const tabEmail = popup.querySelector("#twf-tab-email");
      const viewWhatsApp = popup.querySelector("#twf-view-whatsapp");
      const viewEmail = popup.querySelector("#twf-view-email");
      const closeBtn = popup.querySelector("#twf-close");
      const waSend = popup.querySelector("#twf-wa-send");
      const emailSend = popup.querySelector("#twf-email-send");

      tabWhatsApp.addEventListener("click", () => {
        tabWhatsApp.classList.add("active");
        tabEmail.classList.remove("active");
        viewWhatsApp.classList.add("active");
        viewEmail.classList.remove("active");
      });

      tabEmail.addEventListener("click", () => {
        tabEmail.classList.add("active");
        tabWhatsApp.classList.remove("active");
        viewEmail.classList.add("active");
        viewWhatsApp.classList.remove("active");
      });

      closeBtn.addEventListener("click", () => {
        popup.classList.remove("visible");
      });

      waSend.addEventListener("click", () => {
        const to = popup.querySelector("#twf-wa-to").value.trim();
        const msg = popup.querySelector("#twf-wa-msg").value.trim();
        popup.classList.remove("visible");
      });

      emailSend.addEventListener("click", () => {
        const to = popup.querySelector("#twf-email-to").value.trim();
        const msg = popup.querySelector("#twf-email-msg").value.trim();
        popup.classList.remove("visible");
      });
    }
  }

  function createButton() {
    if (document.getElementById(buttonId)) return;
    const btn = document.createElement("button");
    btn.id = buttonId;
    btn.textContent = "Contact Lead(s)";
    btn.style.position = "fixed";
    btn.style.bottom = "50px";
    btn.style.right = "20px";
    btn.style.zIndex = "2147483647";
    btn.style.padding = "10px 15px";
    btn.style.background = "#5468ff";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.boxShadow =
      "rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.4) 0 2px 4px";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", btnListener);
    document.body.appendChild(btn);
  }

  const btnListener = () => {
    const popup = document.getElementById(popupId);
    if (popup) {
      if (popup.classList.contains("visible")) {
        popup.classList.remove("visible");
      } else {
        // Show popup
        // Check if the current page is the list page or details page.
        let leadsList = document.querySelectorAll(leadsListSelector);

        console.log(leadsList.length);
        if (leadsList.length) {
          // Get emails and mobiles
          popup.querySelector("#twf-email-to").value = "";
          leadsList.forEach((lead) => {
            const checked = lead.querySelector("input[type=checkbox]:checked");
            if (checked) {
              const email = lead.querySelector(".lv_data_email");
              if (email) {
                popup.querySelector("#twf-email-to").value +=
                  email.textContent.trim() + ",";
              }

              const mobiles = lead.querySelectorAll(".lv_data_phone");
              mobiles.forEach((mobile) => {
                if (mobile) {
                  popup.querySelector("#twf-wa-to").value +=
                    mobile.textContent.trim() + ",";
                }
              });
            }
          });
        } else {
          // Get single email
          const email = document.querySelector(leadsSingleEmailSelector);
          if (email) {
            popup.querySelector("#twf-email-to").value =
              email.textContent.trim();
          }
          // Get single mobile
          const mobile = document.querySelector(leadsSingleMobileSelector);
          if (mobile) {
            popup.querySelector("#twf-wa-to").value = mobile.textContent.trim();
          }
        }
        popup.classList.add("visible");
        const defaultTab = document.getElementById("twf-tab-whatsapp");
        if (defaultTab) defaultTab.click();
      }
    }
  };

  createPopup();
  createButton();
})();
