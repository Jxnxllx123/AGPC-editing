// =========================================================
// 📖 SERMONS DATABASE — STAFF EDITS HERE ONLY
// =========================================================
//
// HOW TO ADD A NEW SERMON:
// 1. Copy one sermon object below (the { ... } block)
// 2. Paste it inside the sermons array, separated by commas
// 3. Change the title, pastor, date, language, and video URL
//
// NOTES:
// - Date format can be "8 Sept 2024" or any consistent readable format
// - lang values: "en" for English, "zh" for Chinese, "both" for bilingual
// - video must be a valid YouTube embed URL, e.g. "https://www.youtube.com/embed/VIDEO_ID"
//
// IMPORTANT:
//  Keep commas between items
//  Do NOT edit anything outside { }
//  Leave video empty "" if not uploaded yet
//
//SAMPLE FOR ENGLISH SERVICE:
//{
//    title: "Is it enough",              // Sermon title in English
//    pastor: "Pastor Joshua",                  // Name of the preacher
//    date: "27/09/2026",                    // Date of the sermon (format: DD MMM YYYY)
//    time: "11:00 - 12:30",
//    lang: "en",                            // Language: "en" (English)
//    video: "https://churchagpc-my.sharepoint.com/:v:/g/personal/joshua_lai_churchagpc_onmicrosoft_com/IQAbJUF4LzMYQ60WYqyX7xOcAUMuB3ZNeuAx0RPJk4ahSTM?e=OW4bZh"  // YouTube embed URL
//  },
//
//
//SAMPLE FOR CHINESE SERVICE:
//{
//    title: "你好吗",              // Sermon title in Chinese
//    pastor: "。。。牧师",                  // Name of the preacher
//    date: "27/09/2026",                    // Date of the sermon (format: DD MMM YYYY)
//    time: "9:00 - 10:30",
//    lang: "zh",                            // Language: "en" (English)
//    video: "https://churchagpc-my.sharepoint.com/:v:/g/personal/joshua_lai_churchagpc_onmicrosoft_com/IQAbJUF4LzMYQ60WYqyX7xOcAUMuB3ZNeuAx0RPJk4ahSTM?e=OW4bZh"  // YouTube embed URL
//  },
//
//
//SAMPLE FOR COMBINED SERVICE:
//{
//  title: {
//    en: "Is It Enough?",        // Sermon title in English
//    zh: "這樣就夠了嗎？"         // Sermon title in Chinese
//  },
//  pastor: {
//    en: "Pastor Joshua",        // Name of the preacher
//    zh: "約書亞牧師"             // Name of the preacher
//  },
//  date: "01/11/2026",           // Date of the sermon (format: D MMM YYYY)
//  time: "9:00 - 10:30",
//  lang: "both",             // Language: "both" (Both)
//  video: ""
//},
//
//
//
// =========================================================

console.log("SERMONS LOADED");

window.SERMONS = [
  {
    title: "Is it enough",              // Sermon title in English
    pastor: "Pastor Joshua",                  // Name of the preacher
    date: "27/09/2026",                    // Date of the sermon (format: D MMM YYYY)
    time: "11:00 - 12:30",
    lang: "en",                            // Language: "en" (English)
    video: "https://churchagpc-my.sharepoint.com/:v:/g/personal/joshua_lai_churchagpc_onmicrosoft_com/IQAbJUF4LzMYQ60WYqyX7xOcAUMuB3ZNeuAx0RPJk4ahSTM?e=OW4bZh"  // YouTube embed URL
  },

  
  
  //  ADD NEW SERMONS ABOVE THIS LINE ONLY
];

