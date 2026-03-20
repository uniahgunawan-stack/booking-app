
import { object, string, coerce, array } from "zod"; 


export const RoomSchema = object ({
    name: string().min(1),
    description: string().min(50),
    capacity: coerce.number().gt(0),
    price:coerce.number().gt(0),
    amenities: array(string()).nonempty(),
    stock: coerce.number().min(1, "Stock kamar minimal 1").max(5,"Melebihi batas kapasitas 5 "),
})

export const ReserveSchema = object ({
    name: string().min(1),
    phone: string().min(10),
    
})

export const ContactSchema = object ({
    name: string().min(4, "name at least 4 Characters"),
    email: string().min(6, "Email to short").email("Invalid email format"),
    subject: string().min(6, "name at least 6 Characters"),
    message: string().min(50, "message at least 50 characters.").max(200, "message maximun 200 characters")
});



