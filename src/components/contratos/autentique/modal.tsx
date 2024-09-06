"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { dayjs } from "@/lib/dayjs";
import { PropertyList } from "@/components/core/property-list";
import { PropertyItem } from "@/components/core/property-item";

interface Image {
  id: string;
  url: string;
  fileName: string;
  primary?: boolean;
}

export interface ProductModalProps {
  open: boolean;
  contract?: any;
  handleClose: (open: boolean) => void;
}

export function AutentiqueModal({
  open,
  contract,
  handleClose,
}: ProductModalProps): React.JSX.Element | null {
  return (
    <Dialog
      maxWidth="sm"
      onClose={() => handleClose(false)}
      open={open}
      sx={{
        "& .MuiDialog-container": { justifyContent: "flex-end" },
        "& .MuiDialog-paper": { height: "100%", width: "100%" },
      }}
    >
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flex: "0 0 auto",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={() => handleClose(false)}>
            <XIcon />
          </IconButton>
        </Stack>
        <Stack spacing={3} sx={{ flex: "1 1 auto", overflowY: "auto" }}>
          <Stack spacing={3}>
            {contract?.autentique ? (
              <>
                {contract?.autentique?.signatures.slice(1).map(
                  (signature: any, key: string) => {
                    return (
                      <Card
                        sx={{ borderRadius: 1 }}
                        variant="outlined"
                        key={key}
                      >
                        <PropertyList>
                          <PropertyList>
                            {[
                              {
                                key: "Nome",
                                value: signature.name || signature.user.name,
                              },
                              {
                                key: "Email",
                                value: signature.email || signature.user.email,
                              },
                              { key: "ID Público", value: signature.public_id },
                              {
                                key: "Link",
                                value: signature.link ? (
                                  <a
                                    href={signature.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {signature.link}
                                  </a>
                                ) : (
                                  "N/A"
                                ),
                              },
                            ].map((item) => (
                              <PropertyItem
                                key={item.key}
                                name={item.key}
                                value={item.value}
                              />
                            ))}
                          </PropertyList>
                        </PropertyList>
                      </Card>
                    );
                  },
                )}
              </>
            ) : (
              <></>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
