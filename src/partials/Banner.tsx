import banner1 from '/images/banner1.jpg';
import banner2 from '/images/banner2.png';
import { useEffect, useState } from 'react';
import '../css/Banner.css';

const images = [
    { src: banner1, alt: 'Khuyến mãi 1' },
    { src: banner2, alt: 'Khuyến mãi 2' }
];
export default function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Bắt đầu fade out

            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFade(true); // Bắt đầu fade in
            }, 500); // thời gian fade out (ms)
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <div className="banner-container">
                <img
                    src={images[currentIndex].src}
                    alt="Banner"
                    className={`banner-image ${fade ? 'fade-in' : 'fade-out'}`}
                />
            </div>
        </>
    );
}