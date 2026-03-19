import React, { useEffect, useRef } from 'react';

const InteractiveParticles = ({ isLightMode }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let particles = [];
        // INCREASED: Particle count (from 60 to 150)
        const particleCount = 70;
        const mouse = { x: null, y: null, radius: 200 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        };

        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // INCREASED: Particle size (from 1-3px to 2-6px)
                this.size = Math.random() * 1 + 2;

                // NEW: Random velocity for continuous movement
                this.vx = (Math.random() - 0.5) * 1.50;
                this.vy = (Math.random() - 0.5) * 1.50;

                this.density = Math.random() * 30 + 10;
                // INCREASED: Particle opacity (from 0.1/0.15 to 0.4/0.6)
                this.color = isLightMode ? 'rgba(96, 245, 9, 1)' : 'rgba(12, 204, 243, 0.32)';
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // NEW: Apply constant random movement
                this.x += this.vx;
                this.y += this.vy;

                // NEW: Bounce off the edges of the screen
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interaction (push particles away)
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = forceDirectionX * force * this.density;
                        let directionY = forceDirectionY * force * this.density;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        init();

        const connect = () => {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    opacityValue = 1 - distance / 150;

                    if (distance < 150) {
                        // INCREASED: Connecting line opacity (from 0.1 multiplier to 0.4/0.5)
                        ctx.strokeStyle = isLightMode
                            ? `rgba(0, 0, 0, ${opacityValue * 0.5})`
                            : `rgba(0, 212, 255, ${opacityValue * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isLightMode]);

    return (
        <canvas
            ref={canvasRef}
            // CHANGED: z-[1] to z-0 to send it completely to the background
            className="fixed inset-0 pointer-events-none z-[-100]"
            style={{ mixBlendMode: isLightMode ? 'multiply' : 'screen' }}
        />
    );
};

export default InteractiveParticles;