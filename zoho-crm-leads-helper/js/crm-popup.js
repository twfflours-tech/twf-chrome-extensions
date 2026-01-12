(() => {
  const buttonId = "twf-zoho-helper-button";
  const styleId = "twf-zoho-helper-style";
  const popupId = "twf-zoho-helper-popup";
  const leadsListSelector =
    ".lyteExpTableOrigTableInnerWrap lyte-exptable-tr:not(#listviewHeaderRow)";
  const leadsSingleMobileSelector = "#bc_mouseArea__MOBILE .dv_info_value";
  const leadsSingleSalespersonSelector =
    "#bc_mouseArea__SMOWNERID .dv_info_value";

  const dataToSend = [];
  let whatsappTemplates = [];
  const productInput = document.createElement("input");
  const productLabel = document.createElement("label");

  const dateInput = document.createElement("input");
  const dateLabel = document.createElement("label");

  const fetchWhatsappTemplates = async () => {
    const popup = document.getElementById(popupId);
    const templateSelect = popup.querySelector("#twf-wa-template");
    const originalContent = templateSelect.innerHTML;

    // Show loader
    templateSelect.innerHTML =
      '<option value="">Fetching templates...</option>';
    templateSelect.disabled = true;

    try {
      const response = await fetch(
        "https://twf-store.bubbleapps.io/version-72rv0/api/1.1/wf/whatsapp_templates/"
      );
      const data = await response.json();

      // Update templates array
      whatsappTemplates = data.response.data.map((template, idx) => ({
        [template.title]: template.text,
      }));

      // Update template dropdown
      templateSelect.innerHTML = whatsappTemplates
        .map(
          (template, index) =>
            `<option value="${index}">${Object.keys(template)[0]}</option>`
        )
        .join("");
    } catch (error) {
      console.error("Error fetching WhatsApp templates:", error);
      // Restore original content if fetch fails
      templateSelect.innerHTML = originalContent;
    } finally {
      templateSelect.disabled = false;
    }
  };

  const emailTemplates = [
    {
      "Email Template 1":
        "Hello from TWF Flours. I have received your inquiry. Please let me know a suitable time to connect.",
    },
    {
      "Email Template 2":
        "Hi, TWF Flours here, reaching out. I'm following up on your recent inquiry. When would be a good time to chat?",
    },
    {
      "Email Template 3":
        "Greetings! TWF Flours here. I'm reaching out regarding your interest in our products. How can I assist you further?",
    },
  ];

  const createPopup = () => {
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
        select.twf-input { width: 100%; }
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
        <div class="twf-header" style="display: none;">
          <div class="twf-tabs">
            <button id="twf-tab-whatsapp" class="twf-tab active">WhatsApp</button>
            <button id="twf-tab-email" class="twf-tab">E-mail</button>
          </div>
          <button id="twf-close" class="twf-close">✕</button>
        </div>
        <div class="twf-content">
          <div id="twf-view-whatsapp" class="twf-view active">
            <label class="twf-label">To</label>
            <input id="twf-wa-to" class="twf-input" placeholder="Phone number" readonly/>
            <label class="twf-label">Message Template</label>
            <select id="twf-wa-template" class="twf-input">
              <option value="">Loading templates...</option>
            </select>
            <label class="twf-label">Message</label>
            <textarea id="twf-wa-msg" class="twf-textarea" rows="4" placeholder="Type your WhatsApp message"></textarea>
            <button id="twf-wa-send" class="twf-send">Send</button>
          </div>
          <div id="twf-view-email" class="twf-view">
            <label class="twf-label">To</label>
            <input id="twf-email-to" class="twf-input" placeholder="Emails, comma-separated" />
            <label class="twf-label">Message Template</label>
            <select id="twf-email-template" class="twf-input">
              ${emailTemplates
                .map(
                  (template, index) =>
                    `<option value="${index}">${
                      Object.keys(template)[0]
                    }</option>`
                )
                .join("")}
            </select>
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
      const waTemplateSelect = popup.querySelector("#twf-wa-template");
      const emailTemplateSelect = popup.querySelector("#twf-email-template");
      const waMsgTextarea = popup.querySelector("#twf-wa-msg");
      const emailMsgTextarea = popup.querySelector("#twf-email-msg");

      waTemplateSelect.addEventListener("change", (event) => {
        const templateIndex = event.target.value;
        let selectedTemplate = "";

        if (whatsappTemplates.length > 0 && whatsappTemplates[templateIndex]) {
          selectedTemplate =
            whatsappTemplates[templateIndex][
              Object.keys(whatsappTemplates[templateIndex])[0]
            ];
        }

        // Handle product name input based on template content
        const viewWhatsApp = popup.querySelector("#twf-view-whatsapp");
        const templateSelect = popup.querySelector("#twf-wa-template");

        // Remove existing product name input if it exists
        const existingProductInput =
          viewWhatsApp.querySelector("#product-name");
        if (existingProductInput) {
          existingProductInput.remove();
          const existingProductLabel = viewWhatsApp.querySelector(
            "[for='product-name']"
          );
          if (existingProductLabel) existingProductLabel.remove();
        }

        // Remove existing date input if it exists
        const existingDateInput = viewWhatsApp.querySelector("#date-input");
        if (existingDateInput) {
          existingDateInput.remove();
          const existingDateLabel =
            viewWhatsApp.querySelector("[for='date-input']");
          if (existingDateLabel) existingDateLabel.remove();
        }

        // Check if template contains {{product_name}}
        if (selectedTemplate.includes("{{product_name}}")) {
          // Create product name input and label
          // const productLabel = document.createElement("label");
          productLabel.className = "twf-label";
          productLabel.htmlFor = "product-name";
          productLabel.textContent = "Product Name";

          // const productInput = document.createElement("input");
          productInput.type = "text";
          productInput.id = "product-name";
          productInput.className = "twf-input";
          productInput.placeholder = "Enter product name";

          // Insert after template select
          templateSelect.parentNode.insertBefore(
            productLabel,
            templateSelect.nextSibling
          );
          templateSelect.parentNode.insertBefore(
            productInput,
            productLabel.nextSibling
          );

          // // Update message when product name changes
          // productInput.addEventListener("input", () => {
          //   let updatedMessage = selectedTemplate;
          //   if (productInput.value.trim()) {
          //     updatedMessage = updatedMessage.replace(
          //       /\{\{product_name\}\}/g,
          //       productInput.value.trim()
          //     );
          //   }
          //   // Update date if it exists
          //   const dateInput = viewWhatsApp.querySelector("#date-input");
          //   if (dateInput && dateInput.value) {
          //     updatedMessage = updatedMessage.replace(
          //       /\{\{date\}\}/g,
          //       dateInput.value
          //     );
          //   }
          //   waMsgTextarea.value = updatedMessage;
          // });
        }

        // Check if template contains {{date}}
        if (selectedTemplate.includes("{{date}}")) {
          // Create date input and label
          // const dateLabel = document.createElement("label");
          dateLabel.className = "twf-label";
          dateLabel.htmlFor = "date-input";
          dateLabel.textContent = "Date";

          // const dateInput = document.createElement("input");
          dateInput.type = "date";
          dateInput.id = "date-input";
          dateInput.className = "twf-input";

          // Set default date to today
          const today = new Date().toISOString().split("T")[0];
          dateInput.value = today;

          // Insert after product input or template select if no product input
          const productInput = viewWhatsApp.querySelector("#product-name");
          if (productInput) {
            productInput.parentNode.insertBefore(
              dateLabel,
              productInput.nextSibling
            );
            productInput.parentNode.insertBefore(
              dateInput,
              dateLabel.nextSibling
            );
          } else {
            templateSelect.parentNode.insertBefore(
              dateLabel,
              templateSelect.nextSibling
            );
            templateSelect.parentNode.insertBefore(
              dateInput,
              dateLabel.nextSibling
            );
          }

          // // Update message when date changes
          // dateInput.addEventListener("change", () => {
          //   let updatedMessage = selectedTemplate;
          //   if (dateInput.value) {
          //     updatedMessage = updatedMessage.replace(
          //       /\{\{date\}\}/g,
          //       dateInput.value
          //     );
          //   }
          //   // Update product name if it exists
          //   const productInput = viewWhatsApp.querySelector("#product-name");
          //   if (productInput && productInput.value.trim()) {
          //     updatedMessage = updatedMessage.replace(
          //       /\{\{product_name\}\}/g,
          //       productInput.value.trim()
          //     );
          //   }
          //   waMsgTextarea.value = updatedMessage;
          // });
        }

        // const salespersonName =
        //   document
        //     .querySelector(leadsSingleSalespersonSelector)
        //     ?.textContent.trim() || "";
        waMsgTextarea.value = selectedTemplate;
        // selectedTemplate.replace(
        //   "<salesperson_name>",
        //   salespersonName
        // );
      });

      emailTemplateSelect.addEventListener("change", (event) => {
        const selectedTemplate =
          emailTemplates[event.target.value][
            Object.keys(emailTemplates[event.target.value])[0]
          ];
        const salespersonName =
          document
            .querySelector(leadsSingleSalespersonSelector)
            ?.textContent.trim() || "";
        emailMsgTextarea.value = selectedTemplate.replace(
          "{{salesperson_name}}",
          salespersonName
        );
      });

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
        console.log(dataToSend);
        if (
          dataToSend.length &&
          confirm(
            `This will open ${dataToSend.length} WhatsApp link(s) in your browser. Proceed?`
          )
        ) {
          dataToSend.forEach((item) => {
            let text = waMsgTextarea.value.replace(
              "{{salesperson_name}}",
              item.owner
            );
            // let updatedMessage = selectedTemplate;
            text = text.replace("{{customer_name}}", item.customer);
            const product = productInput.value.trim() || "";
            if (product.length) {
              text = text.replace("{{product_name}}", product);
            }

            const date = dateInput.value.trim() || "";
            if (date.length) {
              text = text.replace("{{date}}", date);
            }
            // waMsgTextarea.value = updatedMessage;
            const url = `https://wa.me/${item.no}?text=${encodeURIComponent(
              text
            )}`;
            window.open(url, "_blank");
          });
          popup.classList.remove("visible");
        }
        // const raw = popup.querySelector("#twf-wa-to").value;
        // console.log(raw);

        // const phone = raw.replace(/[+\-]/g, "").replace(/\D/g, "");
        // const msg = popup.querySelector("#twf-wa-msg").value.trim();
        // if (phone) {
        //   const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        //   window.open(url, "_blank");
        // }
      });

      // emailSend.addEventListener("click", () => {
      //   const to = popup.querySelector("#twf-email-to").value.trim();
      //   const msg = popup.querySelector("#twf-email-msg").value.trim();
      //   popup.classList.remove("visible");
      // });
    }
  };

  const createButton = () => {
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
    // Fetch WhatsApp templates when popup is created
    fetchWhatsappTemplates();
  };

  const toggleEmailTab = (visible) => {
    const tabEmail = document.querySelector("#twf-tab-email");
    const viewEmail = document.querySelector("#twf-view-email");
    if (!tabEmail || !viewEmail) return;
    tabEmail.style.display = visible ? "block" : "none";
    if (!visible) {
      tabEmail.classList.remove("active");
      viewEmail.classList.remove("active");
    }
  };

  const toggleWhatsappTab = (visible) => {
    const tabWhatsApp = document.querySelector("#twf-tab-whatsapp");
    const viewWhatsApp = document.querySelector("#twf-view-whatsapp");
    if (!tabWhatsApp || !viewWhatsApp) return;
    tabWhatsApp.style.display = visible ? "block" : "none";
    if (!visible) {
      tabWhatsApp.classList.remove("active");
      viewWhatsApp.classList.remove("active");
    }
    const popup = document.getElementById(popupId);
    const waMsgTextarea = popup.querySelector("#twf-wa-msg");
    const waTemplateSelect = popup.querySelector("#twf-wa-template");

    // Handle empty templates case
    let initialWATemplate = "";
    if (whatsappTemplates.length > 0) {
      initialWATemplate =
        whatsappTemplates[0][Object.keys(whatsappTemplates[0])[0]];
    }

    // waMsgTextarea.value = initialWATemplate.replace(
    //   "<salesperson_name>",
    //   salespersonName
    // );
    waMsgTextarea.value = initialWATemplate;
    waTemplateSelect.value = "0";
  };

  const handleLeadsList = () => {
    toggleEmailTab(false);
    toggleWhatsappTab(true);
    // popup.querySelector("#twf-tab-email").classList.add("active");
    // popup.querySelector("#twf-email-to").value = "";
    const leadsList = document.querySelectorAll(leadsListSelector);
    const popup = document.getElementById(popupId);
    leadsList.forEach((lead) => {
      const checked = lead.querySelector("span.customCheckBoxChecked");

      if (checked) {
        const mobile = lead.querySelector(".lv_data_phone");
        let mobileFormatted;
        // Check if div's aria-label contains the text 'Mobile text'
        if (
          mobile
            .getAttribute("aria-label")
            ?.toLowerCase()
            .includes("mobile".toLowerCase())
        ) {
          mobileFormatted = mobile.textContent
            .trim()
            .replace(/[+\-]/g, "")
            .replace(/\D/g, "");
          popup.querySelector("#twf-wa-to").value += mobileFormatted + ",";

          const salespersonName =
            lead.querySelector(".lv_data_username")?.textContent.trim() || "";

          let customerName = "";
          const customer = lead.querySelectorAll(".lv_data_textfield");
          customer.forEach((cust) => {
            if (
              cust
                .getAttribute("aria-label")
                ?.toLowerCase()
                .includes("lead name".toLowerCase())
            ) {
              customerName = cust.textContent.trim();
            }
          });
          // if (
          //   customer
          //     .getAttribute("aria-label")
          //     ?.toLowerCase()
          //     .includes("Lead Name".toLowerCase())
          // ) {
          //   customerName = customer.textContent.trim();
          // }

          dataToSend.push({
            no: mobileFormatted,
            owner: salespersonName,
            customer: customerName,
          });
        }
        // const email = lead.querySelector(".lv_data_email");
        // if (email) {
        //   popup.querySelector("#twf-email-to").value +=
        //     email.textContent.trim() + ",";
        // }
      }
    });

    // const emailMsgTextarea = popup.querySelector("#twf-email-msg");
    // const emailTemplateSelect = popup.querySelector("#twf-email-template");

    // if (emailTemplateSelect && emailMsgTextarea) {
    //   const initialEmailTemplate =
    //     emailTemplates[0][Object.keys(emailTemplates[0])[0]];
    //   emailMsgTextarea.value = initialEmailTemplate.replace(
    //     "<salesperson_name>",
    //     salespersonName
    //   );
    //   emailTemplateSelect.value = "0";
    // }
  };

  const handleSingleLead = () => {
    toggleEmailTab(false);
    toggleWhatsappTab(true);
    const popup = document.getElementById(popupId);
    const mobile = document.querySelector(leadsSingleMobileSelector);
    if (mobile) {
      const numberFormatted = mobile.textContent
        .trim()
        .replace(/[+\-]/g, "")
        .replace(/\D/g, "");

      popup.querySelector("#twf-wa-to").value = numberFormatted;
      const salespersonName =
        document
          .querySelector(leadsSingleSalespersonSelector)
          ?.textContent.trim() || "";

      dataToSend.push({
        no: numberFormatted,
        owner: salespersonName,
        customer:
          document.querySelector("#title_LASTNAME").textContent.trim() || "",
      });
    }
  };

  const btnListener = () => {
    productInput.value = "";
    const popup = document.getElementById(popupId);
    popup.querySelector("#twf-wa-to").value = "";
    productInput?.remove();
    productLabel?.remove();
    dateInput?.remove();
    dateLabel?.remove();
    dataToSend.length = 0;

    if (popup) {
      if (popup.classList.contains("visible")) {
        popup.classList.remove("visible");
      } else {
        // Check if the current page is the list page or details page.
        const leadsList = document.querySelectorAll(leadsListSelector);
        console.log(leadsList.length);

        if (leadsList.length) {
          let checkedLeads = 0;
          leadsList.forEach((lead) => {
            if (lead.querySelector("span.customCheckBoxChecked")) {
              checkedLeads++;
            }
          });

          if (checkedLeads > 15) {
            alert("Maximum of 15 leads allowed for selection.");
          } else if (checkedLeads === 0) {
            alert("Please select at least one lead.");
          } else {
            // Show popup
            popup.classList.add("visible");
            handleLeadsList();
          }
        } else {
          // Show popup
          popup.classList.add("visible");
          handleSingleLead();
        }

        // const defaultTab = document.getElementById(
        //   leadsList.length ? "twf-tab-email" : "twf-tab-whatsapp"
        // );
        const defaultTab = document.getElementById("twf-tab-whatsapp");
        if (defaultTab) defaultTab.click();
      }
    }
  };

  createPopup();
  createButton();
})();
