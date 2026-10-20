
/* ================================================
   AGPC MINISTRIES — EDITORIAL TABS
================================================ */

const ministryPanels = {
    fellowship: {
        youth: {
            title: {
                en: "Find your people.",
                zh: "找到属于你的群体。"
            },
            description: {
                en: "Discover a community where you can build friendships and grow in faith.",
                zh: "在团契中建立友谊，在信仰中一同成长。"
            }
        },
        "young-adults": {
            title: {
                en: "Grow through every season.",
                zh: "在人生不同阶段一同成长。"
            },
            description: {
                en: "Build meaningful friendships and journey together in faith.",
                zh: "建立有意义的友谊，在信仰道路上彼此同行。"
            }
        },
        evening: {
            title: {
                en: "Faith beyond Sunday.",
                zh: "让信仰延伸到主日以外。"
            },
            description: {
                en: "Discover fellowship and community through evening gatherings.",
                zh: "透过晚堂聚会建立团契，彼此连结。"
            }
        }
    },

    music: {
        worship: {
            title: {
                en: "Many voices, one song.",
                zh: "众声合一，同颂赞美。"
            },
            description: {
                en: "Our worship team, choir and pianists use their musical gifts to enrich worship.",
                zh: "敬拜团、诗班和司琴运用音乐恩赐，丰富崇拜。"
            }
        },
        "music-education": {
            title: {
                en: "Learn, serve and make music.",
                zh: "学习音乐，以音乐服事。"
            },
            description: {
                en: "Music education helps children and adults develop their musical skills and fellowship together.",
                zh: "音乐教育帮助儿童及成人提升音乐技能，在学习中服事并建立团契。"
            }
        }
    },

    education: {
        "sunday-school": {
            title: {
                en: "Growing in God's Word.",
                zh: "在上帝的话语中成长。"
            },
            description: {
                en: "Explore opportunities to learn about the Bible and grow in faith.",
                zh: "透过圣经学习，在信仰中不断成长。"
            }
        },
        "bible-study": {
            title: {
                en: "Discover more together.",
                zh: "一同探索信仰真理。"
            },
            description: {
                en: "Learn from Scripture and grow in understanding alongside others.",
                zh: "与他人一同研读圣经，加深对信仰的认识。"
            }
        }
    },

    "student-care": {
        programme: {
            title: {
                en: "A supportive place to grow.",
                zh: "安心学习，快乐成长。"
            },
            description: {
                en: "Our centre supports Primary 1 to Primary 6 students from Monday to Friday, 1:30 pm to 6:30 pm.",
                zh: "中心为小一至小六学生提供托管服务，开放时间为星期一至星期五，下午1:30至6:30。"
            }
        },
        activities: {
            title: {
                en: "Learning by doing.",
                zh: "从实践中学习。"
            },
            description: {
                en: "Activities include holiday sign language training, cookery sessions, cultural lessons and creative programmes.",
                zh: "活动包括假期手语培训、烹饪课程、文化学习及创意活动。"
            }
        },
        registration: {
            title: {
                en: "Let's get you started.",
                zh: "欢迎了解报名详情。"
            },
            description: {
                en: "P1 registration is currently listed as open. For enquiries, call 6556 2492 or 9234 0810. Please confirm current availability before applying.",
                zh: "目前页面列明小一报名开放。如需查询，请致电6556 2492或9234 0810。申请前请先确认最新名额。"
            }
        }
    },

    "prayer-care": {
        prayer: {
            title: {
                en: "You are not alone.",
                zh: "你并不孤单。"
            },
            description: {
                en: "Discover opportunities to seek prayer and encouragement within the church community.",
                zh: "在教会群体中寻求代祷与鼓励。"
            }
        },
        "pastoral-care": {
            title: {
                en: "Care for one another.",
                zh: "彼此关怀。"
            },
            description: {
                en: "Our pastoral care ministry seeks to encourage and support members.",
                zh: "牧养关怀事工致力于鼓励和支持会众。"
            }
        }
    },

    outreach: {
        local: {
            title: {
                en: "Serve right where you are.",
                zh: "从身边开始服事。"
            },
            description: {
                en: "AGPC supports local community care, gospel outreach and programmes for welcoming newcomers.",
                zh: "嘉恩堂参与社区关怀、福音外展，并透过相关事工关怀新朋友。"
            }
        },
        missions: {
            title: {
                en: "A wider world, a shared mission.",
                zh: "放眼世界，同负宣教使命。"
            },
            description: {
                en: "AGPC supports mission work in Cambodia, Australia, Thailand and Myanmar, as described on the existing page.",
                zh: "嘉恩堂支持柬埔寨、澳洲、泰国及缅甸的宣教工作。"
            }
        }
    }
};

function getEditorialLanguage() {
    const selected = document.querySelector(
        '.lang-toggle-option.is-active'
    );

    return selected?.dataset.lang === "zh" ? "zh" : "en";
}

function updateEditorialPanel(button) {
    const ministry = button.dataset.ministry;
    const panelKey = button.dataset.panel;
    const content = ministryPanels[ministry]?.[panelKey];

    if (!content) return;

    const section = button.closest(".editorial-section");
    const panel = section?.querySelector(".editorial-panel");

    if (!panel) return;

    const title = panel.querySelector("[data-panel-title]");
    const description = panel.querySelector(
        "[data-panel-description]"
    );

    const lang = getEditorialLanguage();

    title.textContent = content.title[lang];
    description.textContent = content.description[lang];

    section.querySelectorAll(".editorial-tab").forEach(tab => {
        const active = tab === button;

        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
    });
}


/* ================================================
   INITIALISE EDITORIAL TABS
================================================ */

document.querySelectorAll(".editorial-section").forEach(section => {
    const tabs = section.querySelectorAll(".editorial-tab");

    tabs.forEach(button => {
        button.addEventListener("click", () => {
            updateEditorialPanel(button);
        });
    });

    // Select the active tab, or the first tab by default
    const activeTab = section.querySelector(
        ".editorial-tab.is-active"
    ) || tabs[0];

    if (activeTab) {
        updateEditorialPanel(activeTab);
    }
});

