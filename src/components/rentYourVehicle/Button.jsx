export default function Button({ onClick, children }) {
  return (
    <>
      <button
        onClick={onClick}
        className="text-white font-bold rounded-[14px] bg-[linear-gradient(to_right,var(--color-primary),var(--color-primary))] px-[clamp(1.5rem,5vw,3rem)] py-[clamp(0.8rem,2vw,1.2rem)] text-[clamp(0.9rem,2.5vw,1.2rem)] animate-[jump_2.5s_infinite_ease-in-out] transition-all duration-300 shadow-[0_8px_32px_rgba(185,0,0,0.18),0_2px_8px_rgba(0,0,0,0.1)] hover:bg-transparent hover:text-[#333] tracking-[1.1px]"
      >
        {children}
      </button>
    </>
  );
}
