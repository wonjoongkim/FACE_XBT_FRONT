import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import tracking from 'tracking'; // tracking.js 라이브러리
import { Modal, Button } from 'antd';
import './FacePicture.css';

export const FacePicture = (props) => {
    // 상태 변수 초기화
    const [image, setImage] = useState(null);
    const [usingWebcam, setUsingWebcam] = useState(true);

    // Refs 생성
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // 컴포넌트가 마운트되었을 때 실행될 로직

        const handleCapture = async () => {
            // 웹캠 사용 중인 경우 웹캠에서 스크린샷을 캡처하고 이미지 업데이트
            if (usingWebcam) {
                // const imageSrc = webcamRef.current.getScreenshot();
                const imageSrc = webcamRef.current?.getScreenshot();

                setImage(imageSrc);
            }
        };

        // 노트북 카메라 사용으로 변경하고 캡처 수행
        setUsingWebcam(false);
        handleCapture();

        const video = document.getElementById('video');

        if (video) {
            // video 요소가 존재하는지 확인
            const canvas = canvasRef.current;

            if (canvas) {
                // canvas 요소가 존재하는지 확인
                const context = canvas.getContext('2d');

                if (context) {
                    // context가 유효한지 확인

                    // tracking.js를 사용하여 얼굴을 감지
                    const tracker = new tracking.ObjectTracker('face');

                    tracker.setInitialScale(4);
                    tracker.setStepSize(2);
                    tracker.setEdgesDensity(0.1);

                    tracking.track(video, tracker, { camera: true });

                    // 얼굴 감지 시 작업 수행
                    tracker.on('track', (event) => {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        event.data.forEach((rect) => {
                            // Draw a person-shaped area around the detected face
                            context.strokeStyle = '#FF0000';
                            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                            context.beginPath();
                            context.moveTo(rect.x, rect.y);
                            context.lineTo(rect.x + rect.width, rect.y);
                            context.lineTo(rect.x + rect.width / 2, rect.y - rect.height / 2);
                            context.closePath();
                            context.fillStyle = 'rgba(255, 0, 0, 0.3)';
                            context.fill();
                        });
                    });
                } else {
                    console.error('getContext is null');
                }
            } else {
                console.error('canvasRef is null');
            }
        } else {
            console.error('video is null');
        }
    }, []);

    const pictureapi = () => {
        // 사진 전송 api start
        // 사진 전송 api end
        props.face_success();
    };
    const handleCancel = () => {
        setCameraOpen(false);
    };

    const retakeImage = () => {
        setImage(null);
    };

    const cameraStyles = {
        width: '380px', // 원하는 가로 크기로 조정
        height: '220px' // 원하는 세로 크기로 조정
    };

    // HTML 렌더링
    return (
        <div>
            <h1>2차 인증 절차</h1>
            <div>
                {usingWebcam ? (
                    <div>
                        <h2>WebCam을 작동합니다.</h2>
                        {image ? (
                            <img src={image} alt="사진" style={{ width: '500px' }} title={image} />
                        ) : (
                            <Webcam audio={false} height={220} ref={webcamRef} screenshotFormat="image/jpeg" width={380} />
                        )}
                    </div>
                ) : (
                    <>
                        <div>
                            <h2>NoteBook Camera을 작동합니다.</h2>
                            {image ? (
                                <img src={image} alt="사진" style={{ width: '500px' }} title={image} />
                            ) : (
                                <>
                                    <Camera
                                        idealFacingMode={FACING_MODES.USER}
                                        onTakePhoto={(dataUri) => {
                                            setImage(dataUri);
                                            const timeoutId = setTimeout(() => {
                                                pictureapi(dataUri);
                                            }, 3000);
                                            return () => {
                                                clearTimeout(timeoutId);
                                            };
                                        }}
                                        imageType="image/jpeg"
                                        imageOutputType="blob"
                                        height={cameraStyles.height}
                                        width={cameraStyles.width}
                                        style={cameraStyles}
                                    />

                                    <canvas id="canvas" ref={canvasRef}></canvas>
                                </>
                            )}
                        </div>
                    </>
                )}
                {image && (
                    <Button type="primary" onClick={retakeImage}>
                        Retake
                    </Button>
                )}
            </div>
        </div>
    );
};
