import { SvgIcon } from "@mui/material";
import { tokens } from "@/locales/tokens";
import { paths } from "@/paths";
import BankIcon from "@/icons/untitled-ui/duocolor/bank";
import Server05 from "@/icons/untitled-ui/duocolor/server-05";
import Users03Icon from "@/icons/untitled-ui/duocolor/users-03";
import HomeSmileIcon from "@/icons/untitled-ui/duocolor/home-smile";
import FaceIdSquare from "@untitled-ui/icons-react/build/esm/FaceIdSquare";

export const getSections = (t, gt) => [
  {
    items: [
      {
        title: t(tokens.nav.overview),
        path: `/${gt}`,
        icon: (
          <SvgIcon fontSize="small">
            <HomeSmileIcon color="#CFA950" />
          </SvgIcon>
        ),
      },
    ],
  },
  {
    items: [
      {
        title: t(tokens.nav.customers),
        path: `/${gt}/clientes`,
        icon: (
          <SvgIcon fontSize="small">
            <Users03Icon color="#CFA950"/>
          </SvgIcon>
        ),
      },
      {
        title: "Jurídico",
        path: `/juridico`,
        icon: (
          <SvgIcon fontSize="small">
            <BankIcon color="#CFA950" />
          </SvgIcon>
        ),
      },
      {
        title: "Sites",
        icon: (
          <SvgIcon fontSize="small">
            <Server05 color="#CFA950"/>
          </SvgIcon>
        ),
        path: paths.dashboard.orders.index,
        items: [
          {
            title: "ESAJ",
            path: "https://esaj.tjsp.jus.br/sajcas/login?service=https%3A%2F%2Fesaj.tjsp.jus.br%2Fesaj%2Fj_spring_cas_security_check",
          },
        ],
      },
      {
        title: "Usuários",
        path: `/${gt}/usuarios`,
        icon: (
          <SvgIcon fontSize="small">
            <FaceIdSquare color="#CFA950" />
          </SvgIcon>
        ),
      },
    ],
  },
];
