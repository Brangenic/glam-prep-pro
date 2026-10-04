import { Link } from "react-router-dom";
import { useNoindex } from "@/hooks/useNoindex";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// Return pages for the website booking channel. Never shows the booking
// reference (house rule, matches the receipt).
const TrinidadBookResult = ({ paid }: { paid: boolean }) => {
  useNoindex();
  return (
    <>
      <Navbar />
      <main className="min-h-[80svh] flex items-center justify-center px-6 pt-32 pb-20 bg-foreground text-background">
        <div className="max-w-xl text-center">
          <p className="font-body text-xs uppercase tracking-[0.25em] text-primary mb-4">Trinidad Carnival 2027</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-5">{paid ? "Payment received" : "No payment taken"}</h1>
          <p className="font-body text-background/80 mb-8">
            {paid
              ? "Thank you. Your Trinidad Carnival 2027 appointment is paid and your receipt is on its way to your email."
              : "Your payment was not completed, so nothing has been charged. Your time will be released shortly, and you can choose it again."}
          </p>
          <Link to={paid ? "/trinidad-carnival-2027" : "/trinidad/book"} className="inline-block bg-primary text-primary-foreground font-body font-semibold px-8 py-3.5 rounded-full">
            {paid ? "Read the Trinidad 2027 guide" : "Back to booking"}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TrinidadBookResult;
