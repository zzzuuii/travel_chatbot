import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
 const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL!,
 });

 const prisma = new PrismaClient({ adapter });

 async function main() {
    const categories = [
        "Food",
        "Shopping",
        "Culture",
        "Activities",
        "Landmark",
        "Nature",
    ];

    for (const name of categories){
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    const gardens = await prisma.touristSpot.upsert({
        where: {
            name: "Gardens by the Bay",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.2816,
            longitude: 103.8636,
            recommendedTime: "Evening",
            priorityWeight: 80,
            area: "Marina Bay / Downtown",

            categories: {
                set: [
                    { name: "Landmark"},
                ],
            },
        },

        create: {
            name: "Gardens by the Bay",
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.2816,
            longitude: 103.8636,
            recommendedTime: "Evening",
            area: "Marina Bay / Downtown",

            categories: {
                connect: [
                { name: "Landmark" },
                ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                    touristSpotId: gardens.id,
                    dayOfWeek: day,
                },
            },

            update: {
                openTime: "05:00",
                closeTime: "02:00",
                closesNextDay: true,
                isClosed: false,
            },

            create: {
                touristSpotId: gardens.id,
                dayOfWeek: day,
                openTime: "05:00",
                closeTime: "02:00",
                closesNextDay: true,
                isClosed: false,
            },
        });
    }

    const mbs = await prisma.touristSpot.upsert({
        where: {
            name: "Marina Bay Sands - SkyPark Observation Deck",
        },

        update: {
            entranceFee: 39,
            stayMinutes: 60,
            latitude: 1.2834,
            longitude: 103.8607,
            recommendedTime: "Evening",
            priorityWeight: 80,
            area: "Marina Bay / Downtown",

            categories: {
                set: [
                    { name: "Landmark" },
                ],
            },
        },

        create: {
            name: "Marina Bay Sands - SkyPark Observation Deck",
            entranceFee: 39,
            stayMinutes: 60,
            latitude: 1.2834,
            longitude: 103.8607,
            recommendedTime: "Evening",
            area: "Marina Bay / Downtown",

            categories: {
                connect: [
                    { name: "Landmark" },
                ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                    touristSpotId: mbs.id,
                    dayOfWeek: day,
                },
            },

            update: {
                openTime: "09:30",
                closeTime: "22:00",
                closesNextDay: false,
                isClosed: false,
            },

            create: {
                touristSpotId: mbs.id,
                dayOfWeek: day,
                openTime: "09:30",
                closeTime: "22:00",
                closesNextDay: false,
                isClosed: false,
            },
        });
    }

    const merlion = await prisma.touristSpot.upsert({
        where: {
            name: "Merlion Park",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 30,
            latitude: 1.28668,
            longitude: 103.853607,
            recommendedTime: "Anytime",
            priorityWeight: 80,
            area: "Marina Bay / Downtown",

            categories: {
                set: [
                    { name: "Landmark" },
                ],
            },
        },

        create: {
            name: "Merlion Park",
            entranceFee: 0,
            stayMinutes: 30,
            latitude: 1.28668,
            longitude: 103.853607,
            recommendedTime: "Anytime",
            area: "Marina Bay / Downtown",

            categories: {
            connect: [
                { name: "Landmark" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                    touristSpotId: merlion.id,
                    dayOfWeek: day,
                },
            },
            update: {
                openTime: "00:00",
                closeTime: "23:59",
                closesNextDay: false,
                isClosed: false,
            },
            create: {
                touristSpotId: merlion.id,
                dayOfWeek: day,
                openTime: "00:00",
                closeTime: "23:59",
                closesNextDay: false,
                isClosed: false,
            },
        });
    }

    const lauPaSat = await prisma.touristSpot.upsert({
        where: {
            name: "Lau Pa Sat",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.2807,
            longitude: 103.8504,
            recommendedTime: "Evening",
            priorityWeight: 60,
            area: "Marina Bay / Downtown",

            categories: {
                set: [
                    { name: "Food" },
                    { name: "Culture" },
                    { name: "Landmark" },
                ],
            },
        },

        create: {
            name: "Lau Pa Sat",
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.2807,
            longitude: 103.8504,
            recommendedTime: "Evening",
            area: "Mandai",

            categories: {
                connect: [
                    { name: "Food" },
                    { name: "Culture" },
                    { name: "Landmark" },
                ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                    touristSpotId: lauPaSat.id,
                    dayOfWeek: day,
                },
            },
            update: {
                openTime: "00:00",
                closeTime: "23:59",
                closesNextDay: false,
                isClosed: false,
            },
            create: {
                touristSpotId: lauPaSat.id,
                dayOfWeek: day,
                openTime: "00:00",
                closeTime: "23:59",
                closesNextDay: false,
                isClosed: false,
            },
        });
    }

    // const tampinesMall = await prisma.touristSpot.upsert({
    //     where: {
    //         name: "Tampines Mall",
    //     },

    //     update: {
    //         entranceFee: 0,
    //         stayMinutes: 90,
    //         latitude: 1.3525047,
    //         longitude: 103.9446826,
    //         recommendedTime: "Afternoon",

    //         categories: {
    //             set: [
    //                 { name: "Shopping" },
    //             ],
    //         },
    //     },

    //     create: {
    //         name: "Tampines Mall",
    //         entranceFee: 0,
    //         stayMinutes: 90,
    //         latitude: 1.3525047,
    //         longitude: 103.9446826,
    //         recommendedTime: "Afternoon",

    //         categories: {
    //             connect: [
    //                 { name: "Shopping" },
    //             ],
    //         },
    //     },
    // });

    // for (let day = 0; day <= 6; day++) {
    //     await prisma.openingHour.upsert({
    //         where: {
    //             touristSpotId_dayOfWeek: {
    //                 touristSpotId: tampinesMall.id,
    //                 dayOfWeek: day,
    //             },
    //         },
    //         update: {
    //             openTime: "10:00",
    //             closeTime: "22:00",
    //             closesNextDay: false,
    //             isClosed: false,
    //         },
    //         create: {
    //             touristSpotId: tampinesMall.id,
    //             dayOfWeek: day,
    //             openTime: "10:00",
    //             closeTime: "22:00",
    //             closesNextDay: false,
    //             isClosed: false,
    //         },
    //     });
    // }

    const universalStudios = await prisma.touristSpot.upsert({
        where: {
            name: "Universal Studios Singapore",
        },

        update: {
            entranceFee: 76,
            stayMinutes: 360,
            latitude: 1.2540421,
            longitude: 103.8238084,
            recommendedTime: "Morning",
            priorityWeight: 50,
            area: "Sentosa",

            categories: {
                set: [
                    { name: "Activities" },
                    { name: "Landmark" },
                ],
            },
        },

        create: {
            name: "Universal Studios Singapore",
            entranceFee: 76,
            stayMinutes: 360,
            latitude: 1.2540421,
            longitude: 103.8238084,
            recommendedTime: "Morning",
            area: "Marina Bay / Downtown",

            categories: {
                connect: [
                    { name: "Activities" },
                    { name: "Landmark" },
                ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                    touristSpotId: universalStudios.id,
                    dayOfWeek: day,
                },
            },
            update: {
                openTime: "10:00",
                closeTime: "20:00",
                closesNextDay: false,
                isClosed: false,
            },
            create: {
                touristSpotId: universalStudios.id,
                dayOfWeek: day,
                openTime: "10:00",
                closeTime: "20:00",
                closesNextDay: false,
                isClosed: false,
            },
        });
    }

    const wildWildWet = await prisma.touristSpot.upsert({
        where: {
            name: "Wild Wild Wet",
        },

        update: {
            entranceFee: 39,
            stayMinutes: 300,
            latitude: 1.3778,
            longitude: 103.9543,
            recommendedTime: "Afternoon",
            priorityWeight: 50,
            area: "East Singapore",

            categories: {
                set: [
                    { name: "Activities" },
                ],
            },
        },

        create: {
            name: "Wild Wild Wet",
            entranceFee: 39,
            stayMinutes: 300,
            latitude: 1.3778,
            longitude: 103.9543,
            recommendedTime: "Afternoon",
            area: "Mandai",

            categories: {
                connect: [
                    { name: "Activities" },
                ],
            },
        },
    });
    const wildWildWetHours = [
        // Sunday
        { day: 0, openTime: "11:00", closeTime: "18:00", isClosed: false },

        // Monday
        { day: 1, openTime: "12:00", closeTime: "18:00", isClosed: false },

        // Tuesday
        { day: 2, openTime: null, closeTime: null, isClosed: true },

        // Wednesday
        { day: 3, openTime: "12:00", closeTime: "18:00", isClosed: false },

        // Thursday
        { day: 4, openTime: "12:00", closeTime: "18:00", isClosed: false },

        // Friday
        { day: 5, openTime: "12:00", closeTime: "18:00", isClosed: false },

        // Saturday
        { day: 6, openTime: "11:00", closeTime: "18:00", isClosed: false },
    ];

    for (const hour of wildWildWetHours) {
        await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                    touristSpotId: wildWildWet.id,
                    dayOfWeek: hour.day,
                },
            },

            update: {
                openTime: hour.openTime,
                closeTime: hour.closeTime,
                closesNextDay: false,
                isClosed: hour.isClosed,
            },

            create: {
                touristSpotId: wildWildWet.id,
                dayOfWeek: hour.day,
                openTime: hour.openTime,
                closeTime: hour.closeTime,
                closesNextDay: false,
                isClosed: hour.isClosed,
            },
        });
    }

    const nightSafari = await prisma.touristSpot.upsert({
        where: {
            name: "Night Safari",
        },

        update: {
            entranceFee: 58,
            stayMinutes: 180,
            latitude: 1.4023,
            longitude: 103.7879,
            recommendedTime: "Evening",
            priorityWeight: 50,
            area: "Mandai",

            categories: {
                set: [
                    { name: "Activities" },
                ],
            },
        },

        create: {
            name: "Night Safari",
            entranceFee: 58,
            stayMinutes: 180,
            latitude: 1.4023,
            longitude: 103.7879,
            recommendedTime: "Evening",
            area: "Mandai",

            categories: {
                connect: [
                    { name: "Activities" },
                ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                    touristSpotId: nightSafari.id,
                    dayOfWeek: day,
                },
            },

            update: {
                openTime: "18:00",
                closeTime: "00:00",
                closesNextDay: true,
                isClosed: false,
            },

            create: {
                touristSpotId: nightSafari.id,
                dayOfWeek: day,
                openTime: "18:00",
                closeTime: "00:00",
                closesNextDay: true,
                isClosed: false,
            },
        });
    }

    const bugisStreet = await prisma.touristSpot.upsert({
        where: {
            name: "Bugis Street",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 90,
            latitude: 1.3008,
            longitude: 103.8553,
            recommendedTime: "Afternoon",
            priorityWeight: 50,
            area: "Bugis / Kampong Glam",

            categories: {
            set: [
                { name: "Shopping" },
                { name: "Food" },
            ],
            },
        },

        create: {
            name: "Bugis Street",
            entranceFee: 0,
            stayMinutes: 90,
            latitude: 1.3008,
            longitude: 103.8553,
            recommendedTime: "Afternoon",
            area: "Marina Bay / Downtown",

            categories: {
            connect: [
                { name: "Shopping" },
                { name: "Food" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: bugisStreet.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "10:00",
            closeTime: "22:00",
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: bugisStreet.id,
            dayOfWeek: day,
            openTime: "10:00",
            closeTime: "22:00",
            closesNextDay: false,
            isClosed: false,
            },
        });
    }

    const hajiLane = await prisma.touristSpot.upsert({
        where: {
            name: "Haji Lane",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.3006,
            longitude: 103.8598,
            recommendedTime: "Afternoon",
            priorityWeight: 60,
            area: "Bugis / Kampong Glam",

            categories: {
            set: [
                { name: "Culture" },
                { name: "Shopping" },
                { name: "Food" },
            ],
            },
        },

        create: {
            name: "Haji Lane",
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.3006,
            longitude: 103.8598,
            recommendedTime: "Afternoon",
            area: "Marina Bay / Downtown",

            categories: {
            connect: [
                { name: "Culture" },
                { name: "Shopping" },
                { name: "Food" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: hajiLane.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "11:00",
            closeTime: "20:00",
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: hajiLane.id,
            dayOfWeek: day,
            openTime: "11:00",
            closeTime: "20:00",
            closesNextDay: false,
            isClosed: false,
            },
        });
    }   

    const botanicGardens = await prisma.touristSpot.upsert({
        where: {
            name: "Singapore Botanic Gardens",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 120,
            latitude: 1.3138,
            longitude: 103.8159,
            recommendedTime: "Morning",
            priorityWeight: 50,
            area: "Botanic Gardens / Tanglin",

            categories: {
            set: [
                { name: "Nature" },
                { name: "Landmark" },
            ],
            },
        },

        create: {
            name: "Singapore Botanic Gardens",
            entranceFee: 0,
            stayMinutes: 120,
            latitude: 1.3138,
            longitude: 103.8159,
            recommendedTime: "Morning",
            area: "Mandai",

            categories: {
            connect: [
                { name: "Nature" },
                { name: "Landmark" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: botanicGardens.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "05:00",
            closeTime: "00:00",
            closesNextDay: true,
            isClosed: false,
            },

            create: {
            touristSpotId: botanicGardens.id,
            dayOfWeek: day,
            openTime: "05:00",
            closeTime: "00:00",
            closesNextDay: true,
            isClosed: false,
            },
        });
    }

    const singaporeZoo = await prisma.touristSpot.upsert({
        where: {
            name: "Singapore Zoo",
        },

        update: {
            entranceFee: 49,
            stayMinutes: 240,
            latitude: 1.4043,
            longitude: 103.7930,
            recommendedTime: "Morning",
            priorityWeight: 50,
            area: "Mandai",

            categories: {
            set: [
                { name: "Nature" },
                { name: "Activities" },
            ],
            },
        },

        create: {
            name: "Singapore Zoo",
            entranceFee: 49,
            stayMinutes: 240,
            latitude: 1.4043,
            longitude: 103.7930,
            recommendedTime: "Morning",
            area: "Mandai",

            categories: {
            connect: [
                { name: "Nature" },
                { name: "Activities" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: singaporeZoo.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "08:30",
            closeTime: "18:00",
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: singaporeZoo.id,
            dayOfWeek: day,
            openTime: "08:30",
            closeTime: "18:00",
            closesNextDay: false,
            isClosed: false,
            },
        });
    }

    const singaporeOceanarium = await prisma.touristSpot.upsert({
        where: {
            name: "Singapore Oceanarium",
        },

        update: {
            entranceFee: 55,
            stayMinutes: 180,
            latitude: 1.2587,
            longitude: 103.8200,
            recommendedTime: "Afternoon",
            priorityWeight: 50,
            area: "Sentosa",

            categories: {
            set: [
                { name: "Nature" },
                { name: "Activities" },
            ],
            },
        },

        create: {
            name: "Singapore Oceanarium",
            entranceFee: 55,
            stayMinutes: 180,
            latitude: 1.2587,
            longitude: 103.8200,
            recommendedTime: "Afternoon",
            area: "Mandai",

            categories: {
            connect: [
                { name: "Nature" },
                { name: "Activities" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: singaporeOceanarium.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "10:00",
            closeTime: "20:00",
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: singaporeOceanarium.id,
            dayOfWeek: day,
            openTime: "10:00",
            closeTime: "20:00",
            closesNextDay: false,
            isClosed: false,
            },
        });
    }

    const adventureCove = await prisma.touristSpot.upsert({
        where: {
            name: "Adventure Cove Waterpark",
        },

        update: {
            entranceFee: 34,
            stayMinutes: 240,
            latitude: 1.2582,
            longitude: 103.8185,
            recommendedTime: "Morning",
            priorityWeight: 50,
            area: "Sentosa",

            categories: {
            set: [
                { name: "Activities" },
            ],
            },
        },

        create: {
            name: "Adventure Cove Waterpark",
            entranceFee: 34,
            stayMinutes: 240,
            latitude: 1.2582,
            longitude: 103.8185,
            recommendedTime: "Morning",
            area: "Mandai",

            categories: {
            connect: [
                { name: "Activities" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        const isSaturday = day === 6;

        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: adventureCove.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "10:00",
            closeTime: isSaturday ? "20:00" : "17:00",
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: adventureCove.id,
            dayOfWeek: day,
            openTime: "10:00",
            closeTime: isSaturday ? "20:00" : "17:00",
            closesNextDay: false,
            isClosed: false,
            },
        });
    }

    const satayByTheBay = await prisma.touristSpot.upsert({
        where: {
            name: "Satay by the Bay",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.28233,
            longitude: 103.8686,
            recommendedTime: "Evening",
            priorityWeight: 60,
            area: "Marina Bay / Downtown",

            categories: {
            set: [
                { name: "Food" },
            ],
            },
        },

        create: {
            name: "Satay by the Bay",
            entranceFee: 0,
            stayMinutes: 60,
            latitude: 1.28233,
            longitude: 103.8686,
            recommendedTime: "Evening",
            area: "Mandai",

            categories: {
            connect: [
                { name: "Food" },
            ],
            },
        },
    });

    const satayByTheBayHours = [
        // Sunday
        { day: 0, openTime: "09:00", closeTime: "22:30" },

        // Monday
        { day: 1, openTime: "11:30", closeTime: "22:00" },

        // Tuesday
        { day: 2, openTime: "11:30", closeTime: "22:00" },

        // Wednesday
        { day: 3, openTime: "11:30", closeTime: "22:00" },

        // Thursday
        { day: 4, openTime: "11:30", closeTime: "22:00" },

        // Friday
        { day: 5, openTime: "11:30", closeTime: "22:00" },

        // Saturday
        { day: 6, openTime: "09:00", closeTime: "22:30" },
    ];

    for (const hour of satayByTheBayHours) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: satayByTheBay.id,
                dayOfWeek: hour.day,
            },
            },

            update: {
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: satayByTheBay.id,
            dayOfWeek: hour.day,
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            closesNextDay: false,
            isClosed: false,
            },
        });
    }

    const chinatown = await prisma.touristSpot.upsert({
        where: {
            name: "Chinatown",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 90,
            latitude: 1.28416,
            longitude: 103.84320,
            recommendedTime: "Afternoon",
            priorityWeight: 50,
            area: "Chinatown",

            categories: {
            set: [
                { name: "Culture" },
                { name: "Food" },
                { name: "Shopping" },
            ],
            },
        },

        create: {
            name: "Chinatown",
            entranceFee: 0,
            stayMinutes: 90,
            latitude: 1.28416,
            longitude: 103.84320,
            recommendedTime: "Afternoon",
            area: "Mandai",

            categories: {
            connect: [
                { name: "Culture" },
                { name: "Food" },
                { name: "Shopping" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: chinatown.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "10:00",
            closeTime: "22:00",
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: chinatown.id,
            dayOfWeek: day,
            openTime: "10:00",
            closeTime: "22:00",
            closesNextDay: false,
            isClosed: false,
            },
        });
    }

    const clarkeQuay = await prisma.touristSpot.upsert({
        where: {
            name: "Clarke Quay",
        },

        update: {
            entranceFee: 0,
            stayMinutes: 90,
            latitude: 1.2906,
            longitude: 103.8465,
            recommendedTime: "Evening",
            priorityWeight: 60,
            area: "Civic District / Singapore River",

            categories: {
            set: [
                { name: "Food" },
                { name: "Culture" },
                { name: "Landmark" },
            ],
            },
        },

        create: {
            name: "Clarke Quay",
            entranceFee: 0,
            stayMinutes: 90,
            latitude: 1.2906,
            longitude: 103.8465,
            recommendedTime: "Evening",
            area: "Mandai",

            categories: {
            connect: [
                { name: "Food" },
                { name: "Culture" },
                { name: "Landmark" },
            ],
            },
        },
    });

    for (let day = 0; day <= 6; day++) {
        await prisma.openingHour.upsert({
            where: {
            touristSpotId_dayOfWeek: {
                touristSpotId: clarkeQuay.id,
                dayOfWeek: day,
            },
            },

            update: {
            openTime: "10:00",
            closeTime: "22:00",
            closesNextDay: false,
            isClosed: false,
            },

            create: {
            touristSpotId: clarkeQuay.id,
            dayOfWeek: day,
            openTime: "10:00",
            closeTime: "22:00",
            closesNextDay: false,
            isClosed: false,
            },
        });
    }

    const museums = [
        {
            name: "National Gallery Singapore",
            entranceFee: 20,
            stayMinutes: 180,
            latitude: 1.2903,
            longitude: 103.8519,
            recommendedTime: "Morning",
            area: "Civic District / Singapore River",
            priorityWeight: 50,
            categories: ["Culture"],
            openTime: "10:00",
            closeTime: "19:00",
            fridayCloseTime: "19:00",
        },

        {
            name: "National Museum of Singapore",
            entranceFee: 20,
            stayMinutes: 120,
            latitude: 1.2966,
            longitude: 103.8485,
            recommendedTime: "Afternoon",
            area: "Civic District / Singapore River",
            priorityWeight: 50,
            categories: ["Culture"],
            openTime: "10:00",
            closeTime: "19:00",
            fridayCloseTime: "19:00",
        },

        {
            name: "Asian Civilisations Museum",
            entranceFee: 15,
            stayMinutes: 120,
            latitude: 1.2875,
            longitude: 103.8513,
            recommendedTime: "Afternoon",
            area: "Civic District / Singapore River",
            priorityWeight: 50,
            categories: ["Culture"],
            openTime: "10:00",
            closeTime: "19:00",
            fridayCloseTime: "21:00",
        },

        {
            name: "Peranakan Museum",
            entranceFee: 18,
            stayMinutes: 90,
            latitude: 1.2944,
            longitude: 103.8493,
            recommendedTime: "Afternoon",
            area: "Civic District / Singapore River",
            priorityWeight: 50,
            categories: ["Culture"],
            openTime: "10:00",
            closeTime: "19:00",
            fridayCloseTime: "21:00",
        },
    ];

    for (const museum of museums) {
        const spot = await prisma.touristSpot.upsert({
            where: {
            name: museum.name,
            },

            update: {
            entranceFee: museum.entranceFee,
            stayMinutes: museum.stayMinutes,
            latitude: museum.latitude,
            longitude: museum.longitude,
            recommendedTime: museum.recommendedTime,
            area: museum.area,
            priorityWeight: museum.priorityWeight,

            categories: {
                set: museum.categories.map((name) => ({
                name,
                })),
            },
            },

            create: {
            name: museum.name,
            entranceFee: museum.entranceFee,
            stayMinutes: museum.stayMinutes,
            latitude: museum.latitude,
            longitude: museum.longitude,
            recommendedTime: museum.recommendedTime,
            area: museum.area,
            priorityWeight: museum.priorityWeight,
            
            categories: {
                connect: museum.categories.map((name) => ({
                name,
                })),
            },
            },
        });

        for (let day = 0; day <= 6; day++) {
            // 5 = Friday
            const closeTime =
            day === 5
                ? museum.fridayCloseTime
                : museum.closeTime;

            await prisma.openingHour.upsert({
            where: {
                touristSpotId_dayOfWeek: {
                touristSpotId: spot.id,
                dayOfWeek: day,
                },
            },

            update: {
                openTime: museum.openTime,
                closeTime: closeTime,
                closesNextDay: false,
                isClosed: false,
            },

            create: {
                touristSpotId: spot.id,
                dayOfWeek: day,
                openTime: museum.openTime,
                closeTime: closeTime,
                closesNextDay: false,
                isClosed: false,
            },
            });
        }
    }

    console.log("Seed completed!");
}

 main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });