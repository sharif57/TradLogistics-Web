import React from 'react';

export default function Page() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d143819.36248494775!2d90.34025079975383!3d23.727571790390563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b84e57e7da4f%3A0x74e25e8dd9557872!2sRamna%20Park!5e1!3m2!1sen!2sbd!4v1763349595487!5m2!1sen!2sbd"
                style={{ border: 0, width: "100%", height: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
}
