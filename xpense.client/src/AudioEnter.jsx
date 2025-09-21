import React, { useRef, useState } from 'react';

let audioBlob; 

const handleAudioSubmit = (audioBlob) => {
    console.log(audioBlob); // 👈 should show a Blob in console

    const formData = new FormData();
    formData.append("file", audioBlob, "Xpense.webm");

    fetch("http://localhost:5020/api/Audio/SendAudio", {
        method: "POST",
        body: formData
    })
        .then(res => res.text())
        .then(msg => console.log(msg))
        .catch(err => console.error("Upload failed", err));
};


const AudioEnter = ({ onAudioSubmit }) => {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new window.MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                console.log(audioBlob); 
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                if (onAudioSubmit) {

                    onAudioSubmit(audioBlob);
                }
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (err) {
            alert('Microphone access denied or not available.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const resetAudio = () => {
        setAudioUrl(null);
        audioChunksRef.current = [];
    };

    return (
        <>
            <div>
                <button onClick={recording ? stopRecording : startRecording}>
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </button>
                {audioUrl && (
                    <>
                        <div>
                            <audio controls src={audioUrl}></audio>
                            <button onClick={resetAudio}>Reset</button>
                        </div>

                        <div>
                            <input type='button' class="btn btn-primary" id='uploadbttn' value="UPLOAD" onClick={() => handleAudioSubmit(audioBlob)} />
                        </div>
                    </>
                )}
            </div>
        </>
    );

};

export default AudioEnter;