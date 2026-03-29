import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tr } from "zod/locales";

export const getAmenities = async () => {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized Accses");
  }
  try {
    const result = await prisma.amenities.findMany();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getRoom = async () => {


  try {
    const result = await prisma.room.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getRoomById = async (roomId: string) => {

  try {
    const result = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        RoomAmenities: {
          select: {
            amenitiesId: true
          }
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};


export const getRoomDetailById = async (roomId: string) => {

  try {
    const result = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        RoomAmenities: {
          include: {
            Amenities: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getReservationById = async (id: string) => {

  try {
    const result = await prisma.reservation.findUnique({
      where: { id },
      include: {
        Room: {
          select: {
            name: true,
            image: true,
            price: true,
            stock: true
          }
        },
        User: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        },
        Payment: true
      }
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getDisableRoomById = async (roomId: string) => {

  try {
    const result = await prisma.reservation.findMany({
      select: {
        startdate: true,
        endDate: true,
      },
      where: {
        roomId: roomId,
        Payment: { status: { notIn:[ "failure","cancelled"] } }
      }
    })
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getReservationUserById = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unathorized Acces")
  }

  try {
    const now = new Date();

    const result = await prisma.reservation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        Room: { select: { name: true, image: true, price: true, id:true, stock: true } },
        User: { select: { name: true, email: true, phone: true } },
        Payment: true
      },
      orderBy:{createdAt:"desc"}
    });
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};


export const getRevenuAndReserve = async () => {

  try {
    const result = await prisma.reservation.aggregate({
      _count: true,
      _sum: { price: true },
      where: {

        Payment: { status: { not: "failur" } }
      },
    })
    return {
      revenue: result._sum.price || 0,
      reserve: result._count,
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTotalCustomers = async () => {
  try {
    const result = await prisma.reservation.findMany({
      distinct: ["userId"],
      where: {

        Payment: { status: { not: "failur" } }
      },
      select: { userId: true },
    })

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getReservations = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id || session.user.role !== "admin") {
    throw new Error("Unathorized Acces")
  }

  try {
    const result = await prisma.reservation.findMany({
      include: {
        Room: {
          select: {
            name: true,
            image: true,
            price: true
          }
        },
        User: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        },
        Payment: true
      },
      orderBy: { createdAt: "desc" }
    })
    return result;
  } catch (error) {
    console.log(error);
  }
};