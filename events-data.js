// =========================================================
// 📅 EVENTS DATABASE — STAFF EDITS HERE ONLY
// =========================================================
//
// HOW TO ADD EVENT:
// 1. Copy one event
// 2. Paste ABOVE the line
// 3. Edit the details
//
// =========================================================

console.log("EVENTS LOADED");

window.EVENTS = [

  // =======================================================
  // MONTHLY PRAYER
  // =======================================================

  {
    id: "monthly-prayer",

    title: {
      en: "Prayer Gathering",
      zh: "祷告聚会"
    },

    startDate: "2026-02-13",
    startTime: "20:00",
    endTime: "21:00",

    type: "recurring",
    recurrence: "monthly"
  },


  // =======================================================
  // YOUTH FELLOWSHIP
  // =======================================================

  {
    id: "youth-fellowship",

    title: {
      en: "Youth Fellowship",
      zh: "青年团契"
    },

    subtitle: {
      en: "Every Saturday (except 5th Saturdays)",
      zh: "每逢星期六（第五个星期六除外）"
    },

    startDate: "2026-02-07",
    startTime: "16:00",
    endTime: "18:00",

    type: "recurring",
    recurrence: "weekly",

    skipFifthSaturday: true
  },


  // =======================================================
  // JUNIOR YOUTH FELLOWSHIP
  // =======================================================

  {
    id: "junior-youth-fellowship",

    title: {
      en: "Junior Youth Fellowship",
      zh: "少年团契"
    },

    subtitle: {
      en: "Every Sunday",
      zh: "每逢星期日"
    },

    startDate: "2026-02-08",
    startTime: "13:00",
    endTime: "14:30",

    type: "recurring",
    recurrence: "weekly"
  },


  // =======================================================
  // CHOIR
  // =======================================================

  {
    id: "choir",

    title: {
      en: "Choir",
      zh: "诗班"
    },

    subtitle: {
      en: "Every Sunday",
      zh: "每逢星期日"
    },

    startDate: "2026-02-08",
    startTime: "13:00",
    endTime: "14:45",

    type: "recurring",
    recurrence: "weekly"
  },

  {
    id: "chinese-migrant-worker-meeting",

    title: {
      en: "Chinese Migrant Workers' Meeting",
      zh: "中国事工聚会"
    },

    subtitle: {
      en: "Every 2 weeks",
      zh: "每两周"
    },

    startDate: "2026-09-27",
    startTime: "13:00",
    endTime: "15:00",

    type: "recurring",
    recurrence: "biweekly"
  }



  // ⬆️ ADD NEW EVENTS ABOVE THIS LINE ONLY ⬆️

];
