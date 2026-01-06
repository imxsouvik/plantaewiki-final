import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera, RefreshCcw, Upload, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client"; // Assuming supabase client is available

const MobileCamera: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    if (!sessionId) {
      setUploadError("Session ID is missing. Please scan the QR code from the desktop application.");
      return;
    }
    setCapturedImage(null);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prioritize rear camera
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setUploadError("Failed to access camera. Please ensure permissions are granted.");
      setIsCameraActive(false);
    }
  }, [sessionId]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9); // Quality 0.9
        setCapturedImage(imageData);
        stopCamera(); // Stop camera after capture
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const uploadPhoto = useCallback(async () => {
    if (!capturedImage || !sessionId) {
      setUploadError("No image captured or session ID missing.");
      return;
    }
    setIsUploading(true);
    setUploadError(null);

    try {
      // Assuming your Supabase Function endpoint is configured correctly
      // And `supabase.functions.invoke` is the correct way to call it
      const { data, error } = await supabase.functions.invoke("upload-mobile-image", {
        body: { image: capturedImage, sessionId: sessionId },
        headers: { "Content-Type": "application/json" },
      });

      if (error) {
        throw new Error(error.message);
      }
      if (data?.error) {
        throw new Error(data.error);
      }

      setUploadSuccess(true);
      // Optionally redirect or show a success message indefinitely
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(`Upload failed: ${err.message || "Unknown error"}`);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  }, [capturedImage, sessionId]);

  useEffect(() => {
    // Start camera automatically on load if session ID is present
    if (sessionId) {
      startCamera();
    }

    return () => {
      stopCamera(); // Cleanup camera stream on component unmount
    };
  }, [sessionId, startCamera, stopCamera]);


  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
        <X className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Invalid Access</h1>
        <p className="text-muted-foreground">This page can only be accessed by scanning a QR code from the desktop application.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold mb-4">Mobile Camera</h1>

      {uploadSuccess ? (
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="h-24 w-24 text-plant-green mb-6 animate-bounce" />
          <p className="text-xl font-semibold mb-2">Image Uploaded Successfully!</p>
          <p className="text-muted-foreground mb-6">Your image has been sent to the desktop application.</p>
          <Button onClick={() => { setUploadSuccess(false); retakePhoto(); }}>Take Another Photo</Button>
        </div>
      ) : uploadError ? (
        <div className="flex flex-col items-center text-center">
          <X className="h-12 w-12 text-destructive mb-4" />
          <p className="text-xl font-semibold mb-2">Error</p>
          <p className="text-destructive mb-4">{uploadError}</p>
          <Button onClick={startCamera}>Retry Camera</Button>
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          {!capturedImage && isCameraActive && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-card">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              ></video>
              <Button
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full h-16 w-16 shadow-lg"
                size="icon"
                onClick={capturePhoto}
                disabled={isUploading}
              >
                <Camera className="h-8 w-8" />
              </Button>
            </div>
          )}

          {capturedImage && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-card">
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                <Button onClick={retakePhoto} variant="secondary" disabled={isUploading}>
                  <RefreshCcw className="h-4 w-4 mr-2" /> Retake
                </Button>
                <Button onClick={uploadPhoto} disabled={isUploading}>
                  {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>
          )}

          {!isCameraActive && !capturedImage && !uploadSuccess && (
            <div className="flex flex-col items-center text-center gap-4">
              <p className="text-muted-foreground">Ready to take a picture for session ID: <span className="font-mono text-primary">{sessionId}</span></p>
              <Button onClick={startCamera}>
                <Camera className="h-5 w-5 mr-2" /> Start Camera
              </Button>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
      )}
    </div>
  );
};

export default MobileCamera;