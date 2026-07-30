const buttons = document.querySelectorAll('.square');
const grid = document.getElementById('grid');
let selectedCards = []
const figures = ["😀", "🤕", "😤", "😩", "🤠", "😛", "😽", "🥰"]



for (let i = 0; i < 16; i++) {
    const card = document.createElement('button')
    card.classList.add('square')
    card.innerHTML = figures[Math.floor(Math.random() * figures.length)]
    grid.appendChild(card)
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('clicked');

        setTimeout(() => {
            button.classList.remove('clicked');
        }, 3000);

        selectedCards.push(button);

        console.log(selectedCards); 

    });
});
