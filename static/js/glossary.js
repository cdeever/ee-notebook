(function () {
  "use strict";

  // Don't run on the glossary page itself
  if (window.location.pathname.indexOf("/glossary") !== -1) return;

  var data = window.__glossaryData;
  if (!data) return;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { return; }
  }
  if (!data.length) return;

  // Build lookup: term -> { definition, anchor }
  // Include aliases as separate lookup entries
  var terms = [];
  data.forEach(function (entry) {
    var item = { term: entry.term, def: entry.definition, anchor: entry.anchor };
    terms.push(item);
    if (entry.aliases) {
      entry.aliases.forEach(function (alias) {
        // Skip single-letter aliases (A, C, J, etc.) — too many false matches
        if (alias.length <= 2) return;
        terms.push({ term: alias, def: entry.definition, anchor: entry.anchor });
      });
    }
  });

  // Sort by term length descending so longer phrases match before shorter ones
  terms.sort(function (a, b) {
    return b.term.length - a.term.length;
  });

  // Track which anchors we've already linked (first occurrence only)
  var linked = {};

  // Find the content area
  var content = document.querySelector(".book-page .markdown");
  if (!content) return;

  // Elements to skip
  var SKIP_TAGS = {
    A: true, CODE: true, PRE: true, SCRIPT: true, STYLE: true,
    H1: true, H2: true, H3: true, H4: true, H5: true, H6: true,
    TEXTAREA: true, INPUT: true
  };

  function shouldSkip(node) {
    var el = node.parentNode;
    while (el && el !== content) {
      if (SKIP_TAGS[el.tagName]) return true;
      if (el.classList && el.classList.contains("glossary-term")) return true;
      el = el.parentNode;
    }
    return false;
  }

  // Collect all text nodes
  function getTextNodes(root) {
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while ((node = walker.nextNode())) {
      if (!shouldSkip(node) && node.textContent.trim().length > 0) {
        nodes.push(node);
      }
    }
    return nodes;
  }

  // Escape regex special chars
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Process each term
  terms.forEach(function (entry) {
    if (linked[entry.anchor]) return;

    var textNodes = getTextNodes(content);
    var pattern = new RegExp("\\b" + escapeRegex(entry.term) + "\\b", entry.term === entry.term.toUpperCase() ? "" : "i");

    for (var i = 0; i < textNodes.length; i++) {
      var node = textNodes[i];
      var match = pattern.exec(node.textContent);
      if (!match) continue;

      // Split the text node and insert the glossary link
      var before = node.textContent.substring(0, match.index);
      var matchedText = node.textContent.substring(match.index, match.index + match[0].length);
      var after = node.textContent.substring(match.index + match[0].length);

      var link = document.createElement("a");
      link.className = "glossary-term";
      link.href = (window.__glossaryBase || "/docs/glossary/") + "#" + entry.anchor;
      link.setAttribute("data-anchor", entry.anchor);

      // Tooltip span
      var tip = document.createElement("span");
      tip.className = "glossary-tip";
      tip.textContent = entry.def;
      link.appendChild(document.createTextNode(matchedText));
      link.appendChild(tip);

      var parent = node.parentNode;
      if (before) parent.insertBefore(document.createTextNode(before), node);
      parent.insertBefore(link, node);
      if (after) parent.insertBefore(document.createTextNode(after), node);
      parent.removeChild(node);

      linked[entry.anchor] = true;
      break;
    }
  });

  // Position tooltips with fixed coordinates so they render above the sidebar
  document.querySelectorAll(".glossary-term").forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      var tip = el.querySelector(".glossary-tip");
      if (!tip) return;

      // Briefly show to measure dimensions
      tip.style.visibility = "hidden";
      tip.style.display = "block";

      var termRect = el.getBoundingClientRect();
      var tipRect = tip.getBoundingClientRect();

      // Center above the term
      var top = termRect.top - tipRect.height - 6;
      var left = termRect.left + termRect.width / 2 - tipRect.width / 2;

      // Clamp horizontally to viewport
      if (left < 8) left = 8;
      if (left + tipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tipRect.width - 8;
      }

      // If no room above, flip below the term
      tip.classList.remove("tip-below");
      if (top < 8) {
        top = termRect.bottom + 6;
        tip.classList.add("tip-below");
      }

      // Point arrow at the term center
      var arrowLeft = termRect.left + termRect.width / 2 - left;
      tip.style.setProperty("--arrow-left", arrowLeft + "px");

      tip.style.top = top + "px";
      tip.style.left = left + "px";
      tip.style.visibility = "visible";
    });

    el.addEventListener("mouseleave", function () {
      var tip = el.querySelector(".glossary-tip");
      if (!tip) return;
      tip.style.display = "none";
    });
  });
})();
