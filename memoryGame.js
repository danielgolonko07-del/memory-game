const buttons = document.querySelectorAll('.square');
let selectedCards = []
const figures = ["😀", "🤕", "😤", "😩", "🤠", "😛", "😽", "🥰"]

buttons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('clicked');

        setTimeout(() => {
            button.classList.remove('clicked');
        }, 1000);

        if (button.classList.contains('clicked')) {
            selectedCards.push(button);
        }

        if (selectedCards.length === 2) {
            if (selectedCards[0].textContent === selectedCards[1].textContent) {
                selectedCards = [];
            }
        }

    });
});
