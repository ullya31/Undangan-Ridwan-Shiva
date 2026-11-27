(function () {
  "use strict";
  var W = window.WEDDING, T = W.text;
  var $ = function (id) { return document.getElementById(id); };
  var set = function (id, v) { var el = $(id); if (el) el.textContent = v; };

  /* ---------- Helpers ---------- */
  var q = new URLSearchParams(location.search);
  var guest = (q.get("to") || "").trim().slice(0, 60);
  var weddingDate = new Date(W.dateTime);
  var endDate = new Date(weddingDate.getTime() + (W.durationHours || 3) * 3600e3);
  var title = W.eventTitle || ("Pernikahan " + W.groom.name + " & " + W.bride.name);
  var mapsQuery = W.mapsQuery || W.venueAddress;

  function gcalStamp(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function parents(p) { return [p.father, p.mother].filter(Boolean).join(" & "); }

  /* ---------- Fill content ---------- */
  document.title = title;
  set("coverKicker", T.coverKicker);
  set("coverGroom", W.groom.name);
  set("coverBride", W.bride.name);
  set("coverGuestLabel", T.coverGuestLabel);
  set("guestName", guest || T.coverGuestDefault);
  set("openBtn", T.openButton);

  set("coupleIntro", T.coupleIntro);
  set("groomFull", W.groom.fullName);
  set("brideFull", W.bride.fullName);
  set("groomSonOf", T.sonOf);
  set("brideDaughterOf", T.daughterOf);
  set("groomParents", parents(W.groom));
  set("brideParents", parents(W.bride));
  if (!parents(W.bride)) $("brideDaughterOf").parentNode.hidden = true;

  set("countdownTitle", T.countdownTitle);
  set("eventTitle", T.eventTitle);
  set("saveTheDate", T.saveTheDate);
  set("dateLabel", W.dateTimeLabel);
  set("saveHint", T.saveTheDateHint);
  set("venueName", W.venueName);
  set("venueAddress", W.venueAddress);
  set("mapsHint", T.mapsButton);
  set("mapsBtn", T.mapsButton);
  set("rsvpTitle", T.rsvpTitle);
  set("rsvpIntro", T.rsvpIntro);
  set("closingText", T.closingText);
  set("closingSign", T.closingSign);
  set("closingNames", W.groom.name + " & " + W.bride.name);

  /* ---------- Google Calendar & Maps links ---------- */
  var calUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(title) +
    "&dates=" + gcalStamp(weddingDate) + "/" + gcalStamp(endDate) +
    "&details=" + encodeURIComponent(W.calendarDescription) +
    "&location=" + encodeURIComponent((W.venueName ? W.venueName + ", " : "") + W.venueAddress);
  $("dateLink").href = calUrl;

  var mapsUrl = W.mapsUrl || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapsQuery));
  $("venueLink").href = mapsUrl;
  $("mapsBtn").href = mapsUrl;
  $("mapFrame").src = "https://maps.google.com/maps?q=" + encodeURIComponent(mapsQuery) + "&output=embed";

  /* ---------- Media (graceful if file is missing) ---------- */
  function exists(src, ok, fail) {
    var im = new Image(); im.onload = ok; im.onerror = fail || function () {}; im.src = src;
  }
  var M = W.media;
  exists(M.cover, function () { $("coverBg").style.backgroundImage = "url('" + M.cover + "')"; });

  exists(M.couple, function () {
    $("coupleImg").src = M.couple; $("portrait").hidden = false;
    if (M.video) {
      var v = $("heroVideo");
      v.poster = M.videoPoster || "";
      fetch(M.video, { method: "HEAD" }).then(function (r) {
        if (!r.ok) return;
        v.src = M.video; v.hidden = false;
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { v.play().catch(function () {}); } else { v.pause(); } });
        }, { threshold: .4 });
        io.observe(v);
        v.addEventListener("playing", function () { $("coupleImg").style.opacity = 0; });
      }).catch(function () {});
    }
  }, function () {
    // no couple photo: still show video if present
    if (!M.video) return;
    fetch(M.video, { method: "HEAD" }).then(function (r) {
      if (!r.ok) return;
      var v = $("heroVideo"); v.src = M.video; $("portrait").hidden = false;
      $("coupleImg").remove();
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? v.play().catch(function () {}) : v.pause(); });
      }, { threshold: .4 });
      io.observe(v);
    }).catch(function () {});
  });

  var grid = $("galleryGrid"), gCount = 0;
  (M.gallery || []).forEach(function (src) {
    exists(src, function () {
      var img = document.createElement("img");
      img.src = src; img.alt = "Foto pra-wedding"; img.loading = "lazy"; img.decoding = "async";
      grid.appendChild(img); gCount++; $("gallerySection").hidden = false;
    });
  });

  /* ---------- Open invitation + music ---------- */
  var bgm = $("bgm"), musicBtn = $("musicBtn");
  function setMusicUI(playing) { musicBtn.classList.toggle("paused", !playing); }

  fetch(M.music, { method: "HEAD" }).then(function (r) {
    if (r.ok) { bgm.src = M.music; musicBtn.hidden = false; setMusicUI(false); }
  }).catch(function () {});

  $("openBtn").addEventListener("click", function () {
    $("cover").classList.add("open");
    $("main").hidden = false;
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    if (bgm.src) { bgm.play().then(function () { setMusicUI(true); }).catch(function () { setMusicUI(false); }); }
    initReveal();
  });
  musicBtn.addEventListener("click", function () {
    if (bgm.paused) { bgm.play(); setMusicUI(true); } else { bgm.pause(); setMusicUI(false); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !bgm.paused) { bgm.pause(); bgm.dataset.auto = "1"; }
    else if (!document.hidden && bgm.dataset.auto) { bgm.play().catch(function () {}); delete bgm.dataset.auto; }
  });

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Countdown ---------- */
  var pad = function (n) { return String(n).padStart(2, "0"); };
  function tick() {
    var diff = weddingDate - new Date();
    if (isNaN(diff)) return;
    if (diff <= 0) { $("timer").hidden = true; $("cdDone").hidden = false; return; }
    var s = Math.floor(diff / 1000);
    $("cdD").textContent = pad(Math.floor(s / 86400));
    $("cdH").textContent = pad(Math.floor(s % 86400 / 3600));
    $("cdM").textContent = pad(Math.floor(s % 3600 / 60));
    $("cdS").textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- RSVP ---------- */
  var form = $("rsvpForm"), msg = $("rsvpMsg"), btn = $("rsvpBtn");
  if (guest) $("fName").value = guest;

  form.addEventListener("change", function (e) {
    if (e.target.name === "attendance") $("guestsWrap").hidden = e.target.value !== "Attending";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "form-msg"; msg.textContent = "";
    var fd = new FormData(form);
    var name = (fd.get("name") || "").trim();
    if (!name) { msg.className = "form-msg err"; msg.textContent = "Mohon isi nama Anda."; return; }
    if (fd.get("website")) return; // honeypot
    if (!W.rsvpEndpoint) { msg.className = "form-msg err"; msg.textContent = "RSVP belum dikonfigurasi."; return; }

    var attending = fd.get("attendance") === "Attending";
    var payload = {
      name: name,
      attendance: fd.get("attendance"),
      guests: attending ? Number(fd.get("guests")) : 0,
      message: (fd.get("message") || "").trim(),
      invitedAs: guest
    };
    btn.disabled = true; btn.textContent = "Mengirim…";

    // text/plain avoids a CORS pre-flight, which Apps Script cannot answer.
    fetch(W.rsvpEndpoint, { method: "POST", body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || "failed");
        msg.className = "form-msg ok";
        msg.textContent = "Terima kasih! RSVP Anda telah kami terima.";
        form.reset(); $("guestsWrap").hidden = false;
        if (guest) $("fName").value = guest;
      })
      .catch(function () {
        msg.className = "form-msg err";
        msg.textContent = "Maaf, terjadi kesalahan. Silakan coba lagi.";
      })
      .finally(function () { btn.disabled = false; btn.textContent = "Kirim RSVP"; });
  });
})();
