"use client"

import { useActionState, useRef, useState, useTransition } from "react"
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5"
import Image from "next/image"
import { BarLoader } from "react-spinners"
import { Amenities } from "@prisma/client"
import { SaveRoom } from "@/lib/action"
import clsx from "clsx"

const CreateForm = ({ amenities }: { amenities: Amenities[] }) => {
    // // const [image, setImage] = useState('');
    // // const [loading, setLoading] = useState(false)
    // const [isTransitionPending, startTransition] = useTransition();
    // const [fileUpload, setFileUpload] = useState<File | null>(null);

    const [message, setMessage] = useState("");
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [state, formAction, isPending] = useActionState(SaveRoom,{
        prevState:null as any,
        message:'',
        
    });


    // const handleUpload = () => {
    //     if (!inputFileRef.current?.files) return null;
    //     const file = inputFileRef.current.files[0];
    //     const formData = new FormData();
    //     formData.set("file", file);

    //     startTransiton(async () => {
    //         try {
    //             const response = await fetch("/api/upload", {
    //                 method: "PUT",
    //                 body: formData
    //             });
    //             const data = await response.json();
    //             if (response.status !== 200) {
    //                 setMessage(data.message);

    //             }
    //             const img = data as PutBlobResult;
    //             setImage(img.url)
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     })
    // }

    // const deleteImage = (image: string) => {
    //     startTransiton(async () => {
    //         try {
    //             await fetch(`/api/upload/?imageUrl=${image}`, {
    //                 method: "DELETE",
    //             });
    //             setImage("");
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     })
    // };
    // const handleAction = async (formData: FormData) => {
    //     setLoading(true)
    //     let finalImageUrl = "";
    //     // if (!fileUpload) return ("File Image di perlukan")
    //     // else 
    //     if (fileUpload) {
    //         const uploadData = new FormData()
    //         uploadData.append("file", fileUpload)
    //         const res = await fetch("/api/upload", {
    //             method: "PUT",
    //             body: uploadData,
    //         });

    //         if (!res.ok) {
    //             const error = await res.json()
    //             setMessage(error.mesage || "Upload gagal")
    //             setLoading(false)
    //         }
    //         const blob = await res.json();
    //         finalImageUrl = blob.url
    //     }
    //     setLoading(false)
    //     formData.set("image", finalImageUrl);
    //     startTransition(() => {
    //         formAction(formData)
    //     })
    // }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;
        if (file.size > 4000000) {
            setMessage("File harus kurang dari 4MB")
        }
        if (!file.type.startsWith("image/")) {
            setMessage("Hanya Boleh Gambar jpg, png, gif")
            return
        }
        const localUrl = URL.createObjectURL(file)
        setPreviewUrl(localUrl)
        setMessage('')
    };


    const handleRemovePreview = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl('')
        if (inputFileRef.current) inputFileRef.current.value = ''
        setMessage("")
    }



    return (
        <form action={formAction}>
            {/* 1 */}
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-8 bg-white p-4 rounded-xl shadow-xl">
                    <div className="mb-4">
                        <input type="text"
                            name="name"
                            placeholder="Name Room.."
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.name}</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <textarea
                            name="description"
                            rows={8}
                            placeholder="Description.."
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full"></textarea>
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.description}</span>
                        </div>
                    </div>
                    <div className="mb-4 grid md:grid-cols-3">
                        {amenities.map((item) => (
                            <div className="flex items-center mb-4" key={item.id}>
                                <input type="checkbox"
                                    name="amenities"
                                    defaultValue={item.id}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <label
                                    className="ms-2 text-sm font-medium text-gray-900 capitalize"
                                >{item.name}
                                </label>
                            </div>
                        ))}
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.amenities}</span>
                        </div>
                    </div>
                </div>
                {/* 2 */}
                <div className="col-span-4 bg-white p-4 rounded-xl shadow-xl">
                    <label
                        htmlFor="input-file"
                        className="flex flex-col mb-4 items-center justify-center aspect-video border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 relative overflow-hidden"
                    >
                        <input
                            type="file"
                            id="input-file"
                            name="image"
                            ref={inputFileRef}
                            onChange={handleChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center text-gray-500 pt-5 pb-6 z-10 w-full h-full">
                            {isPending ? <BarLoader /> : null}

                            {previewUrl ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePreview()}
                                        className="flex items-center justify-center size-6 bg-red-400 rounded-sm absolute right-1 top-1 text-white hover:bg-red-500 z-20"
                                    >
                                        <IoTrashOutline className="size-4" />
                                    </button>
                                    <Image
                                        src={previewUrl}
                                        alt="imageroom"
                                        unoptimized
                                        width={640}
                                        height={360}
                                        className="absolute inset-0 w-full h-full object-cover rounded-md"
                                    />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <IoCloudUploadOutline className="size-8" />
                                    <p className="mb-1 text-sm font-bold">select image</p>
                                    {message ? (
                                        <p className="text-xs text-red-500">{message}</p>
                                    ) : (
                                        <p className="text-xs">SVG, JPG, PNG, GIF or other (max:4MB)</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </label>
                    <div className="mb-4">
                        <input type="text"
                            name="capacity"
                            placeholder="Capacity.."
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.capacity}</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <input type="text"
                            name="price"
                            placeholder="Price.."
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.price}</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <input type="text"
                            name="stock"
                            placeholder="rooms available.."
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.stock}</span>
                        </div>
                    </div>
                    {/* General mesage */}
                    {state?.message ? (
                        <div className="mb-4 bg-red-200 p-2">
                            <span className="text-sm text-gray-700 mt-2">{state.message}</span>
                        </div>
                    ) : null}
                    {/* button */}
                    <button type="submit"
                        disabled={isPending}
                        className={clsx("bg-orange-400 text-white w-full hover:bg-orange-500 py-2.5 px-6 md:px-10 text-lg cursor-pointer font-semibold rounded-sm",
                            { "opacity-50 cursor-progress": isPending }
                        )}>
                        {isPending ? "Memproses..." : "SaveRoom"}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default CreateForm