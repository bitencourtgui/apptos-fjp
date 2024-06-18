export const Logo = ({ color }) => {
  if (color === "gold") {
    return <img src="/assets/logos/fjp-gold-mini.png" width={30} height={30} />;
  }

  return <img src="/assets/logos/fjp-simbol.png" width={32} height={26} />;
};
