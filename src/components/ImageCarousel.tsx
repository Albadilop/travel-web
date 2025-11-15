import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Image {
  id: string;
  image_url: string;
}

interface ImageCarouselProps {
  images: Image[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const ImageCarousel = ({ images, isOpen, onClose, initialIndex = 0 }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Main image */}
          <div className="flex-1 relative flex items-center justify-center bg-black">
            <img
              src={images[currentIndex]?.image_url}
              alt={`Imagen ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 bg-black/20 hover:bg-black/40 text-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 bg-black/20 hover:bg-black/40 text-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="p-4 bg-card border-t border-border">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentIndex
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarousel;