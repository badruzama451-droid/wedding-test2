/* =====================================================
   OPENING
===================================================== */

const openButton =
    document.getElementById("openInvitation");

const opening =
    document.getElementById("opening");

const website =
    document.getElementById("website");


openButton.addEventListener("click", () => {

    opening.classList.add("transition");

    setTimeout(() => {

        website.classList.add("show");

    }, 450);


    setTimeout(() => {

        opening.classList.add("hide");

        document.body.classList.remove("locked");

    }, 1500);

});


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(".reveal");


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach((element) => {

    observer.observe(element);

});


/* =====================================================
   COUNTDOWN
===================================================== */

const walimaDate =
    new Date(
        "2026-11-06T19:00:00+05:30"
    ).getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const difference =
        walimaDate - now;


    if (difference <= 0) {

        document.getElementById("days")
            .textContent = "00";

        document.getElementById("hours")
            .textContent = "00";

        document.getElementById("minutes")
            .textContent = "00";

        document.getElementById("seconds")
            .textContent = "00";

        return;
    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                difference %
                (1000 * 60)
            ) /
            1000
        );


    document.getElementById("days")
        .textContent =
        String(days).padStart(2, "0");


    document.getElementById("hours")
        .textContent =
        String(hours).padStart(2, "0");


    document.getElementById("minutes")
        .textContent =
        String(minutes).padStart(2, "0");


    document.getElementById("seconds")
        .textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* =====================================================
   SET REMINDER
===================================================== */

const reminderButton =
    document.getElementById("reminderButton");


reminderButton.addEventListener(
    "click",
    () => {

        const eventData = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Walima Invitation//EN",
            "BEGIN:VEVENT",
            "UID:walima-faiz-dilkashan-2026@example.com",
            "DTSTAMP:20261003T070000Z",
            "DTSTART:20261106T190000",
            "DTEND:20261106T220000",
            "SUMMARY:Walima — Mohammad Faiz & Dilkashan Parveen",
            "LOCATION:City Marriage Hall, Urdu Bazar, Darbhanga, Bihar 846004",
            "DESCRIPTION:Walima celebration of Mohammad Faiz and Dilkashan Parveen.",
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");


        const blob =
            new Blob(
                [eventData],
                {
                    type:
                        "text/calendar;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "Walima-Mohammad-Faiz.ics";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        setTimeout(() => {

            URL.revokeObjectURL(url);

        }, 1000);

    }
);