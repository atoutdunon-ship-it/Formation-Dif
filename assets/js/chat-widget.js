/**
 * Rotary Club du François — Widget de chat FAQ visiteurs.
 *
 * Assistant 100% côté client (aucun backend requis) répondant aux questions
 * basiques des visiteurs par correspondance de mots-clés. Se branche sur la
 * charte graphique existante (variables CSS --navy, --gold, etc. définies
 * dans assets/css/style.css). Aucune icône : uniquement du texte.
 *
 * Intégration : <script src="assets/js/chat-widget.js" defer></script>
 * avant la fermeture de </body> sur chaque page du site public.
 */
(function () {
  "use strict";

  const CLUB_NAME = "Rotary Club du François";

  const FAQ_RULES = [
    {
      keywords: ["adherer", "adhesion", "rejoindre", "devenir membre", "inscription", "member"],
      answer:
        "Pour devenir membre, rendez-vous sur la page « Devenir membre » et remplissez le formulaire de candidature. " +
        "Un membre du Bureau vous recontactera pour organiser un entretien de parrainage.",
      link: { href: "adherer.html", label: "Ouvrir la page Devenir membre" },
    },
    {
      keywords: ["reunion", "réunion", "quand", "horaire", "heure", "se reunit", "se réunit"],
      answer:
        "Le club se réunit régulièrement pour ses réunions statutaires. Consultez la page Agenda pour connaître " +
        "les prochaines dates et lieux.",
      link: { href: "agenda.html", label: "Voir l'agenda" },
    },
    {
      keywords: ["ou", "où", "adresse", "lieu", "siege", "siège", "trouve", "localisation"],
      answer:
        "Le siège du club se trouve au Centre International de Séjour — Étang Zabricot, 97200 Fort-de-France, Martinique.",
    },
    {
      keywords: ["action", "projet", "faites", "aidez", "solidarite", "solidarité"],
      answer:
        "Le club mène des actions en solidarité, éducation, santé, environnement et développement local. " +
        "Découvrez nos projets en cours sur la page Nos Actions.",
      link: { href: "actions.html", label: "Voir nos actions" },
    },
    {
      keywords: ["contact", "joindre", "telephone", "téléphone", "email", "mail", "ecrire", "écrire"],
      answer:
        "Vous pouvez nous écrire via la page Contact, par e-mail à rotaryclubdufrancois@gmail.com, " +
        "ou par téléphone au 0696 88 28 29.",
      link: { href: "contact.html", label: "Ouvrir la page Contact" },
    },
    {
      keywords: ["district", "zone", "rotary international", "gouverneur"],
      answer:
        "Le Rotary Club du François appartient au District 7030, Zone 34 du Rotary International.",
    },
    {
      keywords: ["don", "donner", "financer", "soutenir"],
      answer:
        "Pour soutenir une action ou faire un don, contactez notre Trésorier via la page Contact en précisant l'objet de votre demande.",
      link: { href: "contact.html", label: "Ouvrir la page Contact" },
    },
    {
      keywords: ["cotisation", "prix", "tarif", "combien", "coute", "coûte"],
      answer:
        "Le montant de la cotisation annuelle est fixé chaque année par le Bureau. Contactez le Trésorier via la page " +
        "Contact pour connaître le montant en vigueur.",
      link: { href: "contact.html", label: "Ouvrir la page Contact" },
    },
  ];

  const FALLBACK_ANSWER =
    "Je ne suis pas certain de pouvoir répondre précisément à cette question. " +
    "Un membre du club vous répondra directement si vous passez par notre page Contact.";

  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function findAnswer(question) {
    const normalized = normalize(question);
    for (const rule of FAQ_RULES) {
      if (rule.keywords.some((kw) => normalized.includes(normalize(kw)))) {
        return rule;
      }
    }
    return { answer: FALLBACK_ANSWER, link: { href: "contact.html", label: "Ouvrir la page Contact" } };
  }

  function buildStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #rc-chat-toggle {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 999;
        background: var(--navy-deep, #050f26);
        color: #fff;
        border: 1px solid var(--navy-deep, #050f26);
        padding: 14px 22px;
        font-family: var(--font-body, "Inter", sans-serif);
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
      }
      #rc-chat-toggle:hover { background: #000; }
      #rc-chat-panel {
        position: fixed;
        bottom: 92px;
        right: 28px;
        z-index: 999;
        width: 340px;
        max-width: calc(100vw - 40px);
        max-height: 460px;
        background: #fff;
        border: 1px solid var(--navy-deep, #050f26);
        display: none;
        flex-direction: column;
        font-family: var(--font-body, "Inter", sans-serif);
        box-shadow: 0 12px 32px rgba(0,0,0,0.18);
      }
      #rc-chat-panel.open { display: flex; }
      #rc-chat-header {
        background: var(--navy-deep, #050f26);
        color: #fff;
        padding: 16px 18px;
        border-bottom: 2px solid var(--gold, #f7a81b);
      }
      #rc-chat-header .title { font-family: var(--font-display, serif); font-size: 0.95rem; }
      #rc-chat-header .subtitle { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-top: 2px; }
      #rc-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .rc-msg { font-size: 0.86rem; line-height: 1.5; padding: 10px 12px; max-width: 88%; }
      .rc-msg--bot { background: var(--off-white, #f4f5f7); color: #0a0a0a; align-self: flex-start; }
      .rc-msg--user { background: var(--navy-deep, #050f26); color: #fff; align-self: flex-end; }
      .rc-msg a { color: var(--gold, #f7a81b); text-decoration: underline; }
      #rc-chat-suggestions { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; }
      .rc-suggestion {
        font-size: 0.68rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        border: 1px solid var(--grey-line, #e2e4e9);
        padding: 6px 10px;
        cursor: pointer;
        background: #fff;
        color: var(--navy, #0a1a3c);
      }
      .rc-suggestion:hover { border-color: var(--navy, #0a1a3c); }
      #rc-chat-form { display: flex; border-top: 1px solid var(--grey-line, #e2e4e9); }
      #rc-chat-input {
        flex: 1;
        border: none;
        padding: 12px 14px;
        font-family: var(--font-body, "Inter", sans-serif);
        font-size: 0.86rem;
      }
      #rc-chat-input:focus { outline: none; }
      #rc-chat-send {
        border: none;
        background: var(--navy-deep, #050f26);
        color: #fff;
        padding: 0 18px;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
      }
      #rc-chat-send:hover { background: #000; }
      @media (max-width: 480px) {
        #rc-chat-panel { right: 12px; left: 12px; width: auto; }
        #rc-chat-toggle { right: 12px; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildMarkup() {
    const toggle = document.createElement("button");
    toggle.id = "rc-chat-toggle";
    toggle.type = "button";
    toggle.textContent = "Une question ?";

    const panel = document.createElement("div");
    panel.id = "rc-chat-panel";
    panel.innerHTML = `
      <div id="rc-chat-header">
        <div class="title">${CLUB_NAME}</div>
        <div class="subtitle">Assistant visiteurs</div>
      </div>
      <div id="rc-chat-messages"></div>
      <div id="rc-chat-suggestions"></div>
      <form id="rc-chat-form">
        <input id="rc-chat-input" type="text" placeholder="Posez votre question…" autocomplete="off">
        <button id="rc-chat-send" type="submit">Envoyer</button>
      </form>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    return { toggle, panel };
  }

  function addMessage(container, text, author) {
    const msg = document.createElement("div");
    msg.className = "rc-msg rc-msg--" + author;
    msg.innerHTML = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function init() {
    buildStyles();
    const { toggle, panel } = buildMarkup();
    const messages = panel.querySelector("#rc-chat-messages");
    const suggestions = panel.querySelector("#rc-chat-suggestions");
    const form = panel.querySelector("#rc-chat-form");
    const input = panel.querySelector("#rc-chat-input");

    const suggestionTexts = ["Comment adhérer ?", "Où est le club ?", "Vos actions ?", "Nous contacter"];
    suggestionTexts.forEach((text) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "rc-suggestion";
      btn.textContent = text;
      btn.addEventListener("click", () => {
        input.value = text;
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
      suggestions.appendChild(btn);
    });

    addMessage(
      messages,
      "Bonjour ! Je suis l'assistant du " + CLUB_NAME + ". Posez-moi une question sur le club, l'adhésion ou nos actions.",
      "bot"
    );

    toggle.addEventListener("click", () => {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) input.focus();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      addMessage(messages, question, "user");
      input.value = "";

      const rule = findAnswer(question);
      let answerHtml = rule.answer;
      if (rule.link) {
        answerHtml += ` <a href="${rule.link.href}">${rule.link.label} →</a>`;
      }
      window.setTimeout(() => addMessage(messages, answerHtml, "bot"), 250);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
