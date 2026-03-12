'use client';

import { useEffect } from 'react';

export default function Observer() {
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => { 
                if (e.isIntersecting) { 
                    e.target.classList.add('in'); 
                    obs.unobserve(e.target); 
                } 
            }),
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('.anim').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return null;
}
