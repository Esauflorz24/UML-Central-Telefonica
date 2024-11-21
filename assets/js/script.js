
const descolgarButton = document.getElementById('descolgar');
const marcarButton = document.getElementById('marcar');
const finalizarButton = document.getElementById('finalizar');
const statusDisplay = document.getElementById('status');
const timerDisplay = document.getElementById('timer');
const ringtone = document.getElementById('ringtone');
const conversationDisplay = document.getElementById('conversation');
const phoneNumberInput = document.getElementById('phoneNumber');
const nombre1Input = document.querySelector('[name="nombre1"]');
const nombre2Input = document.querySelector('[name="nombre2"]');
const nuevaLlamadaButton = document.getElementById('nuevaLlamada');

let startTime, countdownInterval;

descolgarButton.addEventListener('click', () => {

    const nombre1 = nombre1Input.value.trim();
    const nombre2 = nombre2Input.value.trim();

    if (nombre1 === "" || nombre2 === "") {
        alert("Por favor, ingresa los nombres de ambos interlocutores.");
        return;
    } else {

        // Estado al descolgar
        statusDisplay.textContent = "Estado: Tono de llamada...";
        phoneNumberInput.disabled = false; // Habilitar el cuadro de texto
        marcarButton.disabled = false;  // Habilitar el botón de marcar
        ringtone.play();  // Reproducir el tono de llamada
        startTime = new Date().getTime();  // Capturar la hora exacta
        startCountdown(30);  // Iniciar el temporizador de 30 segundos

        document.getElementById('central').classList.add('active');
        document.getElementById('interlocutor1').classList.add('active');
    }



});

marcarButton.addEventListener('click', () => {
    const phoneNumber = phoneNumberInput.value.trim();
    descolgarButton.disabled = true;// Deshabilitar el botón de descolgar

    if (phoneNumber === "") {
        alert("Por favor, ingresa un número de teléfono.");
        return;
    }
    const currentTime = new Date().getTime();
    const elapsed = (currentTime - startTime) / 1000;  // Calcular el tiempo transcurrido en segundos

    clearInterval(countdownInterval);  // Detener el contador si se marca

    if (elapsed <= 30) {
        // Si la llamada se marca dentro del tiempo permitido
        statusDisplay.textContent = `Estado: Llamada conectada en ${elapsed.toFixed(2)} segundos.`;
        document.getElementById('interlocutor2').classList.add('active');
        simulateConversation();  // Simular la conversación
        saveCallDetails(elapsed);  // Guardar detalles de la llamada
        finalizarButton.disabled = false;  // Habilitar el botón de finalizar
    } else {
        // Si el tiempo excede los 30 segundos
        statusDisplay.textContent = "Estado: Fallo al marcar. Excedió los 30 segundos.";
    }

    marcarButton.disabled = true;  // Desactivar el botón de marcar
    ringtone.pause();  // Detener el tono
    ringtone.currentTime = 0;  // Reiniciar el tono
});

finalizarButton.addEventListener('click', () => {
    // Finalizar llamada
    statusDisplay.textContent = "Estado: Llamada finalizada.";
    clearInterval(countdownInterval);  // Detener el temporizador
    timerDisplay.textContent = "Llamada finalizada.";
    finalizarButton.disabled = true;  // Deshabilitar el botón de finalizar
    descolgarButton.disabled = true;// Deshabilitar el botón de descolgar
    clearTimeout(conversationTimeout); // Detener mensajes pendientes
});

function startCountdown(seconds) {
    let remainingTime = seconds;
    timerDisplay.textContent = `Tiempo restante: ${remainingTime} segundos`;

    countdownInterval = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = `Tiempo restante: ${remainingTime} segundos`;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);  // Detener el temporizador
            timerDisplay.textContent = "Tiempo agotado";
            marcarButton.disabled = true;  // Desactivar el botón de marcar si el tiempo se agotó
            ringtone.pause();  // Detener el tono
            ringtone.currentTime = 0;  // Reiniciar el tono
        }
    }, 1000);  // Actualizar cada segundo
}

let conversationTimeout; // Declarar una variable global para controlar el timeout

function simulateConversation() {
    const nombre1 = nombre1Input.value.trim() || "Interlocutor 1";
    const nombre2 = nombre2Input.value.trim() || "Interlocutor 2";

    const conversationMessages = [
        `<strong>${nombre1}: </strong> Hola, ¿puedo hablar con <strong>${nombre2}</strong>?`,
        `<strong>${nombre2}: </strong> Hola, soy ${nombre2}. ¿Cómo estás?`,
        `<strong>${nombre1}: </strong> Todo bien, solo quería saber si tienes tiempo para conversar más tarde.`,
        `<strong>${nombre2}: </strong> Claro, ¿a qué hora te va bien?`,
        `<strong>${nombre1}: </strong> ¿Qué te parece a las 4 PM?`,
        `<strong>${nombre2}: </strong> Perfecto, hablamos a esa hora.`
    ];

    let index = 0;

    function displayMessage() {
        if (index < conversationMessages.length) {
            const p = document.createElement('p');
            p.innerHTML = conversationMessages[index];
            p.className = index % 2 === 0 ? 'message-left' : 'message-right';
            conversationDisplay.appendChild(p);
            index++;

            // Usar conversationTimeout para controlar el próximo mensaje
            conversationTimeout = setTimeout(displayMessage, 2000);
        }
    }

    displayMessage();
}

nuevaLlamadaButton.addEventListener('click', () => {
    // Restablecer estados
    descolgarButton.disabled = false;
    marcarButton.disabled = true;
    finalizarButton.disabled = true;
    nuevaLlamadaButton.disabled = true;

    // Restablecer textos y estilos
    statusDisplay.textContent = "Estado: Esperando";
    timerDisplay.textContent = "";
    conversationDisplay.innerHTML = ""; // Limpia la conversación
    phoneNumberInput.value = "";
    nombre1Input.value = "";
    nombre2Input.value = "";

    // Detener sonidos y temporizadores si es necesario
    ringtone.pause();
    ringtone.currentTime = 0;
    clearInterval(countdownInterval);

    // Eliminar estilos activos
    document.getElementById('central').classList.remove('active');
    document.getElementById('interlocutor1').classList.remove('active');
    document.getElementById('interlocutor2').classList.remove('active');
});

// Habilitar el botón de nueva llamada al finalizar
finalizarButton.addEventListener('click', () => {
    statusDisplay.textContent = "Estado: Llamada finalizada.";
    nuevaLlamadaButton.disabled = false;
});




function saveCallDetails(elapsedTime) {
    const phoneNumber = phoneNumberInput.value.trim();
    const nombre1 = nombre1Input.value.trim() || "Interlocutor 1";
    const nombre2 = nombre2Input.value.trim() || "Interlocutor 2";
    const callTime = new Date().toLocaleTimeString();
    const callDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Guardar detalles de la llamada en el servidor
    fetch('save_call.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `numero=${phoneNumber}&interlocutor1=${nombre1}&interlocutor2=${nombre2}&hora=${callTime}&fecha=${callDate}`
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error al guardar los detalles de la llamada:', error));
}

