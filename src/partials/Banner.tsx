import banner1 from '/images/banner1.jpg';
import banner2 from '/images/banner2.png';
import { useEffect, useState } from 'react';
import '../css/banner.css';

const images = [
    { src: banner1, alt: 'Khuyến mãi 1' },
    { src: banner2, alt: 'Khuyến mãi 2' }
];

export default function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="banner-wrapper position-relative overflow-hidden">
            {images.map((img, index) => (
                <img
                    key={index}
                    src={img.src}
                    alt={img.alt}
                    className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
                />
            ))}

            {/* Điều hướng */}
            <button className="banner-btn left" onClick={prevSlide}>&#10094;</button>
            <button className="banner-btn right" onClick={nextSlide}>&#10095;</button>

            {/* Chấm tròn */}
            <div className="banner-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}
