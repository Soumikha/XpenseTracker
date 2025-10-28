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
            <div className="d-flex flex-column align-items-center mt-4">
                {/* Image on top */}
                <img src="./record.png" width="250" className="mb-3"/>

                {/* Record / Stop button */}
                <button
                    className={`btn ${recording ? 'btn-danger' : 'btn-success'} mb-3`}
                    onClick={recording ? stopRecording : startRecording}
                >
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </button>

                {/* Show audio controls + upload once recording exists */}
                {audioUrl && (
                    <>
                        <div className="d-flex flex-column align-items-center mb-3">
                            <audio controls src={audioUrl} className="mb-2" />
                            <button className="btn btn-secondary mb-2" onClick={resetAudio}>
                                Reset
                            </button>
                        </div>

                        <div>
                            <input
                                type="button"
                                id="uploadbttn"
                                value="Upload"
                                className="btn btn-primary"
                                onClick={() => handleAudioSubmit(audioBlob)}
                            />
                        </div>
                    </>
                )}
            </div>

        </>
    );

};

export default AudioEnter;