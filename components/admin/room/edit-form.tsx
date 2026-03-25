"use client"

import React, { useActionState, useEffect, useRef, useState, useTransition } from "react"
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5"
import Image from "next/image"
import { BarLoader } from "react-spinners"
import { Amenities } from "@prisma/client"
import { updateRoom } from "@/lib/action"
import clsx from "clsx"
import { RoomProps } from "@/type/room"
import { useRouter } from "next/navigation"
import ConfirmForm from "./confirmform"
import { fa } from "zod/locales"

const EditForm = ({
    amenities,
    room
}: {
    amenities: Amenities[],
    room: RoomProps,
}) => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState("");
    const [pending, startTransiton] = useTransition();
    const originalImage = room.image || "";
    const [previewUrl, setPreviewUrl] = useState(originalImage)
    const router = useRouter();

    const [imageStatus, setImageStatus] = useState<"unchanged" | "new" | "removed">("unchanged")


    const [modal, setModal] = useState(false)
    const [change, setChange] = useState(false)

    const [state, formAction, isPending] = useActionState(updateRoom, {

        prevState: null as any,
        message: '',

    });
    const checkAmenities = room.RoomAmenities.map((item) => item.amenitiesId);
    const PushedRef = useRef(false)

    useEffect(() => {
        if (change && !PushedRef.current) {
            window.history.pushState({ preventBack: true }, '', window.location.href)
            PushedRef.current = true
        };

        const handlePopState = () => {
            if (change)
                setModal(true)
            window.history.pushState({ preventBack: true }, '', window.location.href)
        };
        window.addEventListener('popstate', handlePopState)
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [change])

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;

        if (previewUrl && previewUrl !== originalImage && previewUrl.startsWith('image')) {
            URL.revokeObjectURL(previewUrl)
        }
        const localUrl = URL.createObjectURL(file)
        setPreviewUrl(localUrl)
        setChange(true)
        setImageStatus("new")
        setMessage('')
    }

    const handleRemovePreview = () => {
        if (previewUrl && previewUrl !== originalImage && previewUrl.startsWith('image')) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl('')
        setImageStatus("removed")
        if (inputFileRef.current) inputFileRef.current.value = ''
    }

    const handleCancel = () => {
        if (previewUrl && previewUrl !== originalImage && previewUrl.startsWith('image')) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(originalImage)
        setImageStatus("unchanged")
        if (inputFileRef.current) inputFileRef.current.value = ''
        setMessage('')
        router.push('/admin/room')
    }

    const handleEdit = () => {
        if (change) { setModal(true) }
        else {
            handleCancel()
        }
    }

    const ConfirmCencel = () => {
        setModal(false)
        handleCancel()
        PushedRef.current = false

    }


    return (
        <form action={formAction}>
            {/* 1 */}
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-8 bg-white p-4 rounded-xl shadow-xl">
                    <div className="mb-4">
                        <input type="text"
                            name="name"
                            defaultValue={room.name}
                            onChange={() => setChange(true)}
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
                            onChange={() => setChange(true)}
                            defaultValue={room.description}
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
                                    onChange={() => setChange(true)}
                                    defaultChecked={checkAmenities.includes(item.id)}
                                    defaultValue={item.id}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
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
                <div className="col-span-4 bg-white p-4 shadow-xl rounded-xl">
                    <label
                        htmlFor="input-file"
                        className="flex flex-col mb-4 items-center justify-center aspect-video border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 relative overflow-hidden"
                    >
                        <input
                            type="file"
                            id="input-file"
                            name="image"
                            ref={inputFileRef}
                            onChange={handleFileChange}
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
                    <input type="hidden" name="imageStatus" value={imageStatus} />
                    <input type="hidden" name="originalImage" value={originalImage} />
                    <input type="hidden" name="roomId" value={room.id} />

                    <div className="mb-4">
                        <input type="text"
                            name="capacity"
                            defaultValue={room.capacity}
                            onChange={() => setChange(true)}
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
                            onChange={() => setChange(true)}
                            defaultValue={room.price}
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.price}</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <input type="text"
                            name="stock"
                            defaultValue={room.stock}
                            onChange={() => setChange(true)}
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
                    <div
                        className={clsx(
                            "flex flex-col gap-4 mt-6",
                            change ? "md:grid md:grid-cols-2 md:gap-5" : "md:grid md:grid-cols-1 "
                        )}>

                        <button type="submit"
                            disabled={isPending}
                            className={clsx("bg-orange-400 text-white w-full hover:bg-orange-500 py-2.5 px-6 md:px-10 text-lg cursor-pointer font-semibold rounded-sm",
                                {
                                    "opacity-50 cursor-progress": isPending,
                                    "hidden": !change,
                                    "": change
                                }
                            )}>
                            {isPending ? "Memproses..." : "SaveRoom"}
                        </button>
                        <div
                            onClick={handleEdit}
                            className={clsx(" cursor-pointer rounded-sm py-2.5 px-3 text-center transition-colors w-full text-lg", {
                                "bg-orange-400  text-white font-semibold hover:bg-orange-300": !change,
                                "text-orange-500 font-normal ring ring-orange-500 hover:font-bold": change
                            })}>
                            Cencel
                        </div>


                        <ConfirmForm
                            isOpen={modal}
                            onClose={() => setModal(false)}
                            onConfirm={ConfirmCencel}
                        />

                    </div>

                </div>
            </div >
        </form >
    )
}

export default EditForm