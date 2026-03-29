import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import {PaymentProps} from "@/type/payment"


export const POST =async (request:Request) => {
    const data: PaymentProps =  await request.json()
    const reservationId =  data.order_id;

    let responseData =  null

    const transactionStatus = data.transaction_status;
    const paymenType =  data.payment_type || null;
    const fraudStatus =  data.fraud_status;
    const statuCode =  data.status_code;
    const grosAmont =  data.gross_amount;
    const signatureKey =  data.signature_key;

    const hash = crypto.createHash("sha512").update(`${reservationId}${statuCode}${grosAmont}
        ${process.env.MIDTRANS_SERVER_KEY}`).digest("hex")

        if (signatureKey !== hash)
            return NextResponse.json({error: "Mising signature key"},{status:400 })

        let newStatus = "pending";
        if (transactionStatus === "settlement") newStatus = "paid";
        else if ( transactionStatus === "capture") {
            if (fraudStatus === "accept") newStatus = "paid";
            else if (fraudStatus === "challenge") newStatus = "challenge";
            else if (fraudStatus === "deny") newStatus = "failed";
            else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
                newStatus = "failed"
            }
        }



        try {
            await prisma.$transaction( async(tx) => {
            const paymentBefore = await tx.payment.findUnique({
                where: {reservationId},
                include: {Reservation: {include: {Room: true}}}
            }); 
            if (!paymentBefore) throw new Error (`Payment ${reservationId} tidak di temukan`)

                await tx.payment.update({
                    where: {reservationId},
                    data: {
                        method: paymenType,
                        status: newStatus,
                    }
                });
                const room = paymentBefore.Reservation?.Room;
                if (newStatus === "paid" && paymentBefore.status !== "paid" && room) {
                    if (room.stock > 0){
                        await tx.room.update({
                            where: {id: room.id},
                            data: { stock: {decrement: 1}}
                        })
                    } else if (["failed", "challenge"].includes(newStatus) && paymentBefore.status ===
                "paid" && room) {
                    await tx.room.update ({
                        where: {id: room.id},
                        data: {stock: {increment: 1}}
                    })
                }} return NextResponse.json({
                    success:true,
                    status: newStatus
                },{status: 200})
        });
        } catch (error) {
             return NextResponse.json({responseData}, {status: 200})
        }
        

        

        // if(transactionStatus == "capture") {
        //     if (fraudStatus == "accept") {
        //         const transaction =  await prisma.payment.update({
        //             data: {
        //                 method: paymenType,
        //                 status:"paid"
        //             },
        //             where: {reservationId}
        //         })
        //         responseData = transaction
        //     }
        // } else if (transactionStatus == "settlement") {
        //     const transaction =  await prisma.payment.update({
        //             data: {
        //                 method: paymenType,
        //                 status:"paid"
        //             },
        //             where: {reservationId}
        //         })
        //         responseData = transaction
        // } else if (transactionStatus == "cencel" || transactionStatus == "deny" || transactionStatus ==
        //     "expire"
        // ) {
        //     const transaction =  await prisma.payment.update({
        //             data: {
        //                 method: paymenType,
        //                 status:"failure"
        //             },
        //             where: {reservationId}
        //         })
        //         responseData = transaction
        // } else if (transactionStatus == "pending") {
        //      const transaction =  await prisma.payment.update({
        //             data: {
        //                 method: paymenType,
        //                 status:"pending"
        //             },
        //             where: {reservationId}
        //         })
        //         responseData = transaction
        // }
       
}








// export const POST = async (request: Request) => {
//     console.log("🚀 [MIDTRANS] WEBHOOK DITERIMA!");

//     try {
//         const body = await request.json();
//         console.log("📦 Body lengkap dari Midtrans:", JSON.stringify(body, null, 2));

//         const {
//             order_id: reservationId,
//             transaction_status,
//             payment_type,
//             fraud_status,
//             status_code,
//             gross_amount,
//             signature_key,
//         } = body;

//         if (!reservationId) {
//             console.error("❌ Missing order_id");
//             return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
//         }

//         console.log(`🔑 Reservation ID: ${reservationId} | Status: ${transaction_status} | Payment Type: ${payment_type || "null"}`);

//         // === SIGNATURE VERIFICATION ===
//         const grossAmountStr = gross_amount.toString().replace(/[^0-9]/g, "");
//         const hashString = `${reservationId}${status_code}${grossAmountStr}${process.env.MIDTRANS_SERVER_KEY}`;
//         const hash = crypto.createHash("sha512").update(hashString).digest("hex");

//         if (signature_key !== hash) {
//             console.error("❌ Invalid signature!");
//             return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//         }

//         console.log("✅ Signature valid");

//         // === Tentukan status baru ===
//         let newStatus = "pending";
//         if (transaction_status === "settlement") newStatus = "paid";
//         else if (transaction_status === "capture") {
//             if (fraud_status === "accept") newStatus = "paid";
//             else if (fraud_status === "challenge") newStatus = "challenge";
//             else if (fraud_status === "deny") newStatus = "failed";
//         } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
//             newStatus = "failed";
//         }

//         console.log(`🔄 Akan update status menjadi: ${newStatus}`);

//         // === TRANSACTION PRISMA ===
//         await prisma.$transaction(async (tx) => {
//             const paymentBefore = await tx.payment.findUnique({
//                 where: { reservationId },
//                 include: { Reservation: { include: { Room: true } } }
//             });

//             if (!paymentBefore) throw new Error(`Payment ${reservationId} tidak ditemukan`);

//             await tx.payment.update({
//                 where: { reservationId },
//                 data: {
//                     method: payment_type || null,
//                     status: newStatus,
//                 }
//             });

//             const room = paymentBefore.Reservation?.Room;
//             if (newStatus === "paid" && paymentBefore.status !== "paid" && room) {
//                 if (room.stock > 0) {
//                     await tx.room.update({
//                         where: { id: room.id },
//                         data: { stock: { decrement: 1 } }
//                     });
//                     console.log(`✅ Stok ${room.name} dikurangi`);
//                 }
//             } else if (["failed", "challenge"].includes(newStatus) && paymentBefore.status === "paid" && room) {
//                 await tx.room.update({
//                     where: { id: room.id },
//                     data: { stock: { increment: 1 } }
//                 });
//                 console.log(`🔄 Stok ${room.name} dikembalikan (refund)`);
//             }
//         });

//         console.log(`🎉 BERHASIL update Payment → status: ${newStatus}, method: ${payment_type}`);
//         return NextResponse.json({ success: true, status: newStatus }, { status: 200 });

//     } catch (error) {
//         console.error("💥 Midtrans Webhook Error:", error);
//         return NextResponse.json({ success: false, error: (error as Error).message }, { status: 200 });
//     }
// };