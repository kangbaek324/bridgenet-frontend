import DonationItem from "./DonationItem";

export default function Donation() {
  return (
    <div className="w-[480px] h-[500px] shadow-2xl rounded-2xl p-6 bg-gradient-to-br from-gray-800 to-black flex flex-col">
      <h1 className="pb-2 text-4xl text-white slow-font">Donation</h1>
      <p className="pb-4 text-white slow-font">Donation For Me 💫</p>

      <DonationItem
        chainName="My Address"
        contractAddress={import.meta.env.VITE_DONATION_ADDRESS}
        imageUrl="/logo/11155111-logo.png"
      />
    </div>
  );
}
