import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="container m-auto mt-4 px-4">{children}</main>
      <Footer />
    </>
  );
}
