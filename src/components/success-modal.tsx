"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Share2, Twitter, Facebook } from "lucide-react";
import Image from "next/image";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  object: string;
  confidence: number;
  time: number;
  imageUrl?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  object,
  confidence,
  time,
  imageUrl,
}: SuccessModalProps) {
  const shareText = `SpeedSketch ${new Date().toLocaleDateString()}: Drew '${object}' in ${time.toFixed(1)}s with ${Math.round(confidence * 100)}% confidence. Beat me!`;

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const shareToOther = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "SpeedSketch Result",
          text: shareText,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(shareText + " " + window.location.href)
        .then(() => alert("Copied to clipboard! You can now paste and share."))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Success!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-green-50 p-4 rounded-lg w-full text-center">
            <p className="text-green-800 font-medium mb-2">
              The AI recognized your drawing!
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-xl font-bold text-red-500">
                  {time.toFixed(1)}s
                </p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-xl font-bold text-blue-500">
                  {Math.round(confidence * 100)}%
                </p>
              </div>
            </div>
            <p className="mt-3 font-medium text-green-700">
              Object: <span className="font-bold">{object}</span>
            </p>
          </div>

          {imageUrl && (
            <div className="relative w-64 h-64 border rounded-md overflow-hidden">
              <Image
                src={imageUrl}
                alt={`Drawing of ${object}`}
                fill
                className="object-contain"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-2 flex-1"
              variant="outline"
            >
              <Twitter className="h-5 w-5" />
              Share to X
            </Button>
            <Button
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-2 flex-1"
              variant="outline"
            >
              <Facebook className="h-5 w-5" />
              Share to Facebook
            </Button>
            <Button
              onClick={shareToOther}
              className="flex items-center justify-center gap-2 flex-1"
              variant="outline"
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
