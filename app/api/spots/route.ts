import prisma from "@/lib/prisma";

export async function GET(){
    const spots = await prisma.touristSpot.findMany({
        include: {
            categories: true,
            openingHours: true,
        },
    });

    return Response.json(spots);
}