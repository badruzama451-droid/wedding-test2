(() => {

    "use strict";


    /* =====================================================
       HELPERS + EVENT DETAILS
    ===================================================== */

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const root = document.documentElement;


    // 6 Nov 2026, 7:00 PM IST = 13:30 UTC
    const EVENT = {
        title: "Walima — Mohammad Faiz & Dilkashan Parveen",
        startUTC: "20261106T133000Z",
        endUTC: "20261106T163000Z",
        startMs: Date.parse("2026-11-06T19:00:00+05:30"),
        location: "City Marriage Hall, Urdu Bazar, Darbhanga, Bihar 846004",
        details:
            "Walima celebration of Mohammad Faiz and Dilkashan Parveen. " +
            "Friday, 6 November 2026 at 7:00 PM IST."
    };


    /* =====================================================
       GOLD DUST
    ===================================================== */

    const rand = (min, max) => Math.random() * (max - min) + min;

    if (!reduceMotion) {

        $$("[data-dust]").forEach((box) => {

            const count = parseInt(box.dataset.dust, 10) || 12;

            for (let i = 0; i < count; i++) {

                const speck = document.createElement("i");

                speck.style.cssText =
                    `left:${rand(2, 98).toFixed(1)}%;` +
                    `top:${rand(35, 98).toFixed(1)}%;` +
                    `--s:${rand(2, 4.6).toFixed(1)}px;` +
                    `--dx:${rand(-34, 34).toFixed(0)}px;` +
                    `--t:${rand(8, 15).toFixed(1)}s;` +
                    `--del:${(-rand(0, 15)).toFixed(1)}s;`;

                box.appendChild(speck);

            }

        });

    }


    /* =====================================================
       STAGGER ORDER FOR REVEAL GROUPS
    ===================================================== */

    const groups = $$(".reveal-group");

    groups.forEach((group) => {

        $$(".rise, .write", group).forEach((element, index) => {

            element.style.setProperty("--i", index);

        });

    });


    /* =====================================================
       OPENING
    ===================================================== */

    const openButton = $("#openInvitation");
    const opening = $("#opening");
    const website = $("#website");

    let revealsStarted = false;


    function startReveals() {

        if (revealsStarted) return;

        revealsStarted = true;

        if (!("IntersectionObserver" in window)) {

            groups.forEach((group) => group.classList.add("visible"));

            return;

        }

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },

            { threshold: 0.1 }

        );

        groups.forEach((group) => observer.observe(group));

    }


    openButton.addEventListener("click", () => {

        if (opening.classList.contains("transition")) return;

        const themeMeta = $('meta[name="theme-color"]');

        if (themeMeta) themeMeta.setAttribute("content", "#fcf9f3");

        opening.classList.add("transition");

        const speed = reduceMotion ? 0.2 : 1;

        setTimeout(() => {

            website.classList.add("show");

        }, 650 * speed);


        setTimeout(() => {

            opening.classList.add("hide");

            document.body.classList.remove("locked");

            window.scrollTo(0, 0);

            startReveals();

        }, 1700 * speed);

    });


    /* =====================================================
       SCROLL: PROGRESS BAR + PARALLAX
    ===================================================== */

    let ticking = false;

    function onScroll() {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {

            const y = window.scrollY || window.pageYOffset;

            const max = root.scrollHeight - window.innerHeight;

            root.style.setProperty(
                "--prog",
                max > 0 ? Math.min(y / max, 1).toFixed(4) : 0
            );

            if (!reduceMotion) {

                root.style.setProperty(
                    "--p",
                    Math.min(y / window.innerHeight, 4).toFixed(3)
                );

            }

            ticking = false;

        });

    }

    window.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", onScroll);

    onScroll();


    /* =====================================================
       COUNTDOWN
    ===================================================== */

    const countdownEls = {
        days: $("#days"),
        hours: $("#hours"),
        minutes: $("#minutes"),
        seconds: $("#seconds")
    };

    function setValue(element, value) {

        if (element.textContent === value) return;

        element.textContent = value;

        if (!reduceMotion) {

            element.classList.remove("tick");

            void element.offsetWidth;

            element.classList.add("tick");

        }

    }

    function updateCountdown() {

        const difference = EVENT.startMs - Date.now();

        if (difference <= 0) {

            Object.values(countdownEls).forEach((el) => {
                el.textContent = "00";
            });

            return;

        }

        const totalSeconds = Math.floor(difference / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => String(n).padStart(2, "0");

        setValue(countdownEls.days, pad(days));
        setValue(countdownEls.hours, pad(hours));
        setValue(countdownEls.minutes, pad(minutes));
        setValue(countdownEls.seconds, pad(seconds));

    }

    updateCountdown();

    setInterval(updateCountdown, 1000);


    /* =====================================================
       ADD REMINDER — calendar sheet
    ===================================================== */

    const reminderButton = $("#reminderButton");
    const sheet = $("#calendarSheet");
    const gcalLink = $("#gcalLink");
    const icsButton = $("#icsButton");

    let lastFocus = null;


    // Google Calendar link (works on Android, desktop and iOS browsers)

    gcalLink.href =
        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent(EVENT.title) +
        "&dates=" + EVENT.startUTC + "/" + EVENT.endUTC +
        "&details=" + encodeURIComponent(EVENT.details) +
        "&location=" + encodeURIComponent(EVENT.location);


    // .ics file (Apple Calendar, Outlook and others)

    function escapeText(text) {

        return text
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\n/g, "\\n");

    }

    function foldLine(line) {

        const parts = [];

        let rest = line;

        while (rest.length > 60) {

            parts.push(rest.slice(0, 60));

            rest = " " + rest.slice(60);

        }

        parts.push(rest);

        return parts.join("\r\n");

    }

    function buildICS() {

        const stamp =
            new Date()
                .toISOString()
                .replace(/[-:]/g, "")
                .replace(/\.\d{3}/, "");

        const lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Walima Invitation//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            "UID:walima-faiz-dilkashan-20261106@invitation",
            "DTSTAMP:" + stamp,
            "DTSTART:" + EVENT.startUTC,
            "DTEND:" + EVENT.endUTC,
            "SUMMARY:" + escapeText(EVENT.title),
            "LOCATION:" + escapeText(EVENT.location),
            "DESCRIPTION:" + escapeText(EVENT.details),
            "STATUS:CONFIRMED",
            "BEGIN:VALARM",
            "TRIGGER:-P1D",
            "ACTION:DISPLAY",
            "DESCRIPTION:Walima tomorrow at 7:00 PM",
            "END:VALARM",
            "BEGIN:VALARM",
            "TRIGGER:-PT3H",
            "ACTION:DISPLAY",
            "DESCRIPTION:Walima today at 7:00 PM",
            "END:VALARM",
            "END:VEVENT",
            "END:VCALENDAR"
        ];

        return lines.map(foldLine).join("\r\n") + "\r\n";

    }

    const isIOS =
        /iP(hone|ad|od)/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    function downloadICS() {

        const ics = buildICS();

        if (isIOS) {

            // iOS Safari ignores the download attribute; opening the
            // data URL shows the "Add to Calendar" screen instead.
            window.location.href =
                "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);

            return;

        }

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "Walima-Mohammad-Faiz.ics";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 2000);

    }


    // Sheet open / close

    function openSheet() {

        lastFocus = document.activeElement;

        sheet.classList.add("open");

        sheet.setAttribute("aria-hidden", "false");

        document.body.classList.add("sheet-open");

        setTimeout(() => gcalLink.focus(), 80);

    }

    function closeSheet() {

        sheet.classList.remove("open");

        sheet.setAttribute("aria-hidden", "true");

        document.body.classList.remove("sheet-open");

        if (lastFocus && lastFocus.focus) lastFocus.focus();

    }

    reminderButton.addEventListener("click", openSheet);

    icsButton.addEventListener("click", () => {

        downloadICS();

        setTimeout(closeSheet, 500);

    });

    gcalLink.addEventListener("click", () => {

        setTimeout(closeSheet, 300);

    });

    $$("[data-close]", sheet).forEach((element) => {

        element.addEventListener("click", closeSheet);

    });

    document.addEventListener("keydown", (event) => {

        if (!sheet.classList.contains("open")) return;

        if (event.key === "Escape") {

            closeSheet();

            return;

        }

        if (event.key === "Tab") {

            const focusable = $$("a[href], button", sheet)
                .filter((el) => el.offsetParent !== null);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {

                event.preventDefault();
                last.focus();

            } else if (!event.shiftKey && document.activeElement === last) {

                event.preventDefault();
                first.focus();

            }

        }

    });

})();