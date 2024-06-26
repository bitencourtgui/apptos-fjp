import { crc16ccitt } from "crc";

export interface PixGeneratorParams {
  payloadVersion?: string;
  key: string;
  city: string;
  name: string;
  amount: number;
  transactionId?: string;
  message?: string;
  postalCode?: string;
  currencyCode?: string; //ISO-4217
  countryCode?: string; //ISO-3166-1 alfa 2
}

export function PixGenerator({
  payloadVersion = "01",
  key,
  city,
  name,
  amount,
  transactionId = "***",
  message,
  postalCode,
  currencyCode = "986",
  countryCode = "BR",
}: PixGeneratorParams) {
  if (!payloadVersion.includes("01")) {
    throw Error("Payload Version: not supported.");
  }
  if (!/\b[A-Z]{2}\b/.test(countryCode)) {
    throw Error("Country Code: must be 2 uppercase characteres (ISO-3166 alfa 2).");
  }
  if (typeof currencyCode === "string" && !/\b[0-9]{3}\b/.test(currencyCode)) {
    throw Error(
      "Currency Code: must be a string with 3 uppercase characteres between 000 and 999 (ISO-4217)."
    );
  }
  if (postalCode !== undefined && !/\b[0-9]{8}\b/.test(postalCode)) {
    throw Error("Postal Code: must be 8 numbers.");
  }
  if (amount !== undefined && amount < 0) {
    throw Error("Amount: must be a positive decimal number.");
  }
  if (
    transactionId !== "***" &&
    (transactionId.length > 25 || !/^[A-Z0-9]{1,25}$/.test(transactionId))
  ) {
    throw Error(
      "Transaction ID: must have max 25 characters just including A-Z (uppercase withou accents) and numbers."
    );
  }

  const keyStrPayload = [createEMV("00", "BR.GOV.BCB.PIX"), createEMV("01", key)];
  if (message) {
    keyStrPayload.push(createEMV("02", normalizePayloadString(message, Infinity, false)));
  }

  const strPayload: string = [
    createEMV("00", payloadVersion),
    createEMV("26", keyStrPayload.join("")),
    createEMV("52", "0000"),
    createEMV("53", currencyCode),
    createEMV("54", Number(amount).toFixed(2)),
    createEMV("58", countryCode),
    createEMV("59", normalizePayloadString(name, 25)),
    createEMV("60", normalizePayloadString(city, 15)),
    postalCode ? createEMV("61", postalCode) : "",
    createEMV("62", createEMV("05", transactionId)),
    "6304",
  ]
    .filter((a) => !!a)
    .join("");

  const crcPayload = crc16ccitt(strPayload).toString(16).toUpperCase().padStart(4, "0");
  const payloadPIX = `${strPayload}${crcPayload}`;

  return payloadPIX;
}

const createEMV = (keyId: string, keyValue: string): string => {
  const length = keyValue.length.toString().padStart(2, "0");
  return `${keyId}${length}${keyValue}`;
};

const normalizePayloadString = (str: string, maxSize: number = Infinity, upper: boolean = true) => {
  const res = String(str)
    .substring(0, maxSize)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return upper ? res.toUpperCase() : res;
};

export default PixGenerator;
