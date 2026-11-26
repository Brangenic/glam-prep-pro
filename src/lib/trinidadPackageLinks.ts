/** Pure catalogue-to-URL mapping, shared by catalogue generation and pages. */
type PackageDate = { day: string; date: string; display: string };
type PackageProduct = { id: string; day: string };

export function packageDates<T extends PackageDate>(product: PackageProduct, dates: T[]): T[] {
  return dates.filter((d) => product.day === "both" || d.day === product.day);
}

export function packageService(product: PackageProduct) {
  const type = product.id.replace(/^(mon|tue|both)-/, "");
  return ({ makeup: "makeup", "makeup-photo": "makeup-and-photoshoot", photo: "photoshoot" } as Record<string, string>)[type];
}

export function packagePath(product: PackageProduct, dates: PackageDate[]) {
  const selected = packageDates(product, dates);
  const service = packageService(product);
  if (!service || !selected.length) return undefined;
  const days = selected.map((d) => new Date(`${d.date}T00:00:00Z`).getUTCDate());
  const month = new Date(`${selected[0].date}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toLowerCase();
  const slug = product.day === "both" ? `both-days-${days.join("-")}-${month}` : `${selected[0].day}-${days[0]}-${month}`;
  return `/trinidad/book/${service}/${slug}`;
}