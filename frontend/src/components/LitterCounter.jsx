import React, { useState, useEffect } from 'react';

const LitterCounter = ({ target = 124 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [target]);

    const digits = count.toString().padStart(3, '0').split('');

    return (
        <div className="flex flex-col items-center">
            <span className="font-inter text-xs uppercase tracking-[0.4em] text-forest-green/60 mb-6">
                Total Litters Delivered
            </span>
            <div className="flex space-x-2">
                {digits.map((digit, i) => (
                    <div
                        key={i}
                        className="w-16 h-24 bg-forest-green rounded-lg flex items-center justify-center text-champagne-gold font-playfair text-5xl font-bold shadow-xl border border-champagne-gold/20 invert-shadow"
                    >
                        {digit}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LitterCounter;
