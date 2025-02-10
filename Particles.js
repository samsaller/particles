export class Particles {
    constructor(game, particlesQuantity) {
        this.particlesQuantity = particlesQuantity;
        this.connectRadius = 100;
        this.particles = [];
        this.game = game;
        for (let i = 0; i < this.particlesQuantity; i++) {
            let colorR = Math.random() * 255;
            let colorG = Math.random() * 255;
            let colorB = Math.random() * 255;
            this.particles.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                radius: Math.random() * 5 + 1,
                colorR: colorR,
                colorG: colorG,
                colorB: colorB,
                color: `rgb(${colorR}, ${colorG}, ${colorB})`,
                velocity: {
                    x: Math.random() * 2 - 1,
                    y: Math.random() * 2 - 1,
                },
            });
        }
    }
    add(quantity) {
        for (let i = 0; i < quantity; i++) {
            let colorR = Math.random() * 255;
            let colorG = Math.random() * 255;
            let colorB = Math.random() * 255;
            this.particles.push({
                id: this.particles.length + 1,
                x: this.game.width / 2,
                y: this.game.height / 2,
                radius: Math.random() * 5 + 1,
                colorR: colorR,
                colorG: colorG,
                colorB: colorB,
                color: `rgb(${colorR}, ${colorG}, ${colorB})`,
                velocity: {
                    x: Math.random() * 2 - 1,
                    y: Math.random() * 2 - 1,
                },
            });
        }
        this.particlesQuantity += quantity;
    }
    remove(quantity) {
        // ==remove random particles
        for (let i = 0; i < quantity; i++) {
            const randomIndex = Math.floor(
                Math.random() * this.particles.length
            );
            this.particles.splice(randomIndex, 1);
        }

        this.particlesQuantity -= quantity;
        if (this.particlesQuantity - quantity < 0) this.particlesQuantity = 0;
    }
    update(deltaTime) {
        // ==update particles
        this.particles.forEach((particle, index) => {
            particle.x += (particle.velocity.x * deltaTime) / 10;
            particle.y += (particle.velocity.y * deltaTime) / 10;

            if (particle.x < this.game.width - this.game.nonVisibleWidth()) {
                particle.x = this.game.nonVisibleWidth();
            } else if (particle.x > this.game.nonVisibleWidth()) {
                particle.x = this.game.width - this.game.nonVisibleWidth();
            }
            if (particle.y < this.game.height - this.game.nonVisibleHeight()) {
                particle.y = this.game.nonVisibleHeight();
            } else if (particle.y > this.game.nonVisibleHeight()) {
                particle.y = this.game.height - this.game.nonVisibleHeight();
            }

            // ==antigravity on cursor radius if enabled
            if (this.game.cursor.enabled) {
                const cdx = this.game.cursor.x - particle.x;
                const cdy = this.game.cursor.y - particle.y;
                const cdistance = Math.sqrt(cdx * cdx + cdy * cdy);

                if (cdistance <= this.connectRadius * 2) {
                    const pushDistance = this.connectRadius * 2 - cdistance + 1;
                    const angle = Math.atan2(cdy, cdx);

                    particle.x -= Math.cos(angle) * pushDistance;
                    particle.y -= Math.sin(angle) * pushDistance;
                }
            }
        });
        document.querySelector(".particles").innerHTML =
            "Particles: " + this.particlesQuantity;
    }
    draw(context) {
        this.particles.forEach((particle, index) => {
            // ==draw particles
            context.beginPath();
            context.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = particle.color;
            context.fill();

            // ==draw connection radius
            // context.beginPath();
            // context.arc(
            //     particle.x,
            //     particle.y,
            //     this.connectRadius,
            //     0,
            //     Math.PI * 2
            // );
            // context.strokeStyle = particle.color;
            // context.stroke();

            // ==draw connection line
            this.particles.forEach((particle2, index2) => {
                const dx = particle2.x - particle.x;
                const dy = particle2.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= this.connectRadius && index !== index2) {
                    const fullPart = this.connectRadius / 1.5;
                    const alpha =
                        distance <= fullPart
                            ? 1
                            : 1 -
                              (distance - fullPart) /
                                  (this.connectRadius - fullPart);
                    context.beginPath();
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(
                        particle.x + (particle2.x - particle.x) / 2,
                        particle.y + (particle2.y - particle.y) / 2
                    );
                    context.strokeStyle = `rgba(${particle.colorR}, ${particle.colorG}, ${particle.colorB}, ${alpha})`;
                    context.stroke();
                }
                // ==connect to cursor
            });
            if (!this.game.cursor.enabled) {
                const cdx = particle.x - this.game.cursor.x;
                const cdy = particle.y - this.game.cursor.y;
                const cdistance = Math.sqrt(cdx * cdx + cdy * cdy);

                if (cdistance <= this.connectRadius * 2) {
                    const fullPart = (this.connectRadius * 2) / 1.5;
                    const alpha =
                        cdistance <= fullPart
                            ? 1
                            : 1 -
                              (cdistance - fullPart) /
                                  (this.connectRadius * 2 - fullPart);
                    context.beginPath();
                    context.moveTo(particle.x, particle.y);
                    context.lineTo(this.game.cursor.x, this.game.cursor.y);
                    context.strokeStyle = `rgba(${particle.colorR}, ${particle.colorG}, ${particle.colorB}, ${alpha})`;
                    context.stroke();
                }
            }
        });
    }
}
