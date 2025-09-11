import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Script from "next/script";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      {process.env.NODE_ENV === "production" && (
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MMWKS311JX" />
      )}
    </>
  );
}
