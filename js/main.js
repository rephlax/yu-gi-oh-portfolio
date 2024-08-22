

document.addEventListener('DOMContentLoaded', () => {
    const deck = document.querySelector('#deck');
    const spots = document.querySelectorAll('#spots > div');
    const fieldSpots = document.querySelectorAll('.card-spots > div');
    let selectedCard = null;

    // Step 1: Move cards from deck to spots
    deck.addEventListener('click', () => {
        spots.forEach((spot, index) => {
            gsap.to(spot, {
                duration: 1,
                x: spot.getBoundingClientRect().left - deck.getBoundingClientRect().left,
                y: spot.getBoundingClientRect().top - deck.getBoundingClientRect().top,
                delay: index * 0.2,
                onComplete: () => {
                    spot.style.position = 'absolute';
                    spot.style.left = `${spot.getBoundingClientRect().left}px`;
                    spot.style.top = `${spot.getBoundingClientRect().top}px`;
                }
            });
        });
    });

    // Step 2: Move cards from spots to field spots
    spots.forEach(spot => {
        spot.addEventListener('click', () => {
            const availableFieldSpot = Array.from(fieldSpots).find(fieldSpot => !fieldSpot.classList.contains('occupied'));
            if (availableFieldSpot) {
                gsap.to(spot, {
                    duration: 1,
                    x: availableFieldSpot.getBoundingClientRect().left - spot.getBoundingClientRect().left,
                    y: availableFieldSpot.getBoundingClientRect().top - spot.getBoundingClientRect().top,
                    onComplete: () => {
                        availableFieldSpot.classList.add('occupied');
                        spot.style.position = 'absolute';
                        spot.style.left = `${availableFieldSpot.getBoundingClientRect().left}px`;
                        spot.style.top = `${availableFieldSpot.getBoundingClientRect().top}px`;
                        spot.classList.add('field-card');
                    }
                });
            }
        });
    });

    // Step 3: Flip card and show modal
    fieldSpots.forEach(fieldSpot => {
        fieldSpot.addEventListener('click', () => {
            if (fieldSpot.classList.contains('occupied')) {
                const card = fieldSpot.querySelector('.spot');
                gsap.to(card, {
                    duration: 0.5,
                    rotationY: 180,
                    onComplete: () => {
                        card.style.backgroundImage = 'none'; // Remove background
                        card.innerHTML = '<h2>About Me</h2>'; // Add title
                        gsap.to(card, {
                            duration: 1,
                            x: window.innerWidth / 2 - card.getBoundingClientRect().left - card.offsetWidth / 2,
                            y: window.innerHeight / 2 - card.getBoundingClientRect().top - card.offsetHeight / 2,
                            scale: 2,
                            onComplete: () => {
                                showModal(card);
                            }
                        });
                    }
                });
            }
        });
    });

    function showModal(card) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <p>This is the About Me page content.</p>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = modal.querySelector('.close');
        closeModal.addEventListener('click', () => {
            gsap.to(card, {
                duration: 1,
                x: card.originalX,
                y: card.originalY,
                scale: 1,
                onComplete: () => {
                    card.style.backgroundImage = 'none'; // Keep the card face up
                    card.innerHTML = '<h2>About Me</h2>'; // Keep the title
                    modal.remove();
                }
            });
        });

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal.click();
            }
        });
    }
});