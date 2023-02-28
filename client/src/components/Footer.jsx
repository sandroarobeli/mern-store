export default function Footer() {
  return (
    <footer className="flex justify-center items-center h-12 shadow-inner">
      <p className="text-xs md:text-lg font-orbitron">
        Copyright &#169; {new Date().getFullYear()} Internet Store
      </p>
    </footer>
  );
}
