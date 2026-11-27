/* ============================================================
   WEDDING CONFIG — the ONLY file you need to edit for content.
   Ubah isi di bawah ini, simpan, commit, push. Selesai.
   ============================================================ */
window.WEDDING = {
  // ---- Couple -------------------------------------------------
  groom: {
    name: "Ridwan",           // short name shown on the cover
    fullName: "Ridwan Syah",   // full name in the couple section
    father: "Ahmad Fadli",     // Groom's father
    mother: "Normawati"       // Groom's mother
  },
  bride: {
    name: "Shiva",
    fullName: "Shiva Ullya",
    father: "Abri Susanto",   // optional – leave "" to hide
    mother: "Agustina Missa"
  },

  // ---- Event --------------------------------------------------
  // ISO 8601 with timezone offset. Jakarta/WIB = +07:00, Makassar/WITA = +08:00, Jayapura/WIT = +09:00
  dateTime: "2026-11-29T07:30:00+07:00",
  durationHours: 4,                       // used for the calendar entry end time
  dateTimeLabel: "Minggu, 29 November 2026 · 07.30 – 11.30 WIB",                   // pretty text shown to guests, mis. "Sabtu, 23 Januari 2027 · 10.00 WIB"
  venueName: "Dapoer Nusantara",                       // e.g. "The Grand Ballroom"
  venueAddress: "Jl. Letnan Jendral Sutoyo, Parit Tokaya, Kec. Pontianak Sel., Kota Pontianak, Kalimantan Barat",                    // full address; also used for the Google Maps link
  mapsUrl: "https://maps.app.goo.gl/QDxCewfQKWHBSkYe6",   // link Google Maps yang dibuka saat alamat diklik
  mapsQuery: "Dapoer Nusantara, Jl. Letnan Jendral Sutoyo, Parit Tokaya, Pontianak Selatan",  // dipakai untuk peta tersemat                          // (opsional)
  eventTitle: "",                         // empty = auto "Wedding of <groom> & <bride>"
  calendarDescription: "Dengan penuh kebahagiaan kami mengundang Anda ke pernikahan kami. Kehadiran dan doa restu Anda sangat berarti bagi kami.",

  // ---- Texts (edit freely) -----------------------------------
  text: {
    coverKicker: "Undangan Pernikahan",
    coverGuestLabel: "Kepada Yth.",
    coverGuestDefault: "Tamu Undangan",   // shown when link has no ?to=
    openButton: "Buka Undangan",
    coupleIntro: "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami mengundang Anda ke pernikahan",
    sonOf: "Putra dari",
    daughterOf: "Putri dari",
    countdownTitle: "Menuju Hari Bahagia",
    saveTheDate: "Simpan Tanggal",
    saveTheDateHint: "Ketuk untuk simpan ke Google Kalender",
    eventTitle: "Detail Acara",
    mapsButton: "Buka di Google Maps",
    rsvpTitle: "RSVP",
    rsvpIntro: "Mohon konfirmasi kehadiran Anda.",
    closingText: "Merupakan kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Terima kasih atas cinta dan doa yang diberikan.",
    closingSign: "Salam hangat,"
  },

  // ---- RSVP backend ------------------------------------------
  // Paste your deployed Google Apps Script Web App URL (ends with /exec)
  rsvpEndpoint: "",

  // ---- Media (files live in /assets). Missing files are skipped gracefully. ----
  media: {
    cover: "cover.jpg",
    couple: "couple.jpg",
    video: "preweddingvideo.mp4",      // optional short muted loop (<= 8 MB recommended)
    videoPoster: "video-poster.jpg",
    music: "music.mp3",
    gallery: [
      "gallery-1.jpg",
      "gallery-2.jpg",
      "gallery-3.jpg",
      "gallery-4.jpg",
      "gallery-5.jpg",
      "gallery-6.jpg"
    ]
  }
};
