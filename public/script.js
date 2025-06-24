const startButton = document.getElementById('start');
const output = document.getElementById('output');
const statusSpan = document.querySelector('#status span');

startButton.addEventListener('click', async () => {
  startButton.disabled = true;
  startButton.textContent = 'Listening...';
  statusSpan.textContent = 'Listening';
  statusSpan.className = 'status-listening';

  // Get Deepgram key from backend
  const res = await fetch('/deepgram-key');
  const { key } = await res.json();

  const socket = new WebSocket(
    `wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true`,
    ['token', key]
  );

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

  socket.onopen = () => {
    mediaRecorder.start(100); // send every 100ms for faster response

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0 && socket.readyState === 1) {
        socket.send(event.data);
      }
    };
  };

  socket.onmessage = (message) => {
    const received = JSON.parse(message.data);
    const transcript = received.channel?.alternatives[0]?.transcript || '';
    const isFinal = received.is_final;

    if (transcript) {
      if (isFinal) {
        output.value += transcript + '\n';
      } else {
        // show interim result without committing
        const lines = output.value.split('\n');
        lines[lines.length - 1] = transcript;
        output.value = lines.join('\n');
      }
    }
  };

  socket.onerror = err => {
    console.error('WebSocket error:', err);
    statusSpan.textContent = 'Error';
    statusSpan.className = 'status-idle';
    startButton.textContent = 'Start Listening';
    startButton.disabled = false;
  };
});
