/* eslint-disable @next/next/no-img-element */
// /* eslint-disable @next/next/no-img-element */

// "use client";

// import CarLite from "@/components/icon/carLite";
// import {  Copy, CopyCheck, Phone, Send, Star } from "lucide-react";
// import { useEffect, useState } from "react";

// export default function FindingRider() {
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [message, setMessage] = useState("");
//     const [pinCopied, setPinCopied] = useState(false);
//     const [showMessagePanel, setShowMessagePanel] = useState(false);

//     const driver = {
//         name: "Rahim Uddin",
//         rating: 4.9,
//         price: "$120",
//         vehicle: "Toyota Hiace",
//         plate: "DHK-1243",
//         phone: "0123654789",
//         pin: [1, 2, 3, 4],
//         avatar: "/image/user.png",
//     };

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setLoading(false);
//             setShowModal(true);
//         }, 5000); // 5 seconds

//         return () => clearTimeout(timer);
//     }, []);

//     const copyPin = async () => {
//         try {
//             const pinStr = driver.pin.join(" ");
//             if (navigator.clipboard && navigator.clipboard.writeText) {
//                 await navigator.clipboard.writeText(pinStr);
//             } else {
//                 const el = document.createElement("textarea");
//                 el.value = pinStr;
//                 document.body.appendChild(el);
//                 el.select();
//                 document.execCommand("copy");
//                 document.body.removeChild(el);
//             }
//             setPinCopied(true);
//             setTimeout(() => setPinCopied(false), 1500);
//         } catch (e) {
//             console.error("copy failed", e);
//         }
//     };

//     const sendMessage = () => {
//         if (!message.trim()) return;
//         // Replace with real API or chat opening
//         console.log("Send message to driver:", message);
//         setMessage("");
//         alert("Message sent to driver (simulated)");
//     };


//     return (
//         <div className="relative w-full h-full overflow-hidden">

//             <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d143819.36248494775!2d90.34025079975383!3d23.727571790390563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b84e57e7da4f%3A0x74e25e8dd9557872!2sRamna%20Park!5e1!3m2!1sen!2sbd!4v1763349595487!5m2!1sen!2sbd"
//                 className={`absolute inset-0 w-full h-full border-0 transition-all duration-500 ${loading ? "blur-md scale-105" : "blur-0 scale-100"
//                     }`}
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//                 allowFullScreen
//             />

//             {loading && (
//                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
//                     <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse">
//                        Searching for a nearby driver...
//                     </p>

//                     <div className="flex items-center justify-center">
//                         <iframe
//                             src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie"
//                             className="w-48 h-48 md:w-80 md:h-80"
//                         ></iframe>
//                     </div>
//                 </div>
//             )}

           

//             {/* Message Panel */}
//             {showMessagePanel && (
//                 <div className="absolute inset-0 z-60 flex flex-col items-center justify-center
//                 bg-black/40 backdrop-blur-sm">
//                     <div className="absolute top-8 right-0 lg:right-8 z-70 w-full lg:w-[542px] bg-white rounded-lg shadow-lg pointer-events-auto ">
//                         <p className="p-4 text-2xl font-medium text-center text-[#1E1E1C] ">Pickup in 3 min</p>
//                         <div className="flex items-center justify-between p-4 ">
//                             <div className="flex items-center gap-4 ">
//                                 <img src={driver.avatar} alt="driver" className="w-12 h-12 rounded-full object-cover" />
//                                 <div>
//                                     <div className="font-medium">{driver.name}</div>
//                                     <div className="text-sm text-[#0A72B9] flex items-center gap-1"><Star className="inline w-4 h-4" />{driver.rating}</div>
//                                 </div>
//                             </div>
//                             <p>{driver?.price}</p>
//                         </div>

//                         <div className="p-4 text-sm text-slate-700">
//                             <div className="flex items-center gap-2 text-lg text-[#4B5563]"><CarLite /> <span>{driver.vehicle} • {driver.plate}</span></div>
//                             <div className="flex items-center gap-2 mt-2 text-lg text-[#4B5563]"><Phone /> <span>{driver.phone}</span></div>
//                             <div className="mt-4 text-lg font-medium text-[#4B5563]">
//                                 <div className="flex items-center gap-2">
//                                     <span>Delivery Verification PIN:</span>
//                                     <strong className="tracking-widest">{driver.pin.join(" ")}</strong>
//                                     <button onClick={copyPin} className="ml-2 text-sky-600 underline">{pinCopied ? <CopyCheck /> : <Copy />}</button>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="p-4 ">
//                             <div className="flex gap-2">
//                                 <input
//                                     value={message}
//                                     onChange={(e) => setMessage(e.target.value)}
//                                     placeholder="Message driver"
//                                     className="flex-1 rounded-md border px-3 py-2 text-sm"
//                                 />
//                                 <button onClick={sendMessage} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white flex items-center justify-center"><Send /></button>
//                             </div>

//                             <div className="mt-3 flex items-center justify-between text-sm bg-[#E5E5E5] p-4 rounded-lg ">
//                                 <button onClick={() => { setShowMessagePanel(false); }} className="text-slate-500">Cancel this Delivery?</button>
//                                 <button onClick={() => { setShowRating(true); }} className="text-red-500">Finish & Rate</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             )}

           


//         </div>
//     );
// }
"use client";

import CarLite from "@/components/icon/carLite";
import { Copy, CopyCheck, Phone, Send, Star, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function FindingRider() {
    const [loading, setLoading] = useState(true);
    const [showDriverPanel, setShowDriverPanel] = useState(false);
    const [message, setMessage] = useState("");
    const [pinCopied, setPinCopied] = useState(false);

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
            setShowDriverPanel(true); // auto open
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const copyPin = async () => {
        const pinStr = driver.pin.join(" ");
        try {
            await navigator.clipboard.writeText(pinStr);
            setPinCopied(true);
            setTimeout(() => setPinCopied(false), 1500);
        } catch (err) {
            console.error("Copy failed", err);
            const el = document.createElement("textarea");
            el.value = pinStr;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setPinCopied(true);
            setTimeout(() => setPinCopied(false), 1500);
        }
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        console.log("Message to driver:", message);
        setMessage("");
        alert("Message sent (simulation)");
    };

    return (
        <div className="relative w-full h-full overflow-hidden">

            {/* Google Maps background */}
            <iframe
                src="https://www.google.com/maps/embed?pb=..."
                className={`absolute inset-0 w-full h-full border-0 transition-all duration-500 ${
                    loading ? "blur-md scale-105" : "blur-0 scale-100"
                }`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
            />

            {/* Loading screen */}
            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                    <p className="mt-4 text-white text-3xl font-normal text-center animate-pulse">
                        Searching for a nearby driver...
                    </p>
                    <iframe
                        src="https://lottie.host/embed/3cc3045f-0253-4110-8042-ef1f567f99b8/A6ojvct8Uk.lottie"
                        className="w-48 h-48 md:w-80 md:h-80"
                    />
                </div>
            )}

            {/* Top-right driver panel */}
            {showDriverPanel && (
                <div className="absolute top-4 right-4 z-50 w-full max-w-sm md:max-w-md lg:max-w-lg pointer-events-auto">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                        {/* Header with close button */}
                        <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
                            <p className="text-lg font-semibold text-center text-gray-800">
                                Pickup in ~3 min
                            </p>
                            <button
                                onClick={() => setShowDriverPanel(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                                aria-label="Close panel"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Driver info */}
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={driver.avatar}
                                        alt="Driver"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <div>
                                        <div className="font-semibold text-lg">{driver.name}</div>
                                        <div className="flex items-center gap-1 text-sm text-amber-600">
                                            <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                                            {driver.rating}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 space-y-4 text-gray-700">
                                <div className="flex items-center gap-3">
                                    <CarLite  />
                                    <span>{driver.vehicle} • {driver.plate}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 flex-shrink-0" />
                                    <span className="break-all">{driver.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t">
                                    <span className="font-medium whitespace-nowrap">Verification PIN:</span>
                                    <strong className="tracking-widest text-lg">{driver.pin.join(" ")}</strong>
                                    <button
                                        onClick={copyPin}
                                        className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        title="Copy PIN"
                                    >
                                        {pinCopied ? (
                                            <CopyCheck className="w-5 h-5" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Message area */}
                        <div className="px-5 pb-5">
                            <div className="flex gap-2">
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Message driver..."
                                    className="flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="w-11 h-11 rounded-full bg-gradient-to-r from-[#51C7E1] to-[#0776BD] text-white flex items-center justify-center shadow-md flex-shrink-0"
                                    disabled={!message.trim()}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex border-t bg-gray-50 px-5 py-4 text-sm">
                            <button
                                onClick={() => setShowDriverPanel(false)}
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Cancel this Delivery
                            </button>
                            <button className="ml-auto text-red-600 hover:text-red-800 font-medium">
                                Cancel Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}