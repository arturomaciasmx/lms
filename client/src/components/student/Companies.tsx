import { assets } from "../../assets/assets";

export default function Companies() {
  return (
    <div className="mt-26 ">
      <p className="text-gray-500 text-center">Trusted by learners from</p>
      <div className="flex items-center justify-center gap-12 md:gap-10 mt-5">
        <img src={assets.microsoft_logo} alt="Microsoft" className="w-20 md:w-38" />
        <img src={assets.walmart_logo} alt="Walmart" className="w-20 md:w-38" />
        <img src={assets.accenture_logo} alt="Accenture" className="w-20 md:w-38" />
        <img src={assets.adobe_logo} alt="Adobe" className="w-20 md:w-38" />
        <img src={assets.paypal_logo} alt="Paypal" className="w-20 md:w-38" />
      </div>
    </div>
  );
}
