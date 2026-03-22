
import z, { object, string, coerce, array } from "zod"; 


export const RoomSchema = object ({
    name: string().min(1),
    description: string().min(50),
    capacity: coerce.number().gt(0),
    price:coerce.number().gt(0),
    amenities: array(string()).nonempty(),
    stock: coerce.number().min(1, "Stock kamar minimal 1").max(5,"Melebihi batas kapasitas 5 "),
})

export const ReserveSchema = object ({
    name: string().min(4, "Please enter your name, minimum 4 characters."),
    phone: string().min(10,"Please enter number phone").max(13, "At maximum 13 characters"),
    
})

export const ContactSchema = object ({
    name: string().min(4, "name at least 4 Characters"),
    email: string().min(6, "Email to short").email("Invalid email format"),
    subject: string().min(6, "name at least 6 Characters"),
    message: string().min(50, "message at least 50 characters.").max(200, "message maximun 200 characters")
});

export const SignupSchema = object({
    name: z.string().min(4, "Name at least 4 Characters"),
    email: z.string().min(6,"Email to Short"),
    password: z.string().min(7, "Password at least  Characters"),
    confirmPassword: z.string().min(7, "Password at least  Characters")
}).refine((data) => data.password === data.confirmPassword, {
    message:"Password does not match",
    path:["confirmPassword"]
})
export const SigninSchema = object({
    email: string().min(6,"Email to Short"),
    password: string().min(7, "Password at least  Characters")
})



