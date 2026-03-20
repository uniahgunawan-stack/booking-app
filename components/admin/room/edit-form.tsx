"use client"

import { useActionState, useRef, useState, useTransition } from "react"
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5"
import { type PutBlobResult } from "@vercel/blob"
import Image from "next/image"
import { BarLoader } from "react-spinners"
import { Amenities } from "@prisma/client"
import { updateRoom } from "@/lib/action"
import clsx from "clsx"
import { RoomProps } from "@/type/room"

const EditForm = ({
    amenities,
    room
}: {
    amenities: Amenities[],
    room: RoomProps,
}) => {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState(room.image);
    const [message, setMessage] = useState("");
    const [pending, startTransiton] = useTransition();

    const handleUpload = () => {
        if (!inputFileRef.current?.files) return null;
        const file = inputFileRef.current.files[0];
        const formData = new FormData();
        formData.set("file", file);

        startTransiton(async () => {
            try {
                const response = await fetch("/api/upload", {
                    method: "PUT",
                    body: formData
                });
                const data = await response.json();
                if (response.status !== 200) {
                    setMessage(data.message);

                }
                const img = data as PutBlobResult;
                setImage(img.url)
            } catch (error) {
                console.log(error);
            }
        })
    }

    const deleteImage = (image: string) => {
        startTransiton(async () => {
            try {
                await fetch(`/api/upload/?imageUrl=${image}`, {
                    method: "DELETE",
                });
                setImage("");
            } catch (error) {
                console.log(error);
            }
        })
    };

    const [state, formAction, isPending] = useActionState(updateRoom.bind(null, image, room.id), null);
    const checkAmenities = room.RoomAmenities.map((item) => item.amenitiesId);

    return (
        <form action={formAction}>
            {/* 1 */}
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-8 bg-white p-4">
                    <div className="mb-4">
                        <input type="text"
                            name="name"
                            defaultValue={room.name}
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
                <div className="col-span-4 bg-white p-4">
                    <label htmlFor="input-file"
                        className="flex flex-col mb-4 items-center justify-center aspect-video border-2 border-gray-300 border-dashed rounded-e-md cursor-pointer bg-gray-50 relative">
                        <div className="flex flex-col items-center justify-center text-gray-500 pt-5
                            pb-6 z-10">
                            {pending ? <BarLoader /> : null}
                            {image ? (
                                <button type="button"
                                    onClick={() => deleteImage(image)}
                                    className="flex items-center justify-center size-6 bg-red-400 rounded-sm
                                absolute right-1 top-1 text-white hover:bg-red-500">
                                    <IoTrashOutline className="size-4 hover:text-white" />
                                </button>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <IoCloudUploadOutline className="size-8" />
                                    <p className="mb-1 text-sm font-bold">select image</p>
                                    {message ? (
                                        <p className="text-xs text-red-500">{message}</p>
                                    ) : (
                                        <p className="text-xs ">SVG, JPG, PNG, GIF  or other (max:4MB)</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {!image ? (
                            <input type="file"
                                className="hidden"
                                ref={inputFileRef}
                                onChange={handleUpload}
                                id="input-file" />) : (
                            <Image
                                src={image} alt="imageroom"
                                width={640} height={360}
                                className="rounded-md absolute aspect-video object-cover" />
                        )}

                    </label>
                    <div className="mb-4">
                        <input type="text"
                            name="capacity"
                            defaultValue={room.capacity}
                            placeholder="Capacity.."
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.capacity}</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <input type="text"
                            name="price"
                            defaultValue={room.price}
                            placeholder="Price.."
                            className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
                        <div aria-live="polite" aria-atomic="true">
                            <span className="text-sm text-red-500 mt-2">{state?.error?.price}</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <input type="text"
                            name="stock"
                            defaultValue={room.stock}
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
                        className={clsx("bg-orange-400 text-white w-full hover:bg-orange-500 py-2.5 px-6 md:px-10 text-lg cursor-pointer font-semibold",
                            { "opacity-50 cursor-progress": isPending }
                        )}>
                        {isPending ? "Updating... " : "Update"}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default EditForm