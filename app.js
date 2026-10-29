/* Konaet Sentinel — superfície viva do site.
   Sem framework, sem rastreador: apenas navegação líquida, instrumentos e
   o checkout PIX estático. O BR Code segue as mesmas regras de sentinel/pix.py. */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
  var num = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------ revelações */
  var revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ------------------------------------------------------------ cursor */
  var lens = $("#cursor-lens");
  var dot = $("#cursor-dot");
  if (lens && dot && fine && !reduce) {
    var tx = 0, ty = 0, lx = 0, ly = 0, seen = false, raf = null;
    var tick = function () {
      lx += (tx - lx) * 0.16;
      ly += (ty - ly) * 0.16;
      lens.style.transform = "translate3d(" + lx + "px," + ly + "px,0)";
      if (Math.abs(tx - lx) > 0.3 || Math.abs(ty - ly) > 0.3) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };
    var queue = function () { if (!raf) raf = requestAnimationFrame(tick); };
    document.addEventListener("pointermove", function (event) {
      tx = event.clientX;
      ty = event.clientY;
      if (!seen) {
        seen = true;
        lx = tx; ly = ty;
        lens.classList.add("is-on");
        dot.classList.add("is-on");
      }
      dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
      var hot = event.target.closest && event.target.closest("a,button,summary,.game-chip,.node,.layer,.plan");
      dot.classList.toggle("is-hot", !!hot);
      queue();
    }, { passive: true });
    document.addEventListener("pointerleave", function () {
      lens.classList.remove("is-on");
      dot.classList.remove("is-on");
    });
  }

  /* ------------------------------------------------------------ magnéticos */
  if (fine && !reduce) {
    $$(".magnetic").forEach(function (button) {
      var rafId = null, mx = 0, my = 0;
      button.addEventListener("pointermove", function (event) {
        var rect = button.getBoundingClientRect();
        mx = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
        my = ((event.clientY - rect.top) / rect.height - 0.5) * 7;
        if (!rafId) {
          rafId = requestAnimationFrame(function () {
            button.style.translate = mx.toFixed(2) + "px " + my.toFixed(2) + "px";
            rafId = null;
          });
        }
      });
      button.addEventListener("pointerleave", function () {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        button.style.translate = "";
      });
    });

    var hero = $(".hero");
    var caseTag = $("#hero-case");
    if (hero && caseTag) {
      hero.addEventListener("pointermove", function (event) {
        var rect = hero.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        caseTag.style.setProperty("--mx", (px * 8).toFixed(2) + "px");
        caseTag.style.setProperty("--my", (py * 7).toFixed(2) + "px");
      });
      hero.addEventListener("pointerleave", function () {
        caseTag.style.setProperty("--mx", "0px");
        caseTag.style.setProperty("--my", "0px");
      });
    }

    $$(".layer").forEach(function (layer) {
      layer.addEventListener("pointermove", function (event) {
        var rect = layer.getBoundingClientRect();
        layer.style.setProperty("--spot-x", ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + "%");
        layer.style.setProperty("--spot-y", ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + "%");
      });
    });
  }

  /* ------------------------------------------------------------ progresso */
  var progress = $("#scroll-progress");
  var masthead = $("#masthead");
  var nav = $("#primary-nav");
  var navLinks = nav ? $$("a[data-nav]", nav) : [];
  var navLens = $("#nav-lens");
  var navDrop = $("#nav-drop");
  var currentNav = null;
  var hoveringNav = false;
  var sections = navLinks.map(function (link) {
    return { link: link, section: $("#" + link.getAttribute("data-nav")) };
  }).filter(function (item) { return item.section; });

  function placeNav(link) {
    if (!navLens || !navDrop || !link) return;
    navLens.style.width = link.offsetWidth + "px";
    navLens.style.transform = "translateX(" + link.offsetLeft + "px)";
    navDrop.style.transform = "translateX(" + (link.offsetLeft + link.offsetWidth / 2) + "px)";
  }

  function showNav(link, ready) {
    placeNav(link);
    if (ready) {
      navLens.classList.add("is-ready");
      navDrop.classList.add("is-ready");
    }
  }

  function setCurrent(link) {
    if (navLinks.length === 0) return;
    navLinks.forEach(function (item) { item.classList.toggle("is-current", item === link); });
    currentNav = link;
    if (link) {
      showNav(link, true);
    } else if (!hoveringNav) {
      if (navLens) navLens.classList.remove("is-ready");
      if (navDrop) navDrop.classList.remove("is-ready");
    }
  }

  if (nav) {
    nav.addEventListener("pointerenter", function () { hoveringNav = true; });
    nav.addEventListener("pointerleave", function () {
      hoveringNav = false;
      if (currentNav) showNav(currentNav, true);
      else {
        navLens.classList.remove("is-ready");
        navDrop.classList.remove("is-ready");
      }
    });
    navLinks.forEach(function (link) {
      link.addEventListener("pointerenter", function () { showNav(link, true); });
      link.addEventListener("focus", function () { showNav(link, true); });
    });
    window.addEventListener("resize", function () {
      if (currentNav) showNav(currentNav, true);
    });
    window.addEventListener("load", function () {
      if (currentNav) showNav(currentNav, true);
      var activeCase = document.querySelector(".case-tab.is-active");
      if (activeCase) moveCaseLens(activeCase);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (currentNav) showNav(currentNav, true);
        var activeCase = document.querySelector(".case-tab.is-active");
        if (activeCase) moveCaseLens(activeCase);
      });
    }
  }

  var scrolling = false;
  function onScroll() {
    var top = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? clamp(top / max, 0, 1) : 0) + ")";
    if (masthead) masthead.classList.toggle("is-scrolled", top > 24);
    if (sections.length) {
      var active = null;
      for (var i = 0; i < sections.length; i++) {
        var rect = sections[i].section.getBoundingClientRect();
        if (rect.top <= 150) active = sections[i].link;
      }
      if (!active) active = sections[0].link;
      if (active !== currentNav) setCurrent(active);
    }
    scrolling = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrolling) {
      scrolling = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------ menu móvel */
  var menuToggle = $("#menu-toggle");
  var sheet = $("#mobile-sheet");
  var sheetTimer = null;
  var menuOpen = false;

  function openMenu() {
    if (!sheet || !menuToggle) return;
    if (sheetTimer) { clearTimeout(sheetTimer); sheetTimer = null; }
    menuOpen = true;
    sheet.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
    requestAnimationFrame(function () { sheet.classList.add("is-open"); });
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
    var first = sheet.querySelector("a");
    if (first) setTimeout(function () { first.focus(); }, 80);
  }

  function closeMenu(restore) {
    if (!sheet || !menuToggle || !menuOpen) return;
    menuOpen = false;
    sheet.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
    if (document.body.style.overflow === "hidden") document.body.style.overflow = "";
    if (restore && menuToggle.focus) menuToggle.focus();
    sheetTimer = setTimeout(function () { sheet.hidden = true; sheetTimer = null; }, 380);
  }

  if (menuToggle && sheet) {
    menuToggle.addEventListener("click", function () {
      if (menuOpen) closeMenu(false); else openMenu();
    });
    $$("a", sheet).forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuOpen) closeMenu(true);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1020 && menuOpen) closeMenu(false);
    });
  }

  /* ------------------------------------------------------------ constelação */
  var FEATURES = [
    { label: "p90 da velocidade / limite", short: "velocidade", value: 0.82, group: "movimento",
      desc: "Compara o p90 da velocidade com o máximo legítimo do perfil. Acima de 1,0, o servidor viu um deslocamento que a física não permite." },
    { label: "fração no ar", short: "fração no ar", value: 0.34, group: "movimento",
      desc: "Parte do tempo em que o jogador esteve no ar sem veículo, escada ou água. Rajadas longas demais sugerem flutuação." },
    { label: "maior hover (s)", short: "hover", value: 0.18, group: "movimento",
      desc: "Maior intervalo suspenso sem cair. Cada perfil define a folga aceitável entre salto e queda." },
    { label: "subida no ar (blocos)", short: "subida", value: 0.22, group: "movimento",
      desc: "Subida vertical máxima sem bloco de apoio. É a medida mais direta contra voo e escalada artificial." },
    { label: "p95 do alcance de ataque", short: "alcance p95", value: 0.95, group: "combate",
      desc: "95º percentil da distância de ataque na janela. Só é ativado em perfis com alcance de braço; em shooters a regra fica desligada." },
    { label: "alcance máximo", short: "alcance máx.", value: 0.88, group: "combate",
      desc: "Maior alcance de ataque observado. Picos isolados são comparados ao limite instantâneo do perfil." },
    { label: "cliques/s (5 s)", short: "cliques/s", value: 0.54, group: "entrada",
      desc: "Cliques por segundo em uma janela curta. Serve de contexto: CPS alto sozinho não é prova de trap." },
    { label: "regularidade dos cliques (CV)", short: "regularidade", value: 0.21, group: "entrada",
      desc: "Coeficiente de variação dos intervalos entre cliques. Mão humana é irregular; macro costuma ser uniforme demais." },
    { label: "p95 da velocidade de mira", short: "mira p95", value: 0.77, group: "entrada",
      desc: "95º percentil da velocidade angular da mira, em graus por segundo. Flicks legítimos existem; o conjunto é que pesa." },
    { label: "variação da mira", short: "mira jerk", value: 0.69, group: "entrada",
      desc: "Variação brusca da aceleração da mira. Mede o tranco típico de um snap assistido." },
    { label: "erro angular de mira", short: "erro de mira", value: 0.13, group: "entrada",
      desc: "Erro angular entre mira e alvo no instante do hit. Ajuda a separar mira assistida de mira humana." },
    { label: "alvos distintos em 10 s", short: "alvos 10 s", value: 0.81, group: "contexto",
      desc: "Quantos alvos distintos foram atacados em dez segundos. Rotação perfeita entre muitos alvos é um sinal composto." },
    { label: "pacotes de movimento/s", short: "pacotes/s", value: 0.44, group: "contexto",
      desc: "Pacotes de movimento por segundo. Fora da faixa do perfil, indica aceleração artificial da rede ou do cliente." },
    { label: "duração da quebra / mínimo", short: "quebra", value: 0.26, group: "combate",
      desc: "Duração da quebra dividida pelo tempo mínimo do bloco. Só existe em jogos com quebra, como o perfil de referência." },
    { label: "quebras/min", short: "quebras/min", value: 0.35, group: "combate",
      desc: "Quebras por minuto. Rajadas acima do fisicamente possível entram na regra determinística." },
    { label: "maior queda sem dano (blocos)", short: "queda s/ dano", value: 0.12, group: "contexto",
      desc: "Maior queda sem dano. Complementa a regra vertical em perfis de sobrevivência." },
    { label: "p95 do alcance de colocação", short: "alcance colocar", value: 0.20, group: "combate",
      desc: "95º percentil da distância de colocação. Só é avaliado em perfis com construção, como areia e blocos." }
  ];
  var GROUPS = {
    movimento: "#c07150",
    combate: "#8a6f86",
    entrada: "#93a68c",
    contexto: "#a394bd"
  };
  var constellation = $("#constellation");
  var readout = $(".ai-readout");
  var nodes = [];
  var activeFeature = 0;

  function svgEl(name, attrs) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", name);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    }
    return node;
  }

  function polar(cx, cy, radius, angle) {
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  }

  function splitLabel(text) {
    if (text.length <= 11) return [text];
    var mid = text.length / 2;
    var best = -1;
    var bestDistance = 99;
    for (var i = 0; i < text.length; i++) {
      if (text.charAt(i) !== " ") continue;
      var distance = Math.abs(i - mid);
      if (distance < bestDistance) { bestDistance = distance; best = i; }
    }
    if (best < 0) return [text];
    return [text.slice(0, best), text.slice(best + 1)];
  }

  function smoothClosed(points) {
    var d = "M" + points[0].x.toFixed(2) + " " + points[0].y.toFixed(2);
    for (var i = 0; i < points.length; i++) {
      var p0 = points[(i - 1 + points.length) % points.length];
      var p1 = points[i];
      var p2 = points[(i + 1) % points.length];
      var p3 = points[(i + 2) % points.length];
      var c1x = p1.x + (p2.x - p0.x) / 6;
      var c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6;
      var c2y = p2.y - (p3.y - p1.y) / 6;
      d += " C" + c1x.toFixed(2) + " " + c1y.toFixed(2) + " " + c2x.toFixed(2) + " " + c2y.toFixed(2) + " " + p2.x.toFixed(2) + " " + p2.y.toFixed(2);
    }
    return d + " Z";
  }

  function drawConstellation() {
    if (!constellation) return;
    var cx = 260, cy = 260;
    var defs = svgEl("defs");
    var grad = svgEl("linearGradient", { id: "constellation-fill", x1: "0", y1: "0", x2: "1", y2: "1" });
    grad.appendChild(svgEl("stop", { offset: "0", "stop-color": "#e9b9a0", "stop-opacity": "0.26" }));
    grad.appendChild(svgEl("stop", { offset: "0.55", "stop-color": "#bcb0cf", "stop-opacity": "0.12" }));
    grad.appendChild(svgEl("stop", { offset: "1", "stop-color": "#93a68c", "stop-opacity": "0.16" }));
    defs.appendChild(grad);
    constellation.appendChild(defs);

    [232, 180, 122, 64].forEach(function (r, index) {
      constellation.appendChild(svgEl("circle", {
        cx: cx, cy: cy, r: r,
        "class": index === 2 ? "orbit-dash" : "orbit"
      }));
    });

    for (var t = 0; t < 72; t++) {
      var angle = (t / 72) * Math.PI * 2;
      var long = t % 6 === 0;
      var a = polar(cx, cy, 234, angle);
      var b = polar(cx, cy, long ? 242 : 238, angle);
      constellation.appendChild(svgEl("line", {
        x1: a.x.toFixed(2), y1: a.y.toFixed(2), x2: b.x.toFixed(2), y2: b.y.toFixed(2),
        "class": "tick", opacity: long ? "0.9" : "0.45"
      }));
    }

    var positions = FEATURES.map(function (feature, index) {
      var angle = -Math.PI / 2 + (index / FEATURES.length) * Math.PI * 2;
      var radius = 84 + feature.value * 86;
      return polar(cx, cy, radius, angle);
    });

    FEATURES.forEach(function (feature, index) {
      var angle = -Math.PI / 2 + (index / FEATURES.length) * Math.PI * 2;
      var outer = polar(cx, cy, 238, angle);
      constellation.appendChild(svgEl("line", {
        x1: cx, y1: cy, x2: outer.x.toFixed(2), y2: outer.y.toFixed(2), "class": "spoke"
      }));
    });

    constellation.appendChild(svgEl("path", {
      d: smoothClosed(positions), "class": "shape", fill: "url(#constellation-fill)"
    }));

    var sweep = svgEl("line", {
      x1: cx, y1: cy, x2: cx, y2: 24, "class": "sweep"
    });
    constellation.appendChild(sweep);

    var origin = svgEl("g");
    origin.appendChild(svgEl("circle", { cx: cx, cy: cy, r: 50, "class": "origin-ring" }));
    origin.appendChild(svgEl("circle", { cx: cx, cy: cy, r: 42, "class": "origin-inner" }));
    var number = svgEl("text", { x: cx, y: cy + 4, "class": "origin-number" });
    number.textContent = "17";
    origin.appendChild(number);
    var caption = svgEl("text", { x: cx, y: cy + 18, "class": "origin-caption" });
    caption.textContent = "SINAIS";
    origin.appendChild(caption);
    constellation.appendChild(origin);

    FEATURES.forEach(function (feature, index) {
      var angle = -Math.PI / 2 + (index / FEATURES.length) * Math.PI * 2;
      var point = positions[index];
      var group = svgEl("g", {
        "class": "node" + (index === activeFeature ? " is-active" : ""),
        tabindex: "0",
        role: "button",
        "aria-label": feature.label + ", valor " + num.format(feature.value),
        "data-index": String(index)
      });
      group.style.setProperty("--dot", GROUPS[feature.group] || "#c07150");
      group.appendChild(svgEl("circle", { cx: point.x.toFixed(2), cy: point.y.toFixed(2), r: 17, "class": "node-halo" }));
      group.appendChild(svgEl("circle", { cx: point.x.toFixed(2), cy: point.y.toFixed(2), r: 4.2, "class": "node-dot" }));
      var title = svgEl("title");
      title.textContent = feature.label + " — " + num.format(feature.value);
      group.appendChild(title);
      var lx = cx + Math.cos(angle) * 198;
      var ly = cy + Math.sin(angle) * 226;
      var lines = splitLabel(feature.short);
      lines.forEach(function (line, lineIndex) {
        var offset = lines.length === 1 ? 0 : (lineIndex === 0 ? -4.3 : 4.3);
        var label = svgEl("text", {
          x: lx.toFixed(2),
          y: (ly + offset).toFixed(2),
          "class": "node-label",
          "text-anchor": "middle",
          "dominant-baseline": "middle"
        });
        label.textContent = line;
        group.appendChild(label);
      });
      constellation.appendChild(group);
      nodes.push(group);
      group.addEventListener("click", function () { selectFeature(index); });
      group.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectFeature(index);
        }
      });
      group.addEventListener("pointerenter", function () { group.classList.add("is-hover"); });
      group.addEventListener("pointerleave", function () { group.classList.remove("is-hover"); });
    });
  }

  function selectFeature(index) {
    activeFeature = index;
    nodes.forEach(function (node, i) { node.classList.toggle("is-active", i === index); });
    var feature = FEATURES[index];
    var signal = $("#ai-signal");
    var description = $("#ai-signal-desc");
    var value = $("#ai-signal-value");
    var tag = readout ? $(".tag-label", readout) : null;
    if (readout) {
      readout.style.setProperty("--group-color", GROUPS[feature.group] || "#c07150");
      readout.classList.remove("is-swapping");
      void readout.offsetWidth;
      readout.classList.add("is-swapping");
    }
    if (tag) tag.textContent = feature.group + " · sinal " + (index + 1) + "/17";
    if (signal) signal.textContent = feature.label;
    if (description) description.textContent = feature.desc;
    if (value) value.textContent = num.format(feature.value);
  }

  drawConstellation();
  if (nodes.length) selectFeature(0);

  /* ------------------------------------------------------------ perfis de jogo */
  var GAMES = {
    dayz: {
      name: "DayZ", family: "survival · servidor dedicado", status: "mod autorizado",
      speed: 7.2, unit: "m/s", ml: false,
      rules: [
        ["velocidade", "7,2 m/s", true], ["vertical", "2,2 m", true],
        ["mira", "ativa", true], ["alcance", "fora do perfil", false],
        ["quebra / construção", "não se aplica", false], ["IA comportamental", "regras ativas", true]
      ],
      note: "Distância de arma não é alcance de braço. O perfil desliga a regra de reach e mantém velocidade, vertical e mira — sem inventar comparação com Minecraft.",
      event: { type: "join", player: "p1", name: "Fulano", game: "dayz", machine: "ks1-exemplo", t: 0 }
    },
    cs2: {
      name: "Counter-Strike 2 / CS:GO", family: "shooter · servidor comunitário", status: "comunidade / dedicado",
      speed: 6.4, unit: "m/s", ml: false,
      rules: [
        ["velocidade", "6,4 m/s", true], ["vertical", "1,7 m", true],
        ["mira", "ativa", true], ["alcance", "fora do perfil", false],
        ["quebra / construção", "não se aplica", false], ["IA comportamental", "regras ativas", true]
      ],
      note: "Servidor comunitário ou dedicado com telemetria autorizada. O Sentinel não entra em servidor oficial da Valve e não substitui o VAC. Comparar com o VAC exige telemetria rotulada dos dois lados — sem isso, superioridade seria marketing, não medição.",
      event: { type: "join", player: "p1", name: "Fulano", game: "cs2", machine: "ks1-exemplo", t: 0 }
    },
    infestation: {
      name: "Infestation: The New Z", family: "survival · servidor privado", status: "ponte autorizada",
      speed: 6.4, unit: "m/s", ml: false,
      rules: [
        ["velocidade", "6,4 m/s", true], ["vertical", "2,0 m", true],
        ["mira", "ativa", true], ["alcance", "fora do perfil", false],
        ["quebra / construção", "não se aplica", false], ["IA comportamental", "regras ativas", true]
      ],
      note: "Perfil pensado para servidor privado com uma ponte de eventos autorizada. A telemetria continua sendo do operador, não um hook no cliente oficial.",
      event: { type: "join", player: "p1", name: "Fulano", game: "infestation", machine: "ks1-exemplo", t: 0 }
    },
    pubg: {
      name: "PUBG / shooters táticos", family: "shooter · servidor próprio", status: "servidor próprio",
      speed: 7.4, unit: "m/s", ml: false,
      rules: [
        ["velocidade", "7,4 m/s", true], ["vertical", "2,4 m", true],
        ["mira", "ativa", true], ["alcance", "fora do perfil", false],
        ["quebra / construção", "não se aplica", false], ["IA comportamental", "regras ativas", true]
      ],
      note: "Somente servidor próprio ou autorizado. Servidor oficial não aceita telemetria externa, e o Sentinel não faz bypass do anti-cheat de terceiros.",
      event: { type: "join", player: "p1", name: "Fulano", game: "pubg", machine: "ks1-exemplo", t: 0 }
    },
    cod: {
      name: "Call of Duty / arena", family: "shooter · servidor autorizado", status: "servidor autorizado",
      speed: 8.0, unit: "m/s", ml: false,
      rules: [
        ["velocidade", "8,0 m/s", true], ["vertical", "2,6 m", true],
        ["mira", "ativa", true], ["alcance", "fora do perfil", false],
        ["quebra / construção", "não se aplica", false], ["IA comportamental", "regras ativas", true]
      ],
      note: "Servidor dedicado sob seu controle. Perfis de arma podem calibrar alcance de dano sem confundir com reach de braço.",
      event: { type: "join", player: "p1", name: "Fulano", game: "cod", machine: "ks1-exemplo", t: 0 }
    },
    battlefield: {
      name: "Battlefield / large-scale", family: "shooter · telemetria própria", status: "telemetria própria",
      speed: 8.4, unit: "m/s", ml: false,
      rules: [
        ["velocidade", "8,4 m/s", true], ["vertical", "3,0 m", true],
        ["mira", "ativa", true], ["alcance", "fora do perfil", false],
        ["quebra / construção", "não se aplica", false], ["IA comportamental", "regras ativas", true]
      ],
      note: "Perfil para servidor com telemetria própria. Não é integração oficial; a ponte de eventos é responsabilidade de quem opera a instância.",
      event: { type: "join", player: "p1", name: "Fulano", game: "battlefield", machine: "ks1-exemplo", t: 0 }
    },
    minecraft: {
      name: "Minecraft (referência)", family: "sandbox · servidor dedicado", status: "IA calibrada",
      speed: 6.2, unit: "bloco/s", ml: true,
      rules: [
        ["velocidade", "6,2 b/s", true], ["vertical", "1,2 bloco", true],
        ["mira", "ativa", true], ["alcance", "3,65 / 4,8 blocos", true],
        ["quebra / construção", "ativa", true], ["IA comportamental", "calibrada · 17 sinais", true]
      ],
      note: "Perfil do adaptador de referência. É o único com o modelo treinado neste dataset; os demais rodam regras até existir telemetria rotulada.",
      event: { type: "join", player: "p1", name: "Fulano", game: "minecraft", machine: "ks1-exemplo", t: 0 }
    },
    generic: {
      name: "Genérico (m/s)", family: "qualquer jogo · configurável", status: "configurável",
      speed: 6.5, unit: "m/s", ml: false,
      rules: [
        ["velocidade", "6,5 m/s", true], ["vertical", "2,0 m", true],
        ["mira", "ativa", true], ["alcance", "fora do perfil", false],
        ["quebra / construção", "não se aplica", false], ["IA comportamental", "regras ativas", true]
      ],
      note: "Base para um jogo novo: ajuste as velocidades, o alcance e as regras no arquivo de perfil. O protocolo de eventos continua o mesmo.",
      event: { type: "join", player: "p1", name: "Fulano", game: "generic", machine: "ks1-exemplo", t: 0 }
    }
  };

  var gameChips = $$(".game-chip");
  var gameDetail = $("#game-detail");
  var currentGame = "dayz";

  function prettyEvent(event) {
    return JSON.stringify(event)
      .replace(',"game"', ',\n "game"')
      .replace(',"machine"', ',\n "machine"');
  }

  function renderGame(key) {
    var game = GAMES[key] || GAMES.generic;
    currentGame = key;
    gameChips.forEach(function (chip) {
      var active = chip.getAttribute("data-game") === key;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (!gameDetail) return;
    $("#game-family").textContent = game.family;
    $("#game-name").textContent = game.name;
    var status = $("#game-status");
    status.innerHTML = "<i></i>" + game.status;
    status.classList.toggle("is-off", key === "generic");
    $("#game-speed").textContent = game.speed.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    $("#game-unit").textContent = game.unit;
    var percent = clamp((game.speed / 10) * 100, 28, 92);
    $("#game-gauge-fill").style.width = percent + "%";
    var mark = $(".gauge-mark");
    if (mark) mark.style.left = percent + "%";
    var rules = $("#game-rules");
    rules.innerHTML = game.rules.map(function (rule) {
      return '<div class="rule' + (rule[2] ? "" : " is-off") + '">' +
        "<span>" + rule[0] + "</span>" +
        "<strong>" + rule[1] + "</strong>" +
        '<i class="rule-state">' + (rule[2] ? (rule[0].indexOf("IA") === 0 ? (game.ml ? "calibrada" : "regras") : "ativo") : "desligada") + "</i>" +
        "</div>";
    }).join("");
    $("#game-note").textContent = game.note;
    var pre = $("#event-example");
    if (pre) {
      var code = pre.querySelector("code") || pre;
      code.textContent = prettyEvent(game.event);
    }
    gameDetail.classList.remove("is-swapping");
    void gameDetail.offsetWidth;
    gameDetail.classList.add("is-swapping");
  }

  gameChips.forEach(function (chip, index) {
    chip.addEventListener("click", function () { renderGame(chip.getAttribute("data-game")); });
    chip.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = gameChips[(index + 1) % gameChips.length];
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = gameChips[(index - 1 + gameChips.length) % gameChips.length];
      if (next) {
        event.preventDefault();
        next.focus();
        renderGame(next.getAttribute("data-game"));
      }
    });
  });

  renderGame("dayz");

  /* ------------------------------------------------------------ caso de ban */
  var CASES = {
    registro: '<dl class="case-grid">' +
      "<div><dt>máquina</dt><dd><code>ks1-4f8f4c1d…7a9d</code></dd></div>" +
      "<div><dt>operador</dt><dd>dono do servidor</dd></div>" +
      "<div><dt>motivo</dt><dd>alcance impossível + mira instantânea</dd></div>" +
      "<div><dt>quando</dt><dd>29 out 2026 · 14:16 UTC</dd></div>" +
      "<div><dt>caso</dt><dd><code>BAN-2026-0184</code></dd></div>" +
      "<div><dt>expira</dt><dd>permanente · revisável</dd></div></dl>" +
      '<div class="case-seal" aria-hidden="true"><span>K</span><small>KONAET<br>SENTINEL</small></div>',
    porque: '<dl class="case-grid">' +
      "<div><dt>alcance p95</dt><dd><code>6,4 m</code> contra 3,65 m do perfil</dd></div>" +
      "<div><dt>limite instantâneo</dt><dd><code>5,5 m</code> · pico de 6,9 m</dd></div>" +
      "<div><dt>alvos em 1,6 s</dt><dd><code>17</code> alvos distintos</dd></div>" +
      "<div><dt>pico de giro</dt><dd><code>3.420°/s</code></dd></div>" +
      "<div><dt>janelas da IA</dt><dd>3 de 3 acima de 0,98</dd></div>" +
      "<div><dt>regra que disparou</dt><dd>reach + snap de mira</dd></div></dl>" +
      '<div class="case-seal" aria-hidden="true"><span>K</span><small>KONAET<br>SENTINEL</small></div>',
    direitos: '<dl class="case-grid">' +
      "<div><dt>apelação</dt><dd>canal do operador, com o caso</dd></div>" +
      "<div><dt>revisão</dt><dd>humana · sem prazo automático</dd></div>" +
      "<div><dt>o que é mostrado</dt><dd>motivo, evidência e máquina</dd></div>" +
      "<div><dt>retenção</dt><dd>hash + alerta · 180 dias</dd></div>" +
      "<div><dt>nova instalação</dt><dd>não apaga o registro anterior</dd></div>" +
      "<div><dt>escopo</dt><dd>somente este servidor</dd></div></dl>" +
      '<div class="case-seal" aria-hidden="true"><span>K</span><small>KONAET<br>SENTINEL</small></div>'
  };
  var caseTabs = $$(".case-tab");
  var caseBody = $("#case-body");
  var caseLens = $("#case-lens");

  function moveCaseLens(tab) {
    if (!caseLens || !tab) return;
    caseLens.style.width = tab.offsetWidth + "px";
    caseLens.style.transform = "translateX(" + tab.offsetLeft + "px)";
  }

  function selectCase(key, tab) {
    if (!caseBody) return;
    caseTabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });
    caseBody.innerHTML = CASES[key] || CASES.registro;
    caseBody.style.animation = "none";
    void caseBody.offsetWidth;
    caseBody.style.animation = "";
    moveCaseLens(tab);
  }

  caseTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectCase(tab.getAttribute("data-case"), tab); });
    tab.addEventListener("keydown", function (event) {
      var next = null;
      if (event.key === "ArrowRight") next = caseTabs[(index + 1) % caseTabs.length];
      if (event.key === "ArrowLeft") next = caseTabs[(index - 1 + caseTabs.length) % caseTabs.length];
      if (next) {
        event.preventDefault();
        next.focus();
        selectCase(next.getAttribute("data-case"), next);
      }
    });
  });
  if (caseTabs.length) moveCaseLens(caseTabs[0]);

  /* ------------------------------------------------------------ escudo */
  var shield = $("#shield-switch");
  var shieldOn = true;

  function sparkPath(seed, wild) {
    var width = 66, height = 20, points = [];
    for (var i = 0; i < 15; i++) {
      var base = wild ? 10 + Math.sin(i * 1.9 + seed) * 6 + (i % 4 === 0 ? 5 : 0) : 11 + Math.sin(i * 0.9 + seed) * 1.7;
      points.push([i * (width / 14), clamp(base, 2, 18)]);
    }
    var d = "M" + points[0][0].toFixed(1) + " " + points[0][1].toFixed(1);
    for (var p = 1; p < points.length; p++) {
      var prev = points[p - 1], cur = points[p];
      var mx = (prev[0] + cur[0]) / 2;
      d += " C" + mx.toFixed(1) + " " + prev[1].toFixed(1) + " " + mx.toFixed(1) + " " + cur[1].toFixed(1) + " " + cur[0].toFixed(1) + " " + cur[1].toFixed(1);
    }
    return '<svg viewBox="0 0 66 20" aria-hidden="true"><path d="' + d + '" fill="none" stroke="' +
      (wild ? "#9b543a" : "#64775d") + '" stroke-width="1.15" stroke-linecap="round" opacity="' + (wild ? "0.75" : "0.65") + '"/></svg>';
  }

  function paintSparks(wild) {
    [1, 2, 3, 4].forEach(function (n) {
      var box = $("#demo-spark-" + n);
      if (box) box.innerHTML = sparkPath(n * 1.7, wild);
    });
  }

  function renderShield() {
    if (!shield) return;
    shield.setAttribute("aria-checked", shieldOn ? "true" : "false");
    var state = $("#demo-state");
    if (state) {
      state.innerHTML = "<i></i>" + (shieldOn ? "protegido" : "exposto");
      state.classList.toggle("is-off", !shieldOn);
    }
    var damage = $("#demo-damage");
    if (damage) {
      damage.textContent = shieldOn ? "0,0" : "87,4";
      damage.classList.toggle("is-hot", !shieldOn);
    }
    var hits = $("#demo-hits");
    if (hits) hits.textContent = shieldOn ? "12" : "0";
    $("#demo-combat").textContent = shieldOn ? "isolado" : "aberto";
    $("#demo-match").textContent = shieldOn ? "segue jogando" : "perdida";
    $("#demo-command").textContent = shieldOn ? "cancel_hits · quarantine_combat" : "nenhum comando aplicado";
    var note = $("#demo-note");
    if (note) {
      note.textContent = shieldOn
        ? "Exemplo ilustrativo. O adaptador decide como aplicar cada comando."
        : "Sem escudo, o dano do adversário sinalizado chega à partida. O Sentinel continua registrando evidência.";
    }
    paintSparks(!shieldOn);
  }

  if (shield) {
    var toggleShield = function () {
      shieldOn = !shieldOn;
      renderShield();
    };
    shield.addEventListener("click", toggleShield);
    shield.addEventListener("keydown", function (event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        toggleShield();
      }
    });
    renderShield();
  }

  /* ------------------------------------------------------------ copiar */
  var COPY = {
    train: "python -m sentinel train --seed 20261029",
    dns: null,
    event: null
  };

  function copyText(text, button) {
    var done = function () {
      if (!button) return;
      if (!button.dataset.html) button.dataset.html = button.innerHTML;
      button.textContent = "copiado";
      setTimeout(function () {
        button.innerHTML = button.dataset.html;
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        legacyCopy(text);
        done();
      });
    } else {
      legacyCopy(text);
      done();
    }
  }

  function legacyCopy(text) {
    var helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try { document.execCommand("copy"); } catch (err) { /* o texto permanece visível */ }
    document.body.removeChild(helper);
  }

  $$("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var kind = button.getAttribute("data-copy");
      var text = COPY[kind];
      if (kind === "event" || kind === "dns") {
        text = JSON.stringify((GAMES[currentGame] || GAMES.generic).event);
      }
      if (!text) return;
      copyText(text, button);
    });
  });

  /* ------------------------------------------------------------ PIX */
  var CFG = window.KONAET || {};
  var PIX = CFG.pix || {};
  var PLANS = CFG.plans || {};
  var modal = $("#checkout");
  var form = $("#pix-form");
  var emailInput = $("#pix-email");
  var machineInput = $("#pix-machine");
  var warning = $("#pix-warning");
  var submit = $("#pix-submit");
  var result = $("#pix-result");
  var qrBox = $("#pix-qr");
  var codeBox = $("#pix-code");
  var orderOut = $("#pix-order");
  var emailOut = $("#pix-email-out");
  var whats = $("#pix-whatsapp");
  var copyBtn = $("#pix-copy");
  var currentPlan = "pro";
  var currentOrder = "";
  var currentPayload = "";
  var lastFocus = null;
  var money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function crc16(text) {
    var bytes = new TextEncoder().encode(text);
    var crc = 0xFFFF;
    for (var i = 0; i < bytes.length; i++) {
      crc ^= bytes[i] << 8;
      for (var bit = 0; bit < 8; bit++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  function field(tag, value) {
    if (value.length > 99) throw new Error("Campo " + tag + " acima de 99 caracteres.");
    return tag + String(value.length).padStart(2, "0") + value;
  }

  function normalizeText(value, limit, keepCase) {
    var text = String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9 .-]/g, "")
      .trim()
      .replace(/\s+/g, " ");
    if (!keepCase) text = text.toUpperCase();
    if (!text) throw new Error("Texto obrigatório vazio.");
    return text.slice(0, limit);
  }

  function amount2(value) {
    var number = Number(value);
    if (!isFinite(number) || number <= 0 || number > 999999.99) throw new Error("Valor fora da faixa.");
    return number.toFixed(2);
  }

  function brcode(options) {
    var key = String(options.key || "").trim();
    if (!key || key.length > 77) throw new Error("Chave PIX ausente ou acima de 77 caracteres.");
    var merchant = field("00", "br.gov.bcb.pix") + field("01", key);
    var txid = String(options.txid || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";
    var payload = "000201" +
      field("26", merchant) +
      "52040000" +
      "5303986" +
      field("54", amount2(options.amount)) +
      "5802BR" +
      field("59", normalizeText(options.merchant, 25)) +
      field("60", normalizeText(options.city, 15)) +
      field("62", field("05", txid)) +
      "6304";
    return payload + crc16(payload);
  }

  function validBrcode(payload) {
    if (payload.length < 12 || payload.indexOf("000201") !== 0 || payload.slice(-8, -4) !== "6304") return false;
    return crc16(payload.slice(0, -4)) === payload.slice(-4).toUpperCase();
  }

  function setWarning(message, withContact) {
    if (!warning) return;
    warning.textContent = "";
    if (!message) { warning.hidden = true; return; }
    warning.append(message + " ");
    if (withContact) {
      var link = document.createElement("a");
      link.href = (CFG.contact && CFG.contact.whatsapp) || "#";
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Falar no WhatsApp";
      link.style.color = "inherit";
      link.style.textDecoration = "underline";
      warning.append(link);
    }
    warning.hidden = false;
  }

  function applyPlan() {
    var plan = PLANS[currentPlan] || PLANS.pro;
    if (!plan) return;
    $("#checkout-title").textContent = plan.title;
    $("#checkout-desc").textContent = plan.desc;
    $("#checkout-price").textContent = money.format(plan.price);
    if (result) result.hidden = true;
    currentOrder = "";
    currentPayload = "";
    if (qrBox) qrBox.textContent = "";
  }

  function openCheckout(plan) {
    if (!modal) return;
    currentPlan = PLANS[plan] ? plan : "pro";
    applyPlan();
    lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var key = String(PIX.key || "").trim();
    if (!key) {
      setWarning("O PIX deste site ainda não foi configurado, então nenhuma cobrança pode ser gerada.", true);
      if (submit) {
        submit.disabled = true;
        submit.textContent = "PIX não configurado";
      }
    } else {
      setWarning("");
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Gerar PIX";
      }
    }
    setTimeout(function () { if (emailInput) emailInput.focus(); }, 80);
  }

  function closeCheckout() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function newOrder(prefix) {
    var stamp = Date.now().toString(36).toUpperCase().slice(-8);
    var rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    return String(prefix + stamp + rand).replace(/[^A-Z0-9]/g, "").slice(0, 25);
  }

  function summaryText(plan, order, email, machine) {
    var lines = [
      "Olá! Enviei o PIX do Konaet Sentinel.",
      "Pedido: " + order,
      "Plano: " + plan.title + " — " + money.format(plan.price),
      "E-mail para a chave: " + email
    ];
    if (machine) lines.push("Máquina: " + machine);
    lines.push("Segue o comprovante em anexo.");
    return lines.join("\n");
  }

  function renderQr(payload) {
    if (!qrBox) return;
    qrBox.textContent = "";
    if (typeof window.QRCode !== "function") {
      var fallback = document.createElement("p");
      fallback.textContent = "QR indisponível sem a biblioteca. Use o código copia e cola.";
      fallback.style.cssText = "color:#211e19;font-size:10px;padding:8px;text-align:center";
      qrBox.appendChild(fallback);
      return;
    }
    new window.QRCode(qrBox, {
      text: payload,
      width: 154,
      height: 154,
      colorDark: "#211e19",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.M
    });
  }

  function buildSummaryButton(plan, order, email, machine) {
    var existing = $("#pix-summary-copy");
    if (existing) existing.remove();
    if (!whats) return;
    var button = document.createElement("button");
    button.type = "button";
    button.id = "pix-summary-copy";
    button.className = "btn btn-glass wide";
    button.style.marginTop = "8px";
    button.textContent = "Copiar resumo do pedido";
    button.addEventListener("click", function () {
      copyText(summaryText(plan, order, email, machine), button);
    });
    whats.after(button);
  }

  function onSubmit(event) {
    event.preventDefault();
    var plan = PLANS[currentPlan] || PLANS.pro;
    if (!plan) return;
    var email = emailInput.value.trim();
    var machine = machineInput.value.trim();
    if (!email || (emailInput.checkValidity && !emailInput.checkValidity())) {
      setWarning("Informe um e-mail válido para receber a chave.", false);
      emailInput.focus();
      return;
    }
    try {
      var order = newOrder(plan.txidPrefix || "KSNT");
      var payload = brcode({
        key: PIX.key,
        merchant: PIX.merchant || "KONAET",
        city: PIX.city || "SAO PAULO",
        amount: plan.price,
        txid: order
      });
      if (!validBrcode(payload)) throw new Error("O BR Code gerado não passou na verificação de CRC.");
      currentOrder = order;
      currentPayload = payload;
      codeBox.value = payload;
      orderOut.textContent = order;
      emailOut.textContent = email;
      renderQr(payload);
      result.hidden = false;
      setWarning("");
      var number = String((CFG.contact && CFG.contact.whatsappNumber) || "").replace(/\D/g, "");
      if (number) {
        whats.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(summaryText(plan, order, email, machine));
      } else {
        whats.href = (CFG.contact && CFG.contact.whatsapp) || "https://wa.me/";
      }
      buildSummaryButton(plan, order, email, machine);
      result.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    } catch (err) {
      setWarning("Não foi possível gerar o PIX: " + err.message, true);
      result.hidden = true;
    }
  }

  $$("[data-plan]").forEach(function (button) {
    button.addEventListener("click", function () { openCheckout(button.getAttribute("data-plan")); });
  });

  if (modal) {
    var closeBtn = $("#checkout-close");
    if (closeBtn) closeBtn.addEventListener("click", closeCheckout);
    modal.addEventListener("click", function (event) { if (event.target === modal) closeCheckout(); });
    modal.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      var focusable = $$('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])', modal).filter(function (el) {
        return !el.disabled && el.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("open")) closeCheckout();
    });
    if (form) form.addEventListener("submit", onSubmit);
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (currentPayload) copyText(currentPayload, copyBtn);
      });
    }
  }

  /* Exposto para o teste de vetor contra sentinel/pix.py. Não altera o checkout. */
  window.KonaetPix = { crc16: crc16, brcode: brcode, validate: validBrcode };
})();
