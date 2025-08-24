import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ThumbnailPreview = ({ 
  thumbnail,
  loading = false,
  error = null,
  onDownload,
  onRetry,
  className,
  textEffects 
}) => {
  if (loading) {
    return <Loading type="thumbnail" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} type="generation" />;
  }

  if (!thumbnail) {
    return (
      <Empty 
        title="Preview Ready"
        description="Enter your title and description, select a style, then generate your thumbnail"
        type="thumbnails"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("space-y-4", className)}
    >
      <Card className="p-0 overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={thumbnail.imageUrl}
            alt={thumbnail.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUUyOTNCIi8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIyNSIgcj0iNDAiIGZpbGw9IiM2MzY2RjEiLz4KPHRleHQgeD0iNDAwIiB5PSIzMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+Cg==";
            }}
          />
          
          {/* Title Overlay */}
<div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
            <div className="text-center">
              <h2 
                className={cn(
                  "text-2xl md:text-3xl font-bold mb-2",
                  textEffects?.gradient?.enabled
                    ? `bg-gradient-${textEffects.gradient.direction} from-[${textEffects.gradient.colors[0]}] to-[${textEffects.gradient.colors[1]}] bg-clip-text text-transparent`
                    : "text-white"
                )}
                style={{
                  textShadow: textEffects?.shadow?.enabled
                    ? `${textEffects.shadow.offsetX}px ${textEffects.shadow.offsetY}px ${textEffects.shadow.blur}px rgba(${parseInt(textEffects.shadow.color.slice(1, 3), 16)}, ${parseInt(textEffects.shadow.color.slice(3, 5), 16)}, ${parseInt(textEffects.shadow.color.slice(5, 7), 16)}, ${textEffects.shadow.opacity})`
                    : '2px 2px 4px rgba(0,0,0,0.7)',
                  WebkitTextStroke: textEffects?.outline?.enabled
                    ? `${textEffects.outline.width}px ${textEffects.outline.color}`
                    : 'none'
                }}
              >
                {thumbnail.title}
              </h2>
              {thumbnail.description && (
                <p 
                  className={cn(
                    "text-base md:text-lg",
                    textEffects?.gradient?.enabled
                      ? `bg-gradient-${textEffects.gradient.direction} from-[${textEffects.gradient.colors[0]}] to-[${textEffects.gradient.colors[1]}] bg-clip-text text-transparent opacity-90`
                      : "text-white/90"
                  )}
                  style={{
                    textShadow: textEffects?.shadow?.enabled
                      ? `${textEffects.shadow.offsetX}px ${textEffects.shadow.offsetY}px ${textEffects.shadow.blur}px rgba(${parseInt(textEffects.shadow.color.slice(1, 3), 16)}, ${parseInt(textEffects.shadow.color.slice(3, 5), 16)}, ${parseInt(textEffects.shadow.color.slice(5, 7), 16)}, ${textEffects.shadow.opacity * 0.8})`
                      : '1px 1px 2px rgba(0,0,0,0.7)',
                    WebkitTextStroke: textEffects?.outline?.enabled
                      ? `${Math.max(1, textEffects.outline.width - 1)}px ${textEffects.outline.color}`
                      : 'none'
                  }}
                >
                  {thumbnail.description}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-surface/50">
          <div className="flex items-center justify-between">
            <div>
<p className="text-sm text-white/70">Style: {thumbnail.style}</p>
              <p className="text-sm text-white/70">Format: {thumbnail.format?.toUpperCase()}</p>
              <p className="text-sm text-white/70">
                Size: {thumbnail.imageSize?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Custom'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">
                {thumbnail.dimensions?.width} x {thumbnail.dimensions?.height}px
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => onDownload("png")}
          variant="primary"
          icon="Download"
          className="flex-1"
        >
          Download PNG
        </Button>
        <Button
          onClick={() => onDownload("jpeg")}
          variant="secondary"
          icon="Download"
          className="flex-1"
        >
          Download JPEG
        </Button>
      </div>
    </motion.div>
  );
};

export default ThumbnailPreview;