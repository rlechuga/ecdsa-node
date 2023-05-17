function formatWalletAddress(address) {
  const prefix = "0x";
  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return `${prefix}${start}...${end}`;
}

export { formatWalletAddress }