
"use client";

import CarLite from "@/components/icon/carLite";
import { ClosedCaption, Copy, CopyCheck, MessageCircle, Phone, Send, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function FindingRider() {
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState("");
    const [pinCopied, setPinCopied] = useState(false);
    const [showMessagePanel, setShowMessagePanel] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const driver = {
        name: "Rahim Uddin",
        rating: 4.9,
        price: "$120",
        vehicle: "Toyota Hiace",
        plate: "DHK-1243",
        phone: "0123654789",
        pin: [1, 2, 3, 4],
        avatar: "/image/user.png",
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            setShowModal(true);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const copyPin = async () => {
        try {
            const pinStr = driver.pin.join(" ");
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(pinStr);
            } else {
                const el = document.createElement("textarea");
                el.value = pinStr;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }
            setPinCopied(true);
            setTimeout(() => setPinCopied(false), 1500);
        } catch (e) {
            console.error("copy failed", e);
        }
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        // Replace with real API or chat opening
        console.log("Send message to driver:", message);
        setMessage("");
        alert("Message sent to driver (simulated)");
    };

    const handleCancel = () => {
        setShowConfirm(true);
    };

    const confirmCancel = () => {
        setShowConfirm(false);
        setShowModal(false);
        alert("Delivery canceled (simulated)");
    };

    return (
        <div className="relative w-full h-full overflow-hidden">

            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d143819.36248494775!2d90.34025079975383!3d23.727571790390563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b84e57e7da4f%3A0x74e25e8dd9557872!2sRamna%20Park!5e1!3m2!1sen!2sbd!4v1763349595487!5m2!1sen!2sbd"
                className={`absolute inset-0 w-full h-full border-0 transition-all duration-500 ${loading ? "blur-md scale-105" : "blur-0 scale-100"
                    }`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
            />

            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse">
                        Finding the best ride for your pickup time....
                    </p>

                    <div className="flex items-center justify-center">
                        <iframe
                            src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie"
                            className="w-48 h-48 md:w-80 md:h-80"
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Match Modal */}
            {showModal && (
                <>
                    <div className="absolute inset-0 z-60 flex flex-col items-center justify-center
                bg-black/40 backdrop-blur-sm">
                        <h1 className="text-4xl font-medium text-white mb-6">We’ve matched you with a trusted driver for your scheduled delivery</h1>
                        <div className="pointer-events-auto w-[92%] max-w-xl bg-white rounded-xl shadow-lg p-6 mx-4 relative">

                            {/* Close button on top-right */}
                            <div
                                className="absolute -top-0 right-0 bg-[#BF0C0A] cursor-pointer p-2 rounded-bl-3xl"
                                onClick={() => setShowModal(false)}
                            >
                                <X className="text-white w-5 h-5" />
                            </div>

                            <div className="flex items-start justify-between mt-4">
                                <h3 className="text-lg md:text-xl font-semibold text-[#1E1E1C]">Pickup in 3 min</h3>
                                <div className="text-2xl font-medium text-[#1E1E1C]">{driver.price}</div>
                            </div>

                            <div className="flex items-center gap-4 mt-4">
                                <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <div className="font-medium">{driver.name}</div>
                                    <div className="text-sm text-[#0A72B9] flex items-center gap-1"><Star className="inline w-4 h-4" />{driver.rating}</div>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-slate-600">
                                <div className="flex items-center gap-2 text-lg font-medium text-[#4B5563]"><CarLite /><span>{driver.vehicle} • {driver.plate}</span></div>
                            </div>

                            <div className="mt-4 text-lg font-medium text-[#4B5563]">
                                <div className="flex items-center gap-2">
                                    <span>Delivery Verification PIN:</span>
                                    <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
                                    <button onClick={copyPin} className="ml-2 text-sky-600 underline">{pinCopied ? <CopyCheck /> : <Copy />}</button>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-3 w-full">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-[#E5E5E5] text-[#1E1E1C] px-4 py-3 rounded-md flex items-center justify-center gap-2"
                                >
                                    <X />
                                    Cancel this Delivery?
                                </button>

                                <button
                                    onClick={() => setShowMessagePanel(true)}
                                    className="flex-1 bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white px-4 py-3 rounded-md flex items-center justify-center gap-2"
                                >
                                    <MessageCircle />
                                    Message Driver
                                </button>
                            </div>

                        </div>
                    </div>
                </>

            )}

            {/* Message Panel */}
            {showMessagePanel && (
                <div className="absolute top-8 right-8 z-70 w-[542px] bg-white rounded-lg shadow-lg pointer-events-auto">
                    <p className="p-4 text-2xl font-medium text-center text-[#1E1E1C] ">Pickup in 3 min</p>
                    <div className="flex items-center justify-between p-4 ">
                        <div className="flex items-center gap-4 ">
                            <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <div className="font-medium">{driver.name}</div>
                                <div className="text-sm text-[#0A72B9] flex items-center gap-1"><Star className="inline w-4 h-4" />{driver.rating}</div>
                            </div>
                        </div>
                        <p>{driver?.price}</p>
                    </div>

                    <div className="p-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2 text-lg text-[#4B5563]"><CarLite /> <span>{driver.vehicle} • {driver.plate}</span></div>
                        <div className="flex items-center gap-2 mt-2 text-lg text-[#4B5563]"><Phone /> <span>{driver.phone}</span></div>
                        <div className="mt-4 text-lg font-medium text-[#4B5563]">
                            <div className="flex items-center gap-2">
                                <span>Delivery Verification PIN:</span>
                                <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
                                <button onClick={copyPin} className="ml-2 text-sky-600 underline">{pinCopied ? <CopyCheck /> : <Copy />}</button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 ">
                        <div className="flex gap-2">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Message driver"
                                className="flex-1 rounded-md border px-3 py-2 text-sm"
                            />
                            <button onClick={sendMessage} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white flex items-center justify-center"><Send /></button>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm bg-[#E5E5E5] p-4 rounded-lg ">
                            <button onClick={() => { setShowMessagePanel(false); }} className="text-slate-500">Cancel this Delivery?</button>
                            <button onClick={() => { setShowRating(true); }} className="text-red-500">Finish & Rate</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation modal */}
            {showConfirm && (
                <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 max-w-md w-[90%] text-center">
                        <h4 className="text-lg font-semibold">Are you sure you want to cancel this delivery?</h4>
                        <div className="mt-6 flex gap-4 justify-center">
                            <button onClick={() => setShowConfirm(false)} className="px-6 py-2 rounded bg-slate-100">No</button>
                            <button onClick={confirmCancel} className="px-6 py-2 rounded bg-sky-600 text-white">Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rating modal */}
            {showRating && (
                <div className="absolute inset-0 z-80 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-[92%] text-center">
                        <h4 className="text-lg font-semibold">Rate your delivery</h4>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    onMouseEnter={() => setHoverRating(n)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(n)}
                                    className={`text-3xl ${(hoverRating || rating) >= n ? 'text-yellow-400' : 'text-slate-300'}`}
                                >★</button>
                            ))}
                        </div>
                        <button
                            onClick={() => { if (rating > 0) { alert(`Submitted rating: ${rating}`); setShowRating(false); setShowModal(false); setShowMessagePanel(false); } }}
                            disabled={rating === 0}
                            className={`mt-6 w-full py-2 rounded ${rating === 0 ? 'bg-slate-200 text-slate-400' : 'bg-sky-600 text-white'}`}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
