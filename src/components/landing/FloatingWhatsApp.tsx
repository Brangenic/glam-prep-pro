const WHATSAPP_URL = "https://wa.link/k63ryp";

const FloatingWhatsApp = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with Carnival Glam Hub on WhatsApp"
    className="fixed right-4 top-1/2 z-50 -translate-y-1/2 rounded-full border p-3 shadow-lg backdrop-blur-md transition-all duration-300 lg:right-6 hover:scale-105"
    style={{
      backgroundColor: "hsl(var(--whatsapp))",
      borderColor: "hsl(var(--whatsapp))",
      color: "hsl(var(--whatsapp-foreground))",
      boxShadow: "0 0 30px -8px hsl(var(--whatsapp) / 0.55)",
    }}
  >
    <span className="sr-only">Open WhatsApp chat</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="h-7 w-7"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M19.11 17.2c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.59.07-.27-.14-1.16-.42-2.2-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.54.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.52-.45-.45-.62-.46-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.27s.98 2.63 1.12 2.81c.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.57.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.06-.11-.25-.18-.52-.32Z" />
      <path d="M16.03 3.2c-7 0-12.68 5.66-12.68 12.64 0 2.22.58 4.39 1.67 6.3L3.2 28.8l6.84-1.79a12.7 12.7 0 0 0 5.99 1.53h.01c6.99 0 12.67-5.67 12.67-12.64S23.03 3.2 16.03 3.2Zm0 23.2h-.01a10.55 10.55 0 0 1-5.37-1.47l-.39-.23-4.06 1.06 1.09-3.95-.25-.41a10.44 10.44 0 0 1-1.61-5.5c0-5.79 4.73-10.5 10.56-10.5 2.82 0 5.47 1.09 7.46 3.07a10.39 10.39 0 0 1 3.1 7.42c0 5.79-4.75 10.51-10.52 10.51Z" />
    </svg>
  </a>
);

export default FloatingWhatsApp;
