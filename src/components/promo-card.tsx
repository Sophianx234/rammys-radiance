import Link from "next/link";
import Image from "next/image";

interface PromoCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  bgHex: string;
  className?: string;
}

export function PromoCard({
  eyebrow,
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  bgHex,
  className = "",
}: PromoCardProps) {
  return (
    <div 
      className={`relative overflow-hidden group flex flex-col justify-center h-[400px] w-full ${className}`}
      style={{ backgroundColor: bgHex }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt={title.replace('\n', ' ')}
          fill
          className="object-cover object-center md:object-right transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        {/* Gradient mask to blend the image seamlessly into the solid background on the left */}
        <div 
          className="absolute inset-0 w-full md:w-[75%] h-full pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${bgHex} 45%, ${bgHex}CC 70%, transparent 100%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 w-full sm:w-[75%] h-full">
        {eyebrow && (
          <p className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-3 text-text-main/80">
            {eyebrow}
          </p>
        )}
        
        <h3 className="text-3xl sm:text-4xl font-medium text-text-main leading-[1.15] mb-3">
          {title.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h3>
        
        {description && (
          <p className="text-sm text-text-main/80 mb-6 max-w-[250px] leading-relaxed">
            {description}
          </p>
        )}
        
        <div className={!description ? "mt-5" : ""}>
          <Link
            href={buttonLink}
            className="inline-flex items-center justify-center bg-white text-black px-8 py-3.5 text-xs font-semibold hover:bg-black hover:text-white transition-colors duration-300 shadow-sm"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
