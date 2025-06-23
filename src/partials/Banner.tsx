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
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFade(true);
            }, 500);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container-fluid px-0">
            <div className="banner-container w-100">
                <img
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt}
                    className={`img-fluid w-100 banner-image ${fade ? 'fade-in' : 'fade-out'}`}
                />
            </div>
        </div>
    );
}