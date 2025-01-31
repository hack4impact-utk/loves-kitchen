export function parseISOString(iso: string) {
  const arr = iso.split(/\D+/);
  // if (arr.length != 7)
  //     throw new Error("Invalid ISO string");
  return new Date(
    Date.UTC(
      parseInt(arr[0]),
      parseInt(arr[1]) - 1,
      parseInt(arr[2]),
      parseInt(arr[3]),
      parseInt(arr[4]),
      parseInt(arr[5]),
      parseInt(arr[6])
    )
  );
}
