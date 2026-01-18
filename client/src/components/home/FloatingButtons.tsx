import { useState, useEffect } from "react";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";

export default function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col space-y-4">
      {isVisible && (
        <button
          className="bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
      <a 
        href="https://wa.me/8001234567" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
