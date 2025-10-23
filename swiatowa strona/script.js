document.addEventListener('DOMContentLoaded', () => {
    // Referencje do elementów DOM
    const robotTextElement = document.getElementById('robot-text');
    const inputContainer = document.getElementById('input-container');
    const nameInput = document.getElementById('name-input');
    const submitButton = document.getElementById('submit-button');
    const retryButton = document.getElementById('retry-button');
    const finalButton = document.getElementById('final-button');
    const robotElement = document.querySelector('.robot-container');
    const dialogueContainer = document.querySelector('.dialogue-container');
    const emojiContainer = document.getElementById('emoji-container');

    const correctName = 'Emilka';

    // Scenariusz dialogu początkowego
    const initialDialogue = [
        "Hej...",
        "Jesteś dziewczyną Mateusza?",
        "Mówił mi o Tobie, ale nie pamiętam Twojego imienia.",
        "Podaj mi je, proszę."
    ];

    // Funkcja do "pisania" tekstu, zwracająca Promise
    function typeWriter(text) {
        return new Promise(resolve => {
            let i = 0;
            robotTextElement.textContent = '';
            function type() {
                if (i < text.length) {
                    robotTextElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50); // Szybkość pisania
                } else {
                    resolve(); // Zakończ Promise, gdy tekst zostanie napisany
                }
            }
            type();
        });
    }
    
    // Prosta funkcja opóźniająca oparta na Promise
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Funkcja odtwarzająca początkową sekwencję dialogu
    async function playInitialDialogue() {
        for (const line of initialDialogue) {
            await typeWriter(line);
            await delay(1000); // Pauza między liniami
        }
        // Pokaż pole do wpisywania
        inputContainer.classList.remove('hidden');
        nameInput.focus();
    }

    // Funkcja sprawdzająca imię
    function checkName() {
        const enteredName = nameInput.value.trim();
        inputContainer.classList.add('hidden'); // Ukryj pole input

        if (enteredName.toLowerCase() === correctName.toLowerCase()) {
            startSuccessSequence(); // Rozpocznij sekwencję sukcesu
        } else {
            startErrorSequence(); // Rozpocznij sekwencję błędu
        }
    }

    // Sekwencja po błędnej odpowiedzi
    async function startErrorSequence() {
        robotElement.classList.add('robot-error');
        dialogueContainer.classList.add('shake');
        await typeWriter('Nie, to nie jego dziewczyna :(');
        
        setTimeout(() => dialogueContainer.classList.remove('shake'), 500);
        retryButton.classList.remove('hidden');
    }
    
    // Funkcja ponawiania próby
    async function retry() {
        retryButton.classList.add('hidden');
        robotElement.classList.remove('robot-error');
        nameInput.value = '';
        await typeWriter('Spróbujmy jeszcze raz. Jak masz na imię?');
        inputContainer.classList.remove('hidden');
        nameInput.focus();
    }

    // Sekwencja po prawidłowej odpowiedzi
    async function startSuccessSequence() {
        robotElement.classList.add('robot-success');
        await typeWriter(`Tak, to Ty! Hej ${correctName}!`);
        await delay(1500);

        await typeWriter('Mateusz mówił mi, że ma dla Ciebie coś specjalnego...');
        await delay(1500);
        await typeWriter('...ale by to odkryć, musisz trochę się pomęczyć :>');
        await delay(1500);

        await typeWriter('Nie wiesz o co chodzi?');
        await delay(1000);

        // Sekwencja z serduszkami
        robotElement.classList.remove('robot-success');
        robotElement.classList.add('robot-love');
        launchEmojis(8); // Wystrzel 8 emotek
        await delay(500);

        await typeWriter('Haha, no cóż... sama zobaczysz.');
        await delay(2500);

        // Powrót do normalności
        robotElement.classList.remove('robot-love');
        await typeWriter('Myślę, że jesteś gotowa.');
        await delay(1500);
        
        await typeWriter('Kliknij zielony przycisk, który pojawił się na dole.');
        finalButton.classList.remove('hidden');
    }
    
    // Funkcja do wystrzeliwania emotek
    function launchEmojis(count) {
        const emojis = ['❤️', '😍', '💖', '🥰'];
        for (let i = 0; i < count; i++) {
            const emoji = document.createElement('span');
            emoji.classList.add('flying-emoji');
            emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = `${Math.random() * 80 + 10}%`; // Losowa pozycja horyzontalna
            emoji.style.animationDelay = `${Math.random() * 0.8}s`; // Losowe opóźnienie
            emojiContainer.appendChild(emoji);
            
            // Usuń emoji z DOM po zakończeniu animacji
            setTimeout(() => emoji.remove(), 2000);
        }
    }


    // Nasłuchiwanie zdarzeń
    submitButton.addEventListener('click', checkName);
    retryButton.addEventListener('click', retry);
    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') checkName();
    });

    // Rozpocznij całą sekwencję po załadowaniu strony
    (async () => {
        // Na starcie ukryj wszystkie kontrolki
        inputContainer.classList.add('hidden');
        retryButton.classList.add('hidden');
        finalButton.classList.add('hidden');
        
        await delay(1000); // Początkowe opóźnienie
        playInitialDialogue();
    })();
});