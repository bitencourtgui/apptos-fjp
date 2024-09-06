import Image from "next/image";

export const Logo = ({ color }: { color?: "gold" }) => {
  if (color === "gold") {
    return (
      <Image
        src="/assets/logos/fjp-gold-mini.png"
        alt="logo fjp mini"
        width={30}
        height={30}
      />
    );
  }

  return <></>;
};
