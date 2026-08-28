// Fondo del hero: blobs a la deriva + grilla enmascarada + ondas radar Doppler.
// Keyframes dp-drift / dp-ripple en globals.css.

const RING_DELAYS = ["0s", "1.75s", "3.5s", "5.25s"];

export default function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ambiente: blobs + grilla, enmascarado hacia los bordes */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "radial-gradient(95% 90% at 60% 38%, #000 0%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(95% 90% at 60% 38%, #000 0%, transparent 92%)",
        }}
      >
        <div
          className="dp-drift absolute rounded-full"
          style={{
            left: "40%",
            top: "-10%",
            width: 720,
            height: 720,
            filter: "blur(80px)",
            background: "radial-gradient(circle, rgba(99,102,241,.55), transparent 68%)",
          }}
        />
        <div
          className="dp-drift absolute rounded-full"
          style={{
            left: "62%",
            top: "22%",
            width: 600,
            height: 600,
            filter: "blur(80px)",
            animationDirection: "reverse",
            animationDuration: "24s",
            background: "radial-gradient(circle, rgba(168,85,247,.45), transparent 68%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(233,233,237,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(233,233,237,.09) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ondas radar */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "radial-gradient(70% 70% at 50% 46%, #000 0%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 46%, #000 0%, transparent 90%)",
        }}
      >
        {RING_DELAYS.map((delay) => (
          <div
            key={delay}
            className="dp-ripple absolute rounded-full"
            style={{
              left: "50%",
              top: "46%",
              width: 1200,
              height: 1200,
              border: "1px solid rgba(165,150,240,.7)",
              animationDelay: delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
