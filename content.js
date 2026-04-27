function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function hasVhdlLabel(pre) {
  const labels = pre.querySelectorAll(".text-sm.font-medium, .text-sm");
  for (const el of labels) {
    const txt = (el.textContent || "").trim().toLowerCase();
    if (txt === "vhdl" || txt === "vhdl file") return true;
  }
  return false;
}

function highlightVHDL(text) {
  const placeholders = [];
  const store = (html) => {
    const key = `__VHDL_TOKEN_${placeholders.length}__`;
    placeholders.push({ key, html });
    return key;
  };

  let src = escapeHtml(text);

  // comments
  src = src.replace(/--.*$/gm, (m) =>
    store(`<span class="vhdl-comment">${m}</span>`)
  );

  // strings
  src = src.replace(/"([^"]*)"/g, (m) =>
    store(`<span class="vhdl-string">${m}</span>`)
  );

  // chars
  src = src.replace(/'([^']*)'/g, (m) =>
    store(`<span class="vhdl-char">${m}</span>`)
  );

  // numbers
  src = src.replace(/\b\d+\b/g, (m) =>
    store(`<span class="vhdl-number">${m}</span>`)
  );

  // operators
  src = src.replace(
    /(&lt;=|=&gt;|:=|\/=|&lt;|&gt;|\+|-|\*|\/|=|&amp;)/g,
    '<span class="vhdl-operator">$1</span>'
  );

  // types
  const types = [
    "std_logic",
    "std_ulogic",
    "std_logic_vector",
    "std_ulogic_vector",
    "unsigned",
    "signed",
    "integer",
    "natural",
    "boolean"
  ];
  const typeRegex = new RegExp(`\\b(${types.join("|")})\\b`, "gi");
  src = src.replace(typeRegex, (m) =>
    store(`<span class="vhdl-type">${m}</span>`)
  );

  // keywords
  const keywords = [
    "library","use","entity","architecture","is","begin","end","of",
    "signal","process","if","then","else","elsif","when","others",
    "port","map","generic","downto","to","in","out","inout",
    "constant","variable","case","loop","for","while","wait","until",
    "after","report","severity","next","exit","array","record","type"
  ];
  const kwRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  src = src.replace(kwRegex, '<span class="vhdl-keyword">$1</span>');

  // builtins
  const builtins = [
    "rising_edge",
    "falling_edge",
    "to_integer",
    "to_unsigned",
    "to_signed",
    "resize",
    "std_logic_vector",
    "std_ulogic_vector"
  ];
  const fnRegex = new RegExp(`\\b(${builtins.join("|")})\\b`, "gi");
  src = src.replace(fnRegex, '<span class="vhdl-function">$1</span>');

  // restore placeholders
  for (const token of placeholders) {
    src = src.replaceAll(token.key, token.html);
  }

  return src;
}

function processPreBlock(pre) {
  if (pre.dataset.vhdlDone === "1") return;
  if (!hasVhdlLabel(pre)) return;

  const content = pre.querySelector(".cm-content");
  if (!content) return;

  const rawText = content.innerText || content.textContent || "";
  if (!rawText.trim()) return;

  content.innerHTML = highlightVHDL(rawText);
  pre.dataset.vhdlDone = "1";
}

/* 🔥 NUOVA LOGICA: aspetta che il contenuto smetta di cambiare */

const debounceMap = new WeakMap();

function scheduleHighlight(pre) {
  if (!hasVhdlLabel(pre)) return;

  if (debounceMap.has(pre)) {
    clearTimeout(debounceMap.get(pre));
  }

  const timeout = setTimeout(() => {
    processPreBlock(pre);
    debounceMap.delete(pre);
  }, 800); // <-- ritardo (puoi aumentare se vuoi)

  debounceMap.set(pre, timeout);
}

const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    const pre = m.target.closest?.("pre");
    if (pre) {
      scheduleHighlight(pre);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});