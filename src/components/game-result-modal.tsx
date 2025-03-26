"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Twitter, Facebook } from "lucide-react";
import Image from "next/image";

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    success: boolean;
    word: string;
    timeElapsed: number;
    confidenceLevel: number;
    imageUrl?: string;
    rating?: number;
  };
}

export function GameResultModal({
  isOpen,
  onClose,
  result,
}: GameResultModalProps) {
  const {
    success,
    word,
    timeElapsed,
    confidenceLevel,
    imageUrl,
    rating = 0,
  } = result;

  const shareText = `SpeedSketch ${new Date().toLocaleDateString()}: Drew '${word}' in ${timeElapsed.toFixed(1)}s with a ${rating}-star rating! Beat me!`;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-2xl">
            {success ? (
              <span className="text-green-600">Success!</span>
            ) : (
              <span className="text-red-600">Time's Up!</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {success
              ? `The AI recognized your drawing of "${word}"!`
              : `The AI couldn't recognize your drawing of "${word}" in time. Want to share your masterpiece anyways?`}
          </DialogDescription>
        </DialogHeader>

        {/* Drawing display */}
        {imageUrl && (
          <div className="flex justify-center my-3">
            <div className="border border-gray-200 rounded-lg overflow-hidden w-56 h-56 shadow-sm bg-white">
              <img
                src={imageUrl}
                alt={`Drawing of ${word}`}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* Stats */}
        {success && (
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Time</p>
                <p className="text-lg font-bold text-red-500">
                  {timeElapsed.toFixed(1)}s
                </p>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Rating</p>
                <p className="text-lg font-bold text-blue-500">
                  {rating} stars
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500 font-medium mb-1">
                AI Rating
              </p>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={star <= rating ? "#FFD700" : "none"}
                    stroke={star <= rating ? "#FFD700" : "#D1D5DB"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-0.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Share buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full mt-3">
          <Button
            onClick={shareToTwitter}
            className="flex items-center justify-center gap-2 flex-1 hover:bg-blue-50 transition-colors"
            variant="outline"
            size="sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            <span className="font-medium">Share to X</span>
          </Button>
          <Button
            onClick={shareToFacebook}
            className="flex items-center justify-center gap-2 flex-1 hover:bg-blue-50 transition-colors"
            variant="outline"
            size="sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#1877F2"
              stroke="none"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="font-medium">Facebook</span>
          </Button>
          <Button
            onClick={shareToOther}
            className="flex items-center justify-center gap-2 flex-1 hover:bg-purple-50 transition-colors"
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Share</span>
          </Button>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-3">
          <Button
            onClick={onClose}
            className="w-full bg-black hover:bg-gray-800 text-white text-sm"
            size="sm"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
