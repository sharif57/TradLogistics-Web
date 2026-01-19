
"use client";

import { useEffect, useState } from "react";

export default function FindingRider() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, []);

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
        </div>
    );
}
